Light
=====
###A different kind of client-side rendering

Table of Content
----------------
- [Introduction](#intro)
- [Getting Started](#start)
- [Support](#support)

Introduction <a name='intro'></a>
------------
Light is a speedy client-side page renderer. It lets you do what your server is supposed to do, process and render data. Then on the client's end, it just lazily loads the pre-rendered page, without relying on the response times.

Light operates mainly on HTML5's localStorage and pushState, both which are pretty new features. So browser compatibility is an issue.

Features <a name='features'></a>
--------
- Preload rendered page into Javascript
- Renders with Javascript (almost 0 load time)
- Snappy web page performance

Getting Started <a name='start'></a>
---------------
Setting Light up is fairly easy. Just add the link to the script into your HTML files. 

NOTE: It has to be below the jQuery link.
```html
<script src="/static/js/jquery.min.js"></script> <!-- This has to come first -->
<script src="/static/js/light.js"></script> <!-- This second -->
```

Next, you have to define certain things to Light.

Firstly, give a list of links to your HTML files for Light to store.
```javascript
var light_server = light({
                       html: ['home', 'submit', 'login', 'extras/new']
                   });
```
Or better yet, set up your routes like so.

**Node.js (Express)**
```javascript
// This renders html based on their routes
app.get('/views/:html', function(req, res) {
    res.render( req.param('html'), { title: 'View files' } );
});
```
**Client-side**
```javascript
var light_server = light({
                       base_url: 'views',
                       html: ['home', 'submit', 'login']
                   });
```

Support <a name='support'></a>
-------
Any comments or questions, please contact me at guanhao3797@gmail.com or even, tweet to me at [@guanhao97](https://twitter.com/guanhao97).

The code is licensed under the MIT license.
