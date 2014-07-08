/*
 * Author: Maverick Chan
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
function light(settings) {

    /* ================================
        Setting up routes
        Storing HTML into localStorage
       ================================ */
    var routes = settings.html;

    this.storeViews = function() {

        // If base_url is given, just concat it before every route
        if ( settings.hasOwnProperty('baseUrl')  ) {
            for (var i = 0; i < routes.length; i++) {
                routes[i] = settings.baseUrl + '/' + routes[i];
            }
        }

        var total_size = 0;
        // Iterates through routes and make Ajax requests to them
        // Then, store their HTML into html_dict object with the route as key
        routes.forEach(function(route) {
            $jq.ajax({
                url: '/' + route,
                success: function(html) {
                    // If supported, iterate through html_dict object
                    // And store it in localStorage
                    if ( supportStorage() ) {
                        var route, comprHtml, file_size;

                        // Compress HTML and insert localStorage
                        comprHtml = LZString.compress(html);

                        // Sums up total storage size
                        file_size = comprHtml.length;
                        total_size += file_size;

                        // Assigns compressed html to route
                        localStorage[route] = comprHtml;

                        // Creates tokens to make sure Light only runs once
                        localStorage['light_token'] = 'ran';
                        log('ran');
                    }
                    else {
                        throw new FeatureUnsupported("Browser does not support localStorage");
                    }
                }
            });
        });

        // Makes localStorage size accessible
        this.storageSize = total_size;

    }

    // Checks if html is stored
    if ( ! localStorage.hasOwnProperty('light_token')
        && settings.hasOwnProperty('html') ) {
        this.storeViews();
    }

    /* ================================
        Handles link clicks
        Renders the page
       ================================ */

    // Renders page from localStorage based on route
    function renderPage(route) {
        var html, doc;
        html = LZString.decompress(localStorage[route]);
        doc = document.open();
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

}

