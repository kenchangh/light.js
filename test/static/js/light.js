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

  if (typeof settings === 'undefined') {
    settings = {};
  }

  /* =================================
      Setting up routes
      Storing HTML into sessionStorage
     ================================= */

  light.storeViews = function() {

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
      var links = document.getElementsByTagName('a');
      // A vanilla method is much, much faster
      for (var i = 0; i < links.length; i++) {
        routes.push(links[i].pathname); 
      }
    }

    var total_size = 0;
    light.routes = routes;
    // Iterates through routes and make Ajax requests to them
    routes.forEach(function(route) {
      $jq.ajax({
        url: route,
        success: function(html) {
          // If supported, iterate through html_dict object
          // And store it in sessionStorage
          if ( supportStorage() ) {
            // Compress HTML and insert sessionStorage
            var comprHTML = LZString.compress(html);

            // Sums up total storage size
            var file_size = comprHTML.length;
            total_size += file_size;
            // Makes sessionStorage size accessible
            Light.prototype.storageSize = total_size;

            // Assigns compressed html to route
            sessionStorage[route] = comprHTML;

            log('html stored!');
          }
          else {
            throw new FeatureUnsupported('Browser does not '
                                         + 'support sessionStorage');
          }
        }
      });
    });
    var node = document.doctype;
    var doctypeStr = '<!DOCTYPE '
                      + node.name
                      + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '')
                      + (!node.publicId && node.systemId ? ' SYSTEM' : '') 
                      + (node.systemId ? ' "' + node.systemId + '"' : '')
                      + '>';
    var currentHTML = doctypeStr + document.documentElement.outerHTML;
    var comprHTML = LZString.compress(currentHTML);
    sessionStorage[window.location.pathname] = comprHTML;

  } // storeViews
    
  /* ================================
      Handles link clicks
      Renders the page
     ================================ */

  // Renders page from sessionStorage based on route
  function renderView(route) {
    var html = LZString.decompress(sessionStorage[route]);
    var doc = document.open();
    doc.write(html);
    doc.close();
  }

  // Render page based on link clicked
  $jq('a').click(function(e) {

    var link = this.pathname;
    function changeView(link) {
      e.preventDefault();

      console.time('renderView');
      var url = link;
      renderView(url);
      history.pushState(null, null, url);
      console.timeEnd('renderView');
    }

    if (typeof settings.html === 'undefined') {
      changeView(link);
    }
    else {
      var routes = light.routes;
      for (var i = 0; i < routes.length; i++) {
        if (link == routes[i]) {
          changeView(link);
          break;
        }
      }
    }
  });

  /* ================================
      Handles state change
     ================================ */

  // On back button
  window.onpopstate = function(event) {
    var currentLocation = window.location.pathname;
    log(currentLocation)
    renderView(currentLocation);
  };

  /* ================================
      Settings
     ================================ */

  // Becomes default choice
  if ( (typeof settings.on === 'undefined')
       || settings.on == 'intervals' ) {
    light.storeViews();

    window.setInterval(function() {
      // Default value for interval
      if (typeof settings.interval === 'undefined') {
        settings.interval = 50000;
      }

      light.storeViews();

    }, setttings.interval);
  }

} // Light object

// TODO Setup test cases
// With mouseApproach
// With html set
// With base_url

