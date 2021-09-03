---
date: 2018-02-14
category: technical
readtime: true
cover-img: /pics/throttling/throttling.gif
tags: c# dotnet throttling api
---

<p>Can someone DOS attack your API and bring down your webservice? Could I hit your API at 100 requests a second and bring down your server? Or can you throttle your users like this?</p>

<img data-src="/pics/throttling/throttling.png" alt="Homer throttling Bart" class="img-responsive lazyload" />

<p>Sorry, I couldn't resist. How about like this?</p>

<img data-src="/pics/throttling/throttling.gif" alt="throttling animated gif" class="img-responsive lazyload"  >
<br />
<p>If the answer is no, the good news is that it's quite easy to do in ASP.NET. You can use the fully featured <a href="https://github.com/stefanprodan/WebApiThrottle">WebApiThrottle</a>, or if you don't need something fancy you can build it yourself.</p>

<h2> Table Of Contents </h2>

1. <a href="#starting-off">Starting Off</a>
2. <a href="#show-me-the-limit">Show me the limit(ing)!</a>
3. <a href="#cleaning-up-the-code">Cleaning up the code</a>
4. <a href="#be-nice-to-your-clients">Being nice to your clients</a>
5. <a href="#creating-an-attribute">Creating an attribute</a>
6. <a href="#how-to-use-it">How to use it</a>
7. <a href="#update">Update!</a>

<h2 id="starting-off">Starting Off</h2>

<p>Let's start with the basic WebApi project template:</p>

```csharp
public class ValuesController : ApiController
{
    // GET api/values
    public IEnumerable<string> Get()
    {
        return new string[] { "value1", "value2" };
    }
}
```
    
<p>Let's change the method so that it's returning a HttpResponseMessage object instead of an array of strings. This will give us more flexibility and make it easier to return different response codes.</p>

```csharp
public HttpResponseMessage Get()
{
    return Request.CreateResponse(HttpStatusCode.OK,  new string[] { "value1", "value2" });
}
```

<p>and let's also change it to use WebApi2 and JSON responses, first off by modifying WebApiConfig:</p>

```csharp
public static class WebApiConfig
{
    public static void Register(HttpConfiguration config)
    {
        config.MapHttpAttributeRoutes();
        config.Formatters.Remove(config.Formatters.XmlFormatter);
    }
}
```

<p>and then by adding the right attributes and changing it to return "Hello World":</p>

```csharp
[HttpGet]
[Route("~/api/helloworld")]
public HttpResponseMessage HelloWorld()
{
        return Request.CreateResponse(HttpStatusCode.OK, "Hello World");
}
```

    
<p>Nice. Hitting our API in the browser should now show "Hello World":</p>

<img data-src="/pics/throttling/1-helloworld.png" class="img-responsive lazyload" alt="hello world" />

<h2 id="show-me-the-limit">Show me the limit(ing)!</h2>


<p>Now let's implement a super-basic rate limiter:</p>

```csharp
[HttpGet]
[Route("~/api/helloworld")]
public HttpResponseMessage HelloWorld()
{
    int? requestCount = (int?)System.Web.HttpRuntime.Cache["throttle"];

    if (!requestCount.HasValue) requestCount = 0;

    requestCount++;

    HttpRuntime.Cache["throttle"] = requestCount;

    if (requestCount > 10) return Request.CreateResponse((HttpStatusCode)429, "Too many requests");

    return Request.CreateResponse(HttpStatusCode.OK, "Hello World");
}
```

<p>Hitting our API ten times should then return a lovely <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429">429 "Too Many Requests"</a> response:</p>

<img data-src="/pics/throttling/2-toomanyrequests.png" class="img-responsive lazyload" alt="too many requests" />

<h3>Don't use that code!</h3>


<p>There's a problem here. When can I start making requests again? The answer is... you can't! Not until the web application restarts. Not cool. So we need a way to make sure that after a time limit, the request count resets. How about we make further use of the <a href="https://docs.microsoft.com/en-us/dotnet/api/system.web.caching.cache">HttpRuntime.Cache</a> object? Let's set our cache object to expire in 10 seconds:</p>

