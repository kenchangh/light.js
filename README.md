Light.js
=====
####Renders the future in light-speed!

Table of Content
----------------
- [Introduction](#intro)
- [How Does It Work?](#workings)
- [Getting Started](#start)
- [Support](#support)

Introduction <a name='intro'></a>
------------
Light.js is a speedy client side pre-renderer. What a mouthful, what do you mean?! Light.js stores all your html files in the localStorage and then renders it **right away**, without the need for connection.

How Does It Work? <a name='workings'></a>
-----------------
First, you have to pass in routes of your site. Light.js will then make Ajax requests to each of them, then storing them into the user's browser's localStorage. When the user visits to one of the urls, Light.js serves up the page from the localStorage, *with light speed*. This is so fast because all the browser needs to do is render the HTML, no need for making connections.

How do you keep the pages stored by Light.js updated? That's why Light.js works closely with socket.io. When the server changes the content of the webpage, it will notify the user's browser through web sockets and Light.js will remake the Ajax request, store the page and then ready to serve it up to the user.

You can, however, choose not to keep it dynamic by telling Light.js so.

Features <a name='features'></a>
--------
- Preload rendered page into Javascript
- Renders with Javascript (almost 0 load time)

Getting Started <a name='start'></a>
---------------
Setting Light.js up is fairly easy. Just add the link to the script into your HTML files. 

NOTE: It has to be below the jQuery link.
```html
<script src="/static/js/jquery.min.js"></script> <!-- This has to come first -->
<script src="/static/js/socket.io-client.js"></script> <!-- This second (if you want things dynamic) -->
<script src="/static/js/light.js"></script> <!-- Finally! -->
```

Next, you have to define certain things to Light.

Firstly, give a list of links to your HTML files for Light to store.
```javascript
var light = new Light('/', '/new', '/top');
```

Support <a name='support'></a>
-------
Any comments or questions, please contact me at guanhao3797@gmail.com or even, tweet to me at [@mavenave](https://twitter.com/guanhao97).

The code is licensed under the MIT license.
