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

// Light takes in an object, html as key, values as array of routes
// { html: ['/', '/home', '/login'] }
var light = function(views) {

    /* ================================
        Setting up routes
        Storing HTML into localStorage
       ================================ */
    var routes, html_dict;
    routes = views.html;
    html_dict = {};

    function store_html() {
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

        // If base_url is given, just concat it before every route
        if ( views.hasOwnProperty('base_url')  ) {
            for (var i = 0; i < routes.length; i++) {
                routes[i] = views.base_url + '/' + routes[i];
            }
        }
        
        // Iterates through routes and make Ajax requests to them
        // Then, store their HTML into html_dict object with the route as key
        routes.forEach(function(route) {
            $jq.ajax({
                url: '/' + route,
                async: false,
                success: function(html) {
                    html_dict['/' + route] = html;
                }
            });
        });

        // If supported, iterate through html_dict object
        // And store it in localStorage
        if ( support_storage() ) {
            var route, html, compr_html,
                total_size, file_size;

            total_size = 0;
            for (route in html_dict) {
                html = html_dict[route];

                // Compress HTML and insert localStorage
                compr_html = LZString.compress(html);

                // Sums up total storage size
                size = compr_html.length;
                total_size += size;

                // Assigns compressed html to route
                localStorage[route] = compr_html;

                // Creates tokens to make sure Light only runs once
                var token = 'ran';
                localStorage['light_token'] = token;
            }
        }
        else {
            throw new FeatureUnsupported("Browser does not support localStorage");
        }
    }

    // Checks if html is stored
    if ( ! localStorage.hasOwnProperty('light_token')  ) {
        store_html();
    }

    /* ================================
        Handles link clicks
        Renders the page
       ================================ */

    // Renders page from localStorage based on route
    function render_page(route) {
        var html, new_doc;
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
        render_page(url);
    });

}

