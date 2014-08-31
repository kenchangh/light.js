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

// Light takes in a list of routes
// Light(['/hot', '/new', '/top'])
function Light(routes) {

  var light = this;

  if (routes !instanceof Array) {
    throw new TypeError('Routes have to be an array, not'
                        + typeof(routes) + '!')
  }

  /* =================================
      Setting up routes
      Storing HTML into sessionStorage
     ================================= */

  light.storeViews = function() {

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
            localStorage[route] = comprHTML;

            log('html stored!');
          }
          else {
            throw new FeatureUnsupported('Browser does not '
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

    var routes = light.routes;
    for (var i = 0; i < routes.length; i++) {
      if (link == routes[i]) {
        changeView(link);
        break;
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

} // Light object
