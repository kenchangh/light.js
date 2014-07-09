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

// Checks if browser supports localStorage
function supportStorage() {
  try {
    return 'localStorage' in window &&
    window['localStorage'] !== null;
  }
  catch(e) {
    return false;
  }
}

// Light takes in an object, html as key, values as array of routes
// { html: ['/', '/home', '/login'] }
function Light(settings) {

  var light = this;

  /* ================================
      Setting up routes
      Storing HTML into localStorage
     ================================ */

  light.storeViews = function() {

    // Run function only once per page
    light.storeViews = Function('');

    if (typeof settings == 'undefined') {
      log('passed')
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
      $jq('a').each(function() {
        url = $jq(this).attr('href');
        routes.push(url);
      });
    }

    var total_size = 0;
    // Iterates through routes and make Ajax requests to them
    routes.forEach(function(route) {
      $jq.ajax({
        url: route,
        success: function(html) {
          // If supported, iterate through html_dict object
          // And store it in localStorage
          if ( supportStorage() ) {
            // Compress HTML and insert localStorage
            var comprHtml = LZString.compress(html);

            // Sums up total storage size
            var file_size = comprHtml.length;
            total_size += file_size;
            // Makes localStorage size accessible
            Light.prototype.storageSize = total_size;

            // Assigns compressed html to route
            localStorage[route] = comprHtml;

            // Creates tokens to make sure Light only runs once
            localStorage['light_token'] = 'ran';
            log('html stored!');
          }
          else {
            throw new FeatureUnsupported('Browser does not'
                                         + 'support localStorage');
          }
        }
      });
    });

  } // storeViews
    
  /* ================================
      Handles link clicks
      Renders the page
     ================================ */

  // Renders page from localStorage based on route
  function renderPage(route) {
    var html = LZString.decompress(localStorage[route]);
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
      return Math.floor(Math.sqrt(Math.pow(mouseX
             - (elem.offset().left+(elem.width()/2)), 2)
             + Math.pow(mouseY-(elem.offset().top
             + (elem.height()/2)), 2)));
    }

    $jq(document).mousemove(function(e) {  
      var mX = e.pageX;
      var mY = e.pageY;
      var link = $jq('a');
      var distance = calculateDistance(link, mX, mY);

      // Cursor distance with link
      if (distance <= 250) {
        // Renders page in background when approaching link
        light.storeViews();
      }
    });

 })();

} // Light object

