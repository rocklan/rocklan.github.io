---
date: 2018-07-17
category: technical
readtime: true
tags: seq c# dotnet logging
cover-img: /pics/SeqLogging1.png
---

<p>I think <a href="https://getseq.net/">Seq</a> is awesome. For troubleshooting stuff in production, this thing is a goldmine. Let's say I have some code:</p>

```
public int Divide(int x, int y)
{
    int z = x / y;
    return z;
}

int result = Divide(10, 5);
```

<p>With Seq it's extremely easy to add some logging that gives you all the information you need to troubleshoot this function when it's running in production:</p>

<img data-src="/pics/SeqLogging1.png" class="img-responsive lazyload" />

<p>I won't go into any more detail about Seq, you can <a href="https://getseq.net/">read about it yourself</a>, so here's how I set it up.</p>

<h3>Setting up Serilog and Seq for Logging</h3>


<p>We are going to use <a href="https://docs.microsoft.com/en-us/aspnet/core/fundamentals/logging/?view=aspnetcore-2.1">ASP.NET Core's standard logging</a>, <a href="https://serilog.net/">Serilog</a> as the implementation, and <a href="https://getseq.net/">Seq</a> as a <a href="https://github.com/serilog/serilog-sinks-seq">serilog sink</a>. This gives us the most flexibility!</p> 

<p>First off you only need to add <b>two</b> NuGet packages:</p>

```powershell
Install-Package <a href="https://github.com/serilog/serilog-sinks-seq">Serilog.Sinks.Seq</a>
Install-Package <a href="https://github.com/serilog/serilog-aspnetcore">Serilog.AspNetCore</a>
```

<p>Once you have done that, open your Program.cs class and change your Main function to look something like this:</p>

```csharp
using System;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;

using Serilog;
using Serilog.Events;

using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace MyApp
{
    public class Program
    {
        public static int Main(string[] args)
        {
            // yes this is deliberately outside of the try catch because if this
            // fails there's no point in calling the logger :)

            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Verbose()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Error)
                .Enrich.With(new LogEnricher())
                .WriteTo.Seq("myseqserver.com:5341", apiKey: "MyAppsApiKey")
                .CreateLogger();
                    
            try
            {
                Log.Information("Starting up My Project");

                BuildWebHost(args).Run();

                return 0;
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "My Project terminated unexpectedly");
                return 1;
            }
            finally
            {
                // need to flush and close the log otherwise we might miss some
                Log.CloseAndFlush();
            }
        }
        
        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                    .UseStartup<Startup>()
                    .UseSerilog()
                    .Build();
    }
}
```

<p>If you want to customise the Properties that are automatically added, you will need my custom LogEnricher. But you don't <b>need</b> this.</p>

```csharp
class LogEnricher : ILogEventEnricher
{
    public void Enrich(LogEvent le, ILogEventPropertyFactory lepf)
    {
        // these properties are created by asp.net core, I don't need them
        // so I'm going to remove them

        le.RemovePropertyIfPresent("SourceContext");
        le.RemovePropertyIfPresent("RequestId");
        le.RemovePropertyIfPresent("RequestPath");
        le.RemovePropertyIfPresent("ActionId");
        le.RemovePropertyIfPresent("ActionName");

        // however I definitely want to know machine name for each log entry:

        le.AddPropertyIfAbsent(lepf.CreateProperty("MachineName", Environment.MachineName));
    }
}
```

<h3>Writing a log</h3>


<p>To write a log within a class, you can inject it into your controller (or any other class) by adding it to the constructor:</p>


```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace MyApp
{
    [Route("")]
    public class MathsController : Controller
    {
        private ILogger&lt;MathsController&gt; _log;

        public MathsController(ILogger&lt;MathsController&gt; log)
        {
            _log = log;
        }

        [HttpGet("v1/divide")]
        public int Divide(int x, int y)
        {
            int z = x / y;
            _log.LogInformation("Dividing {x} by {y} gives us {z}", inputs.x, inputs.y, z);
            return z;
        }
    }
}
```

<p>You <b>don't have to use dependency injection</b>. However it's quite useful if you want to write a unit test for the Divide function, but you don't want it writing a log every time you run the unit test. In that case, you can just pass through an implementation of ILogger that doesn't do anything, using the great <a href="https://github.com/Moq/moq4/wiki/Quickstart">Moq</a> library:</p>