```csharp
[HttpGet]
[Route("~/api/helloworld")]
public HttpResponseMessage HelloWorld()
{
    ThrottleInfo throttleInfo = (ThrottleInfo)HttpRuntime.Cache["throttle"];

    if (throttleInfo == null)
        throttleInfo = new ThrottleInfo { 
                    ExpiresAt = DateTime.Now.AddSeconds(10), RequestCount = 0 };

    throttleInfo.RequestCount++;

    HttpRuntime.Cache.Add("throttle", throttleInfo, null, 
        throttleInfo.ExpiresAt, Cache.NoSlidingExpiration, 
                CacheItemPriority.Normal, null);

    if (throttleInfo.RequestCount > 10) 
            return Request.CreateResponse((HttpStatusCode)429, "Too many requests");

    return Request.CreateResponse(HttpStatusCode.OK, "Hello World");
}

private class ThrottleInfo
{
    public DateTime ExpiresAt { get; set; }
    public int RequestCount { get; set; }
}
```

<p>Hang on... what's with the ThrottleInfo object?</p>

<p>The problem that we have with the Cache object is that there's no way to <b>update</b> a value in it without resetting the timeout window! This means we need to keep track of the expiration date, and whenever we update the <b>RequestCount</b> value, we also need to <b>re</b>specify the original expiration date. </p>

<p>If you hit your API 11 times, and then wait 10 seconds, and then hit it again, you should see your next request is allowed! Cool!</p>

<h2 id="cleaning-up-the-code">Cleaning up the code</h2>


<p>Let's clean up the code a bit shall we?</p>

```csharp
public class ValuesController : ApiController
{
    [HttpGet]
    [Route("~/api/helloworld")]
    public HttpResponseMessage HelloWorld()
    {
        var throttler = new Throttler("helloworld");

        if (throttler.RequestShouldBeThrottled())
                    return Request.CreateResponse(
                        (HttpStatusCode)429, "Too many requests");

        return Request.CreateResponse(HttpStatusCode.OK, "Hello World");
    }
}

public class Throttler
{
    private int _requestLimit;
    private int _timeoutInSeconds;
    private string _key;

    public Throttler(string key, int requestLimit = 5, int timeoutInSeconds = 10)
    {
        _requestLimit = requestLimit;
        _timeoutInSeconds = timeoutInSeconds;
        _key = key;
    }

    public bool RequestShouldBeThrottled()
    {
        ThrottleInfo throttleInfo = (ThrottleInfo)HttpRuntime.Cache[_key];

        if (throttleInfo == null) throttleInfo = new ThrottleInfo {
                ExpiresAt = DateTime.Now.AddSeconds(_timeoutInSeconds),
                RequestCount = 0
        };

        throttleInfo.RequestCount++;

        HttpRuntime.Cache.Add(_key,
            throttleInfo,
            null,
            throttleInfo.ExpiresAt,
            Cache.NoSlidingExpiration,
            CacheItemPriority.Normal,
            null);

        return (throttleInfo.RequestCount > _requestLimit);
    }

    private class ThrottleInfo
    {
        public DateTime ExpiresAt { get; set; }
        public int RequestCount { get; set; }
    }
}
```

Oh hang on.. do we really need to depend on the HttpRuntime.Cache object? Not really. It's not providing much value here except for the expiry of request info. If we want to remove the dependency on the HttpRuntime to make unit testing simpler we can just use a ConcurrentDictionary, which also means in future we could swap it out for a database store or something else. Let's do that:

```csharp
public class Throttler
{
    private int _requestLimit;
    private int _timeoutInSeconds;
    private string _key;
    private static ConcurrentDictionary&lt;string, ThrottleInfo&gt; _cache = 
        new ConcurrentDictionary&lt;string, ThrottleInfo&gt;();

    public Throttler(string key, int requestLimit = 5, int timeoutInSeconds = 10)
    {
        _requestLimit = requestLimit;
        _timeoutInSeconds = timeoutInSeconds;
        _key = key;
    }

    public bool RequestShouldBeThrottled()
    {
        ThrottleInfo throttleInfo = _cache.ContainsKey(_key) ? _cache[_key] : null;

        if (throttleInfo == null || throttleInfo.ExpiresAt <= DateTime.Now) 
        {
            throttleInfo = new ThrottleInfo {
                ExpiresAt = DateTime.Now.AddSeconds(_timeoutInSeconds),
                RequestCount = 0};
        };

        throttleInfo.RequestCount++;
        
        _cache[_key] = throttleInfo;

        return (throttleInfo.RequestCount > _requestLimit);
    }

    private class ThrottleInfo
    {
        public DateTime ExpiresAt { get; set; }
        public int RequestCount { get; set; }
    }
}
```

