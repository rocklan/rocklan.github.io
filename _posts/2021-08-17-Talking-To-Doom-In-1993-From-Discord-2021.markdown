---
layout: post
title:  "Talking To 1993 From 2021"
date:   2021-08-17 15:54:08 +1000
categories: blog technical csharp dotnet discord doom zandronum
---

Did you know that multiplayer doom is still alive and kicking? Nope, not Doom Eternal. Not 2016 Doom.. but 1993 doom! Thanks to the legends who work on [Zandronum](https://zandronum.com), you can play deathmatch or co-operative play over the internet using the original doom engine. Except the engine has been improved for the modern age - 3D acceleration, higher resolutions, transparency, better lighting effects. But it's still the original Doom.

 
A few friends and I started playing Doom online, and we quickly discovered it's a lot more fun with real-time voice chat. So we added a Discord Server and chat over that while we're playing. Then I thought it would be fun if we could post updates from the Doom Server direct to Discord.
 

And that's where the real fun began.

 

First off, write a discord bot. Using <a href="https://github.com/discord-net/Discord.Net" target="_blank">discord.net</a> we can connect to a discord server and send a message:

```csharp
var discordClient = new DiscordSocketClient();

bool isReady = false;

discordClient.Ready += () => {
    isReady = true;
    return Task.CompletedTask;
};

discordClient.MessageReceived += (socket) => {

    if (socket.Content == "Hi testbot")
        socket.Channel.SendMessageAsync("Hi, " + socket.Author.ToString());

    return Task.CompletedTask;
}

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
 

This little block of code connects to Discord using the "BotToken" credentials, and then sends a "Hello world" message to the "bot-testing" channel. If someone types "Hi testbot" into the chat it will reply with "Hi -username-". Pretty cool. There's a good guide on <a href="https://docs.stillu.cc/guides/getting_started/first-bot.html">setting up a discord.net bot here</a>.

 

Once this was working I threw it into a <a href="https://docs.microsoft.com/en-us/aspnet/core/fundamentals/host/hosted-services">hosted service</a>, which basically looked like this:

 
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

Freaking sweet.

Now we need to get it to talk to our Doom Server, which is named Zandronum.

Zandronum has two different protocols you can use to talk to it. One is named the <a href="https://wiki.zandronum.com/Launcher_protocol">Launcher Protocol</a> and the other is the <a href="https://wiki.zandronum.com/RCon_protocol">RCon (Remote Console) Protocol</a>. Both operate over UDP, and both are pretty "simple".

I say simple, but of course the devil is in the details. The most complicated part is that every message is compressed using <a href="https://en.wikipedia.org/wiki/Huffman_coding">Huffman coding</a>. But not your normal, every-day protocol, but one with a customised unique tree. Example code is provided in java and python... but I'm a c# dev.

Fortunately, <a href="https://twitter.com/bananaboysam">Sam Izzo</a> is a games developer and a very smart guy, and he was able to get the basics of the UDP Launcher Protocol working. We could send messages to the server! The "Launcher" protocol seems to deal with unauthenticated requests, so you can query a public doom server and ask some basic questions like 'how many players are online' and 'what is the current map'. Behind the scenes it's what tools like <a href="https://doomseeker.drdteam.org/">DoomSeeker</a> use.

Once we had that up and running, I was able to extend it to add support for the "Rcon" protocol. The "Remote Console" protocol is for sending messages to a doom server and reading back Console text, all over UDP.

Once all of this code was up and running, I bundled it into a <a href="https://github.com/rocklan/zanstat">nuget package</a> so that nobody else has to go through the same pain again! It seems to be reasonably stable but I'm sure there's always bugs.

Then it was a matter of hooking the two up. We needed to be able to read console data from the zandronum server and stream it back to Discord. So let's do that:

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

<img src="doombot-output.png" />

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

<img src="doombot-commands.png" />

 

Awesome!