```csharp
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;

namespace MathsTests
{
    [TestFixture]
    public class Tests
    {
        [Test]
        public void TestDivide()
        {
            var logger = new Mock&lt;Logger&lt;MathsController>>();
            var mathsController = new MathsController(logger.Object);

            var result = mathsController.Divide(10, 2);

            Assert.IsTrue(5, result);
        }
    }
}
```

<p>But having said that, if you don't want to use dependency injection, or if you wish to use Serilog's more fancy features, you can directly access the Serilog.Log singleton:</p>

```csharp
Serilog
    .Log
    .ForContext("Current Base Directory", AppDomain.CurrentDomain.BaseDirectory)
    .Information("Dividing {x} by {y} equals {z}", x, y, z);
```

<h3>Global Error Handling</h3>


<p>For WebApi methods, you can implement a global exception handler by creating your own Middleware like so:</p>

```csharp
public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate next;

    public ErrorHandlingMiddleware(RequestDelegate next)
    {
        this.next = next;
    }

    public async Task Invoke(HttpContext context /* other dependencies */)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            Serilog
                .Log
                .ForContext(new ExceptionEnricher(context))
                .Error(ex, "Global error {Message}", ex.Message);
        }
    }
}
```

<p>and then to use it, add it before your call to .UseMvc() inside your app's Startup.cs:</p>

```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }
    app.UseMiddleware(typeof(ErrorHandlingMiddleware));
    app.UseMvc();
}
```

<p>Which means you'll get some lovely error handling in your logs:</p>

<img data-src="/pics/SeqLogging2.png" class="img-responsive lazyload" />

<h3>Request Input Validation and Logging</h3>


<p>If you wish to automatically validate inputs using DataAnnotations and log any validation errors, you can create your own ActionFilter like so:</p>

```csharp
public class ValidateModelStateAttribute : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext context)
    {
        if (!context.ModelState.IsValid)
        {
            Serilog
                .Log
                .ForContext(new BadRequestEnricher(context.ModelState))
                .Warning("Bad Request to {Path}, bad fields: {NumberOfBadFields}",
                    context.HttpContext.Request.Path, context.ModelState.ErrorCount);

            // return a 400 Bad Request result
            context.Result = new BadRequestObjectResult(context.ModelState);
        }
    }
}

class BadRequestEnricher : ILogEventEnricher
{
    ModelStateDictionary _modelState;
    public BadRequestEnricher(ModelStateDictionary modelState)
    {
        _modelState = modelState;
    }

    public void Enrich(LogEvent le, ILogEventPropertyFactory lepf)
    {
        foreach (var key in _modelState.Keys)
        {
            string message = _modelState[key].Errors[0]?.ErrorMessage;
            le.AddPropertyIfAbsent(
                lepf.CreateProperty("Invalid" + key, message ));
        }
    }
}
```

<p>You can then either add this attribute to your Api or you can add it to run for all routes by editing your Startup.cs:</p>

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services
        .AddMvc(options =>
        {
            options.Filters.Add(typeof(ValidateModelStateAttribute));
        })
```

<p>This should mean that if you use Data Annotaions on your input objects like so:</p>

```csharp
    public class DivideInputDTO
    {
        [Range(0, 100)]
        public int x { get; set; }
        public int y { get; set; }
    }
    
    [HttpGet("v1/divide")]
    public int Divide(DivideInputDTO inputs)
    {
        int z = inputs.x / inputs.y;
        _log.LogInformation("Dividing {x} by {y} gives us {z}", inputs.x, inputs.y, z);
        return z;
    }
```

<p>(BTW can you spot the <b>"bug"</b>? Let me give you a minute...)</p>

<p>...</p>

<p>(Yes, there is no validation on the y property! Divide by zero is still possible!)
<br />
<p>Anyway, you will now log lovely validation messages:</p>

<img data-src="/pics/SeqLogging3.png" class="img-responsive lazyload" />

<h3>Is that it?</h3>


<p>I'm quite happy with this setup and it's been serving me well. What have I missed? I'm sure something else obvious!</p>

<p>Many thanks to <a href="https://twitter.com/_bron_">Bron</a>'s <a href="http://blog.angelwebdesigns.com.au/structured-logging-with-serilog-in-asp-net-core/">serilog in aspnet core</a> article and of course the <a href="https://github.com/serilog/serilog-aspnetcore">aspnet core serilog</a> docs, and also of course Seq's own <a href="https://docs.getseq.net/docs/using-serilog">using serilog</a> and <a href="https://docs.getseq.net/docs/using-aspnet-core">using aspnet core</a>. 
</p>