We now have our lovely self contained Throttler class for throttling our WebApi methods.

So what can we do with our lovely throttle object? Well, we can throttle each method separately:
 
```csharp
[HttpGet]
[Route("~/api/helloworld")]
public HttpResponseMessage HelloWorld()
{
    var throttler = new Throttler("helloworld");

    if (throttler.RequestShouldBeThrottled())
            return Request.CreateResponse(
                (HttpStatusCode)429, "Too many requests");

    return Request.CreateResponse(HttpStatusCode.OK, "Hello World");
}

[HttpGet]
[Route("~/api/updatesomething")]
public HttpResponseMessage UpdateSomething()
{
    var throttler = new Throttler("updatesomething");

    if (throttler.RequestShouldBeThrottled())
            return Request.CreateResponse(
                (HttpStatusCode)429, "Too many requests");
            
    // update something here

    return Request.CreateResponse(HttpStatusCode.OK, "Data updated");
}
```

Or even better, we can throttle based on IP address:

```csharp
[HttpGet]
[Route("~/api/helloworld")]
public HttpResponseMessage HelloWorld()
{
    var ipAddress = System.Web.HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
    var throttler = new Throttler(ipAddress);
```
    
Or how about we throttle individual users?

```csharp
[HttpGet]
[Route("~/api/helloworld")]
public HttpResponseMessage HelloWorld()
{
    var throttler = new Throttler(User.Identity.Name);
```


<h2 id="be-nice-to-your-clients">Being nice to your clients</h2>

<p>But wait.. how are your clients expected to keep track of when they have gone over their limit and when the reset window will be? Well, it's a bit unfair of us to not provide this info to them if we already have it.</p>

<p>Don't worry, just use the standard HTTP headers. Oh wait. </p>

<a href="https://stackoverflow.com/questions/16022624/examples-of-http-api-rate-limiting-http-response-headers">There is no standard</a>

Sigh. Ok, let's settle on using Github's headers and also include Vimeo's "Reset" header too.

```csharp
[HttpGet]
[Route("~/api/helloworld")]
public HttpResponseMessage HelloWorld()
{
    var throttler = new Throttler(User.Identity.Name);

    HttpResponseMessage response = createResponse("Hello World", throttler);

    return response;
}

private HttpResponseMessage createResponse(object content, Throttler throttler)
{
    HttpResponseMessage response;

    if (throttler.RequestShouldBeThrottled())
        response = Request.CreateResponse((HttpStatusCode)429, "Too many requests");
    else
        response = Request.CreateResponse(HttpStatusCode.OK, content);

    response.Headers.Add("X-RateLimit-Limit", throttler.RequestLimit.ToString());
    response.Headers.Add("X-RateLimit-Remaining", throttler.RequestsRemaining.ToString());
    response.Headers.Add("X-RateLimit-Reset", toUnixTime(throttler.WindowResetDate).ToString());

    return response;
}

private long toUnixTime(DateTime date)
{
    var epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
    return Convert.ToInt64((date.ToUniversalTime() - epoch).TotalSeconds);
}
```

And let's add the code in to support returning our three new headers:


```csharp
public class Throttler
{
    public int RequestLimit { get; private set; }
    public int RequestsRemaining { get; private set; }
    public DateTime WindowResetDate { get; private set; }
    private static ConcurrentDictionary&lt;string, ThrottleInfo&gt; _cache = 
        new ConcurrentDictionary&lt;string, ThrottleInfo&gt;();

    private string _key;
    private int _timeoutInSeconds;

    public Throttler(string key, int requestLimit = 5, int timeoutInSeconds = 10)
    {
        RequestLimit = requestLimit;
        _timeoutInSeconds = timeoutInSeconds;
        _key = key;
    }

    public bool RequestShouldBeThrottled()
    {
        ThrottleInfo throttleInfo = _cache.ContainsKey(_key) ? _cache[_key] : null;

        if (throttleInfo == null || throttleInfo.ExpiresAt <= DateTime.Now) 
        {
            throttleInfo = new ThrottleInfo {
                ExpiresAt = DateTime.Now.AddSeconds(_timeoutInSeconds),
                RequestCount = 0};
        };

        WindowResetDate = throttleInfo.ExpiresAt;

        throttleInfo.RequestCount++;

        _cache[ThrottleGroup] = throttleInfo;

        RequestsRemaining = Math.Max(RequestLimit - throttleInfo.RequestCount, 0);

        return (throttleInfo.RequestCount > RequestLimit);
    }

    private class ThrottleInfo
    {
        public DateTime ExpiresAt { get; set; }
        public int RequestCount { get; set; }
    }
}
```

