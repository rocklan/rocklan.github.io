---
date: 2011-01-04
category: technical
readtime: true
---
Classic ASP, is there anything it can't do?

Well, if you're looking at doing nice and friendly URLs, like the one for this post:

<a href="http://www.metaltheater.com/post/Friendly-URLs-in-classic-ASP">http://www.metaltheater.com/post/Friendly-URLs-in-classic-ASP</a> 

Yes, you can do it in ASP!

Your first step is to open up IIS, click on your home directory and then go to properties. Then go to the "Custom Errors" tab, and scroll down to "404":

<img src="/pics/404.png" style='float: none' alt="Setting up nice URLs in classic ASP" />

edit this entry, and change the message type to be "URL", and set the URL to "/404.asp":

<img src="/pics/404b.png" style='float: none' alt="Setting up nice URLs in classic ASP" />

(Oh yeah, create a file named 404.asp in your root directory).

Alright, now you'll notice that any request that goes to your site will go to this file. So try it, go to:
```
http://localhost/test-page
```

and you should get a blank screen. This is hitting your 404 ASP page! Now you need to put some logic in redirect the user to the page that shows your blog post. Eg, my links used to look like this:
```
http://www.metaltheater.com/code/article.asp?Id=200
```

So now, I need to scan the URL for the title of a blog post, check in the DB to see if it can find the blog title, and then transfer the user to the old URL. One little gotcha is that you cannot pass through parameters! So you actually have to transfer the user to "article.asp", and put the ID value into the session. A little bit dodgy, but it works ok.

So my code looks something like this:

```vb

urlText = Request.ServerVariables("Query_String")
slashSpot = inStrRev(urlText, "/")

if ( mid(urlText, slashSpot-4, 4) = "blog") then

    title = mid(urlText, slashSpot+1, len(urlText))
    titletransformed = replace(title, "-", "%" )
    titletransformed = replace(titletransformed, "%27", "''" )
		
    sql = "select id from posts where title like ?" 
	
    set rs = dbwrapper.executeSql(sql, titleTransformed)

    session("PostId") = "-1"
		
    if not rs.eof then

        session("PostId") = cstr(rs("id"))

    end if        

end if

rs.close

server.transfer "/code/article.asp"

```

Then article.asp checks the session object. If it's set to -1, then it displays a 404 error page, but it needs to set the response code to 404, so sites like google recognise the page as not found. This is really easy in ASP, just do:

```
response.status = "404 File Not Found"
```

You can then return any content you like. 

And voila! SEO friendly URLs :)