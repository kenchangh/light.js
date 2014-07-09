/*
 * Author: Maverick Chan
 * License: MIT License
 */

// Use $jq for jQuery
var $jq = jQuery.noConflict(true);

// Make log shortcut to console.log
var log = console.log.bind(console);

// Called when browser does not support feature
function FeatureUnsupported(message) {
  this.message = message;
  this.name = "FeatureUnsupported";
}

// Called function does not correspond with settings
function SettingsIncorrect(message) {
  this.message = message;
  this.name = "SettingsIncorrect";
}

// Checks if browser supports Storage
function supportStorage() {
  try {
    return 'Storage' in window &&
    window['Storage'] !== null;
  }
  catch(e) {
    return false;
  }
}

// Light takes in an object, html as key, values as array of routes
// { html: ['/', '/home', '/login'] }
function Light(settings) {

  var light = this;

  /* =================================
      Setting up routes
      Storing HTML into sessionStorage
     ================================= */

  light.storeViews = function() {

    // Run function only once per page
    light.storeViews = Function('');

    if (typeof settings == 'undefined') {
      settings = {};
    }

    if ( settings.hasOwnProperty('html') ) {
      var routes = settings.html;
     
      // If base_url is given, just concat it before every route
      if ( settings.hasOwnProperty('baseUrl')  ) {
        for (var i = 0; i < routes.length; i++) {
            routes[i] = '/' + settings.baseUrl + '/' + routes[i];
        }
      }
    }
    else {
      var routes = [];
      var links = document.getElementsByTagName("a");
      // A vanilla method is much, much faster
      for (var i = 0; i < links.length; i++) {
        routes.push(links[i].pathname); 
      }
    }

    var total_size = 0;
    // Iterates through routes and make Ajax requests to them
    routes.forEach(function(route) {
      $jq.ajax({
        url: route,
        success: function(html) {
          // If supported, iterate through html_dict object
          // And store it in sessionStorage
          if ( supportStorage() ) {
            // Compress HTML and insert sessionStorage
            var comprHtml = LZString.compress(html);

            // Sums up total storage size
            var file_size = comprHtml.length;
            total_size += file_size;
            // Makes sessionStorage size accessible
            Light.prototype.storageSize = total_size;

            // Assigns compressed html to route
            sessionStorage[route] = comprHtml;

            // Creates tokens to make sure Light only runs once
            sessionStorage['light_token'] = 'ran';
            log('html stored!');
          }
          else {
            throw new FeatureUnsupported('Browser does not'
                                         + 'support sessionStorage');
          }
        }
      });
    });

  } // storeViews
    
  /* ================================
      Handles link clicks
      Renders the page
     ================================ */

  // Renders page from sessionStorage based on route
  function renderPage(route) {
    var html = LZString.decompress(sessionStorage[route]);
    var doc = document.open();
    doc.write(html);
    doc.close();
  }

  // Render page based on link clicked
  $jq('a').click(function(e) {
    // Prevents link behavior
    e.preventDefault();

    var url = $jq(this).attr('href');
    renderPage(url);
  });

  // Mouse cursor worker
  (function() {

    // Distance of mouse and element
    function calculateDistance(elem, mouseX, mouseY) {
             
      function PYTHAGORAS_THEOREM(x, y) {
        var sqrt = Math.sqrt;
        var square = function(num) {
          return Math.pow(num, 2);
        }
        
        // NOTE:  Negative values make no difference (squared)
        return sqrt( square(x) + square(y) );
      }
      
      var distanceX = mouseX - ( elem.offset().left + (elem.width() / 2) );
      var distanceY = mouseY - ( elem.offset().top + (elem.height() / 2) );
      return Math.floor( PYTHAGORAS_THEOREM(distanceX, distanceY) );
    }

    $jq(document).mousemove(function(e) {  
      var mouseX = e.pageX;
      var mouseY = e.pageY;
      var links = $jq('a');
      var distance = calculateDistance(links, mouseX, mouseY);

      // Cursor distance with link
      if (distance <= 250) {
        // Renders page in background when approaching link
        light.storeViews();
      }
    });

 })();

} // Light object

