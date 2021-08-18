---
date:   2021-08-17
category: technical
tags: discord c# dotnet zandronum udp nuget 
cover-img: /images/doomguys.png
readtime: true
---
Did you know that multiplayer doom is still alive and kicking? Nope, not Doom Eternal. Not 2016 Doom.. but 1993 doom! Thanks to the legends who work on [Zandronum](https://zandronum.com), you can play deathmatch or co-operative play over the internet using the original doom engine. Except the engine has been improved for the modern age - 3D acceleration, higher resolutions, transparency, better lighting effects... it's still the original Doom, just *more awesomer*:

![image-title-here](/images/zandronum-aa.png){:class="img-responsive"}
 
A few friends and I started playing Doom online, and we quickly discovered it's a lot more fun with real-time voice chat. So we added a Discord Server, and we chat over that while we're playing. It's great fun! Except... being a nerd... I want **more**. 

The problem that I was having was administering the doom server. Simple things like changing maps, changing the difficulty and seeing which players have died, is difficult. It's hard for anyone else to do, and it's hard to see what's going on. What I really wanted was a way of typing commands into Discord and controlling Zandronum. Plus, it would be really nice if we could receive messages from Zandronum, telling us what's going on. 

### Writing the Discord Bot

So to get started, I needed to write a c# discord bot. I found a great library named <a href="https://github.com/discord-net/Discord.Net" target="_blank">discord.net</a> that I could use to connect to a discord server and send a message:

```csharp
var discordClient = new DiscordSocketClient();

discordClient.MessageReceived += (socket) => {
    if (socket.Content == "Hi testbot")
        socket.Channel.SendMessageAsync("Hi, " + socket.Author.ToString());
    return Task.CompletedTask;
}

await discordClient.LoginAsync(TokenType.Bot, "MyBotTokenCredentials");
```


This little block of code connects to Discord using the `MyBotTokenCredentials`, and then if someone types `Hi testbot` into the chat it will reply with `Hi -username-`. Pretty cool! Of course the first order of the day was to make it reply with the classic Dad joke:

![image-title-here](/images/doombot-dadjoke.png){:class="img-responsive"}

On reflection this was as good as it was going to get so I probably should have just stopped here. But anyway, there's a good guide on <a href="https://docs.stillu.cc/guides/getting_started/first-bot.html">setting up a discord.net bot here</a> that I followed if you want to have a crack at it yourself.

So once this was working I needed it to run in Azure, as part of an always-running asp.net application. So I threw it into a <a href="https://docs.microsoft.com/en-us/aspnet/core/fundamentals/host/hosted-services">hosted service</a>, which basically looked like this:

 
```csharp
private DiscordSocketClient _discordClient;
 
protected override async Task ExecuteAsync(CancellationToken stoppingToken)
{
    // initialise the _discordClient here, then connect:
    ...
    _discordClient.MessageReceived += _client_MessageReceived;
    await _discordClient.StartAsync();
}
 
private async Task _client_MessageReceived(SocketMessage arg)
{
    if (args.Content.StartsWith("!doombot"))
    {
        ... do something clever
    }
}
``` 

Freaking sweet. Oh by the way, one little gotcha is that if you want to send stuff to a channel at bot startup, you have to wait until your bot is online:

```csharp
var discordClient = new DiscordSocketClient();

bool isReady = false;

discordClient.Ready += () => {
    isReady = true;
    return Task.CompletedTask;
};

await discordClient.LoginAsync(TokenType.Bot, "BotToken");

while (!_isReady)
    System.Threading.Thread.Sleep(1000);

var botTestingChannel = _discordClient
    .Guilds
    .First()
    .Channels
    .First(x => x.Name == "bot-testing") as IMessageChannel;
   
await botTestingChannel.SendMessageAsync("Hello world!");</pre>
```

That one took me a while to figure out! 

So that's the Discord bot side of things worked out. Now we need to get it to talk to our Doom Server, which is named Zandronum.

### Talking to Zandronum over UDP

Zandronum has two different protocols you can use to talk to it. One is named the <a href="https://wiki.zandronum.com/Launcher_protocol">Launcher Protocol</a> that operates over UDP. It deals with unauthenticated requests, so you can query a public doom server and ask some basic questions like 'how many players are online' and 'what is the current map'. Behind the scenes it's what tools like <a href="https://doomseeker.drdteam.org/">DoomSeeker</a> use.

I say simple, but of course the devil is in the details. The most complicated part is that every message is compressed using <a href="https://en.wikipedia.org/wiki/Huffman_coding">Huffman coding</a>... but for some reason with a hard-coded customised unique tree. There is some example code provided in java and python.... but nothing dotnet! 

Fortunately, <a href="https://twitter.com/bananaboysam">Sam Izzo</a> is a games developer and a very smart guy, and he was able to get the basics of the UDP Launcher Protocol working. We could send messages to the server! Here's the console app dumping out some basic info:

![image-title-here](/images/zandronum-query.png){:class="img-responsive"}

The next step was to try to make it do something more interesting - we needed to be able to authenticate and send through some commands. For that, we need to use the <a href="https://wiki.zandronum.com/RCon_protocol">RCon (Remote Console) Protocol</a>. The protocol is very similar, but we have to do a handshake first, and then we can start streaming messages from the doom console, and sending it commands. In this convoluted screenshot, you can see the Zandronum server running, and you can see the console application in the background dumping out what's going on:

![image-title-here](/images/zandronum-zanstat.png){:class="img-responsive"}

### Zandronum dotnet NuGet Package

Once all of this code was up and running, I bundled it into a <a href="https://github.com/rocklan/zanstat">nuget package</a> so that nobody else has to go through the same pain again! It seems to be reasonably stable but I'm sure there's always bugs.

## Putting it all together

Now it's a matter of gluing the two together. We needed to be able to read and write console data from the zandronum server and stream it back to Discord. So let's do that:

```csharp
var zandronum = new Zandronum(_zandronumServer, _zandronumPort);
zandronum.Rcon.ServerMessage += (sender, eventArgs) =>
{
    ZandronumMessageEventArgs ea = e as ZandronumMessageEventArgs;
    botTestingChannel.SendMessageAsync(ea.Message);
};
zandronum.Rcon.ConnectToRcon(_zandronumRConPassword);
```

Now let's add some bots to a server (in this case, named Chubbs, Crash and Gamma) and see what happens:

<img src="/images/doombot-output.png" />

Cool! Now let's hook up the bot to be able to pass commands back to the server:

```csharp
discordClient.MessageReceived += (socket) => {
    if (socket.Content.StartsWith("!doom ")) {
        string rconCommand = arg.Content.Substring(6, arg.Content.Length - 6);
        _zandronum.Rcon.SendCommand(rconCommand);
    }
    return Task.CompletedTask;
}
```

And let's give it a shot:

<img src="/images/doombot-commands.png" />

So far it's been running ok and it's pretty stable. The discord.net library is very nice in that it handles disconnections and re-connects!  

The next step would be to implement [discord's slash commands](https://blog.discord.com/slash-commands-are-here-8db0a385d9e6)... but maybe that's for version 2! :)
