##########

import os
from os.path import dirname
import webapp2
import jinja2
from webapp2_extras import sessions

##########

template_dir = os.path.join(dirname(__file__), 'templates')
jinja_env = jinja2.Environment(autoescape = False, 
            loader = jinja2.FileSystemLoader(template_dir))


### My default, trusty BaseHandler, do not temper with it!!
class BaseHandler(webapp2.RequestHandler):
    def write(self, *a, **kw):
        self.response.out.write(*a, **kw)

    def render_str(self, template, **params):
        t = jinja_env.get_template(template)
        return t.render(params)
	
    def render(self, template, **kw):
        self.write(self.render_str(template,**kw))
        
    def pjax(self, template, **kw):
        # Checks if request is Ajax-Push State request
        if "X-PJAX" in self.request.headers:
            # Render the requested template in div FAST
            self.render(template, **kw)

        # User refreshes page or something else
        else:
            # TODO render base.html with included templates
            # This will reload the page
            self.render("base.html", **kw)
    
    def dispatch(self):
        # Get a session store for this request.
        self.session_store = sessions.get_store(request = self.request)
        try:
            # Dispatch the request.
            webapp2.RequestHandler.dispatch(self)
        finally:
            # Save all sessions.
            self.session_store.save_sessions(self.response)
    
    @webapp2.cached_property
    def session(self):
        # Returns a session using the default cookie key.
        return self.session_store.get_session()

