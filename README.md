Light
=====
###Let's move the server into the browser!

Table of Content
----------------
- [Introduction](#intro)
- [Getting Started](#start)

Introduction <a name='intro'></a>
------------
Fast. Blazing fast. Light is a speedy client-side server. It is to reduce any interactions with the server. And run everything on the client's side. Yes, even a database and a "server" that serves up views.

Light operates mainly on HTML5's local storage and pushState, both which are pretty new features.

Getting Started <a name='start'></a>
---------------
Setting Light up is fairly easy. Just add the link to the script into your HTML files. 

NOTE: It has to be below the jQuery link.
```html
<script src="/static/js/light.js"></script> <!-- This has to come first -->
<script src="/static/js/light.js"></script> <!-- This second -->
```

Next, you have to define certain things to Light.

Firstly, add a link to your templates based on how you set up your server.
```javascript
var light_server = light({
                       html: ['/home', '/submit', '/login']
                   })
```

*That's all I have for now.*

Interested? Contact me at guanhao3797@gmail.com :smile:
