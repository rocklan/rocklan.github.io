---
date: 2023-01-04
category: technical
tags: c# polly circuit-breaker aspnet
title: Adding a circuit breaker to your ASP.NET application
cover-img: /images/blue-beaked-parrot.png
thumbnail-img: /images/polly-logo.png
readtime: true
hidden: true
share-description: Let's say you needed to update your SSL certificates on IIS, across a whole lot of servers. Do you want to do it all manually? Heck no.
excerpt: Let's say you needed to update your SSL certificates on IIS, across a whole lot of servers. Do you want to do it all manually? Heck no. Let's hack something together in powershell to make it work. The method binding.AddSslCertificate() is the one you're looking for!
---

If your application is making many calls to an API that periodically fails, it can be handy to set up some kind of "<a href="https://en.wikipedia.org/wiki/Circuit_breaker_design_pattern" target="_blank">circuit breaker</a>" to stop your code from making unnecessary calls to an API that you know is down.

ASP.NET suggests using a library named <a href="https://www.thepollyproject.org/" target="_blank">Polly</a> for this, and it's fantastic, but it's also not exactly clear how to implement it properly... especially when you need **multiple** circuit breakers. So let's do it.

## Using Polly in your ASP.NET 6 application

In this example we have an application that calls two API's - one is the <a href="https://developers.google.com/maps/documentation/timezone/overview">google timezone API</a>, which is called by using a standard `HttpClient`, and another is Redis, which uses it's own [custom client](https://github.com/StackExchange/StackExchange.Redis/).  

As a first step, create a few policies and add them to a [PolicyRegistry](https://github.com/App-vNext/Polly/wiki/PolicyRegistry){:target="_blank"}. This is done so that each individual class can specify which policy it wishes to use.

In your `Program.cs` file:

```csharp
WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// I'm using Serilog, if you are using something else, you can add it here
PollyPolicies circuitBreakerManager = new PollyPolicies(Serilog.Log.Logger);

// The creation of the policies is inside the PollyPolicies class. This is done
// just so that they are grouped together in one place alongside the logging
var googleApiCircuitBreakerPolicy = circuitBreakerManager.GetGoogleApiCircuitBreakerPolicy();
var redisCircuitBreakerPolicy = circuitBreakerManager.GetRedisCircuitBreakerPolicy();

// We add our policies to a Registry which is just a glorified List<>. 
builder.Services.AddPolicyRegistry(new PolicyRegistry()
{
    { PollyPolicies.GooglePolicyName, googleApiCircuitBreakerPolicy },
    { PollyPolicies.RedisPolicyName, redisCircuitBreakerPolicy }
});

// When we setup our HttpClient, we need to also add the "addPolicyHandler" call as shown:
builder.Services.AddHttpClient<IGoogleTimezoneService, GoogleTimezoneService>()
    .AddPolicyHandler(googleApiCircuitBreakerPolicy);

...

app.Run();
```

Now we need to create our Policies, so create a file named `PollyPolicies.cs`:

```csharp
public class PollyPolicies
{
    public const string GooglePolicyName = "googleApiCircuitBreaker";
    public const string RedisPolicyName = "redisCircuitBreaker";

    private readonly Serilog.ILogger _logger;

    public PollyPolicies(Serilog.ILogger logger)
    {
        _logger = logger;
    }

    public IAsyncPolicy<HttpResponseMessage> GetGoogleApiCircuitBreakerPolicy()
    {
        // The google API is called using a HttpClient, so we can use the handy
        // HandleTransientHttpError() call. But this will not catch timeouts!
        // Make sure to fine-tune these numbers for your specific use-case

        return HttpPolicyExtensions
            .HandleTransientHttpError()
            .AdvancedCircuitBreakerAsync(
                failureThreshold: 0.1,
                samplingDuration: TimeSpan.FromSeconds(20),
                minimumThroughput: 5,
                durationOfBreak: TimeSpan.FromSeconds(60),
                this.OnGoogleBreak,
                this.OnGoogleReset,
                this.OnGoogleHalfOpen);
    }

    public AsyncCircuitBreakerPolicy GetRedisCircuitBreakerPolicy()
    {
        // The Redis API throws quite a few different exceptions (about 5) depending
        // on what the problem is, so we're just going to handle any exception:

        return Policy.Handle<Exception>().AdvancedCircuitBreakerAsync(
            failureThreshold: 0.01,
            samplingDuration: TimeSpan.FromSeconds(5),
            minimumThroughput: 15,
            durationOfBreak: TimeSpan.FromSeconds(360),
            this.OnRedisBreak,
            this.OnRedisReset,
            this.OnRedisHalfOpen);
    }

    public void OnGoogleReset()
    {
        _logger?.Warning("Google API circuit closed, requests flow normally.");
    }

    public void OnGoogleHalfOpen()
    {
        _logger?.Warning("Google API circuit half open");
    }

    public void OnGoogleBreak(DelegateResult<HttpResponseMessage> result, TimeSpan ts)
    {
        _logger?.Warning("Google API circuit cut because {ResultStatusCode} " +
            "or {Exception}, so requests will not flow.",
            result.Exception, result.Result?.StatusCode);
    }

    public void OnRedisReset()
    {
        _logger?.Warning("Redis circuit closed, requests flow normally.");
    }

    public void OnRedisHalfOpen()
    {
        _logger?.Warning("Redis circuit half open");
    }

    public void OnRedisBreak(Exception result, TimeSpan ts)
    {
        _logger?.Warning("Redis circuit cut because {Exception}, " + 
            "so requests will not flow.", result);
    }
}
```

We've now added two different circuit breaker policies that we can use in our code wherever we want. Let's go ahead and use this policy in some of our code.

## Using the circuit breaker

Now we need to update our code that calls the google API to use our circuit breaker. The cool part of the previous call to `AddPolicyHandler()` that is chained to the `AddHttpClient` call means that it will be used automatically! I'm not sure if this is cool or a bit too magical, but that's what you need to do.

```csharp
public partial class GoogleTimezoneService : IGoogleTimezoneService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<GoogleTimezoneService> _logger;
    private readonly ICircuitBreakerPolicy<HttpResponseMessage> _breaker;

    public GoogleTimezoneService(
        HttpClient httpClient, 
        ILogger<GoogleTimezoneService> logger, 
        IReadOnlyPolicyRegistry<string> pollyPolicyRegistry)
    {
        _logger = logger;
        _httpClient = httpClient;
        _breaker = pollyPolicyRegistry.Get<ICircuitBreakerPolicy<HttpResponseMessage>>(
            PollyPolicyNames.GooglePolicyName);
    }

    public async Task<string> GetResponseContentAsync(string endpoint)
    {
        try
        {
            // This is a bit of optimisation. When the circuit breaker is closed, it 
            // will throw a BrokenCircuitException if we try to use it. However if we 
            // know it's closed, there's no point in making the request and throwing
            // the exception, so let's just return
            if (_breaker.CircuitState == CircuitState.Open || 
                _breaker.CircuitState == CircuitState.Isolated)
                return null;

            HttpResponseMessage response = await _httpClient.GetAsync(endpoint);
            return await response.Content.ReadAsStringAsync();
        }
        catch (BrokenCircuitException ex)
        {
            // this can happen when the circuit has been set to half open, and 
            // we are verifying that it's back up, but it's not, so it throws a
            // BrokenCircuitException, so in that case, we might as well log it 
            // and just return null
            _logger.LogWarning("Exception {e} when trying to re-open circuit for " + 
                "google timezone api at {Url}", 
                ex, _httpClient.BaseAddress + endpoint);
                
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogWarning("Exception {e} when calling google timezone api at {Url}", 
                ex, _httpClient.BaseAddress + endpoint);

            return null;
        }
    }
}
```

Now we need to update our Redis code to use our circuit breaker. In this case we need to retrieve it from the polly registry and then use it. We are going to use the `ExecuteAsync()` call, which executes any code you want, and behaves like how we defined it in the policy. In this case  if the code throws any `Exception`, it will handle it according to our desired circuit breaker policy logic. 

```csharp
public class RedisCache
{
    private readonly ILogger<RedisCache> _logger;
    private readonly AsyncCircuitBreakerPolicy _circuitBreakerPolicy;

    public RedisCache(ILogger<RedisCache> logger, 
                      IReadOnlyPolicyRegistry<string> pollyPolicyRegistry)
    {
        _logger = logger;
        _circuitBreakerPolicy = pollyPolicyRegistry.Get<AsyncCircuitBreakerPolicy>(
             PollyPolicyNames.RedisPolicyName);
    }
    
    ...
    
    // returns a string from redis
    public async Task<string> GetStringAsync(string key)
    {
        // this stops us from making the call if the circuit is open. If we take
        // this out, the ExecuteAsync() method below will throw a BrokenCircuitException
        // on every call, so this is just a performance optimisation:
        
        if (_circuitBreakerPolicy.CircuitState == CircuitState.Open || 
            _circuitBreakerPolicy.CircuitState == CircuitState.Isolated)
            return null;

        // Where the magic happens. ExecuteAsync will handle and then re-raise any 
        // exceptions thrown, so we need to catch them here too.
        try
        {
            return await _circuitBreakerPolicy.ExecuteAsync(() =>
                _redisClient.GetStringAsync(key));
        }
        catch (Exception e)
        {
            _logger.LogWarning("Error with Redis when fetching {key}: {e}", key, e);
            return null;
        }
    }
}
```

And that's the bare minimum that you need to be able to enforce a circuit breaker for any code that might throw an exception.

## Adding extra policies 
If you would also like to use other policies like automatic retries, you can add them at startup:

```csharp
var retryPolicy = HttpPolicyExtensions
    .HandleTransientHttpError()
    .WaitAndRetryAsync(3, retryNumber => TimeSpan.FromSeconds(1));
```

and you can chain policies together:

```csharp
builder.Services.AddHttpClient<IGoogleTimezoneService, GoogleTimezoneService>()
    .AddPolicyHandler(googleApiRetryPolicy)
    .AddPolicyHandler(googleApiCircuitBreakerPolicy);
```

That should be enough to get you started. Now make sure you test your circuit breaker code! It's easy to get wrong!