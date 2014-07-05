/*
 * Author: Maverick Chan
 */

// Use $jq for jQuery
var $jq = jQuery.noConflict(true);

// Light takes in an object, html as key, values as array of routes
// { html: ['/', '/home', '/login'] }
var light = function(views) {

    var routes, html_dict;
    routes = views.html;
    html_dict = {};

    // Iterates through routes and make Ajax requests to them
    // Then, store their HTML into html_dict object with the route as key
    routes.forEach(function(route) {
        $jq.ajax({
            url: route,
            success: function(html) {
                html_dict[route] = html;
            }
        }).done(function(){
            // If supported, iterate through html_dict object
            // And store it in localStorage
            if ( support_storage() ) {
                var route, html;
                for (route in html_dict) {
                    html = html_dict[route];
                    localStorage[route] = html;
                }
            }
            else {
                console.log('ERROR: Browser does not support localStorage');
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

}

