/*
 * Author: Maverick Chan
 */

// Use $jq for jQuery
var $jq = jQuery.noConflict(true);

// Light takes in an object, html as key, values as array of routes
// { html: ['/', '/home', '/login'] }
var light = function(views) {

    var routes, html;
    routes = views.html;
    html_dict = [];

    // Iterates through routes and make Ajax requests to them
    // Then, store their HTML into html_dict object with the route as key
    for(var route in routes) {
        $jq.ajax({
            url: route,
            success: function(html) {
                html_dict[route] = html;
            }
        });
    });

    // Checks if browser supports localStorage
    function support_storage() {
        try {
            return 'localStorage' in window &&
            window['localStorage'] !== null;
        }
        catch(e) {
            return false;
        }
    }

    // If supported, iterate through html_dict object
    // And store it in localStorage
    if (support_storage) {
        for (var route in html_dict) {
            var html = html_dict[route];
            localStorage[route] = html;
        }
    }
    else {
        console.log('ERROR: Browser does not support localStorage');
    }

}