<h2  id="creating-an-attribute">Creating an attribute</h2>

<p>The main downside to this implementation is that we have to create a new instance of our Throttle class and call RequestShouldBeThrottled() each time. This is a bit of a pain and some duplicate code, how about we create our own <a href="https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/attributes/">Attribute</a> that can be simply added to each WebApi method? </p>
<p>Let's create a new filter attribute:</p>

<script src="https://gist.github.com/rocklan/8a20c52431efe083603f9f0f2a18e6f3.js?file=ThrottleFilter.cs"></script>

<p>Now we're getting somewhere! We've added three new features:</p>
<ol><li>We can throttle based on the client's IP address </li>
<li>We can throttle based on the client's identity</li>
<li>The request count is only incremented upon a successful request</li>
</ol>

<p>Now let's update our throttling class to support modifying the group dynamically:</p>

<script src="https://gist.github.com/rocklan/8a20c52431efe083603f9f0f2a18e6f3.js?file=Throttler.cs"></script>

<p>Phew!</p>

<h2 id="how-to-use-it">How to use it</h2>


<p>Basic usage for throttling requests:</p>

```csharp
[ThrottleFilter()]
[HttpGet]
[Route("~/api/helloworld")]
public HttpResponseMessage HelloWorld()
{
  return Request.CreateResponse(HttpStatusCode.OK, "Hello World");
}
```


<p>Allow more requests through, say 50 every 5 seconds:</p>

```csharp
[ThrottleFilter(RequestLimit: 50, TimeoutInSeconds: 5)]
[HttpGet]
[Route("~/api/allow-more")]
public HttpResponseMessage HelloWorld2()
{
    return Request.CreateResponse(HttpStatusCode.OK, "Hello World2");
}
```


<p>Throttling a group of requests together:</p>

```csharp
[ThrottleFilter(ThrottleGroup: "updates")]
[HttpPost]
[Route("~/api/name")]
public HttpResponseMessage UpdateName(UpdateNameDTO NameUpdate)
{
    // update name here
    return Request.CreateResponse(HttpStatusCode.OK, "Name updated ok");
}

[ThrottleFilter(ThrottleGroup: "updates")]
[HttpPost]
[Route("~/api/address")]
public HttpResponseMessage UpdateAddress(UpdateAddressDTO AddressUpdate)
{
    // update address here
    return Request.CreateResponse(HttpStatusCode.OK, "Address updated ok");
}
```


<p>Throttling based on IP address:</p>
  
```csharp
[ThrottleFilter(ThrottleGroup: "ipaddress")]
[HttpGet]
[Route("~/api/name")]
public HttpResponseMessage GetName(int id)
{
    return Request.CreateResponse(HttpStatusCode.OK, "John Smith");
}
```

<p>Throttling based on Identity:</p>
  
```csharp
[ThrottleFilter(ThrottleGroup: "identity")]
[HttpGet]
[Route("~/api/name")]
public HttpResponseMessage GetName(int id)
{
    return Request.CreateResponse(HttpStatusCode.OK, "Jane Doe");
}
```
  

<p>Enjoy!</p>

<h2 id="update">Update!</h2>


<p>After posting this article on reddit's csharp forum, <a href="https://www.reddit.com/r/csharp/comments/7xuxy3/throttling_your_api_in_aspnet/ducda9q/?context=2">user ArSoron left a great comment</a> showing a fix for a potential race condition in the code. It turns out using ConcurrentDictionary is not enough, you need to make sure to use the <b>AddOrUpdate</b> method, like so:</p>

```csharp
public void IncrementRequestCount()
{
    _cache.AddOrUpdate(ThrottleGroup, new ThrottleInfo
    {
            ExpiresAt = DateTime.Now.AddSeconds(_timeoutInSeconds),
            RequestCount = 1
    }, (retrievedKey, throttleInfo) =>
    {
            Interlocked.Increment(ref throttleInfo.RequestCount);
            return throttleInfo;
    });
}
```

<p>He also points out that ThrottleInfo could be changed to a struct for slightly better performance. Thanks mate!</p>

