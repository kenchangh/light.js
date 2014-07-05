##########

import logging
import webapp2
from webapp2 import Route

from base_handler import BaseHandler

##########

config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': 'my-super-secret-key',
}

##########

class BasePage(BaseHandler):
    
    def get(self):
        self.render('index.html')
        
    def post(self):
        pass
        
        
class HTMLPage(BaseHandler):
    
    def get(self, **kw):
        html = kw['html']
        self.render(html + '.html')
        
    def post(self):
        pass

##########

app = webapp2.WSGIApplication([
      ('/', BasePage),
      Route('/views/<html>', handler = HTMLPage)],
      config = config, debug = True)

if __name__ == '__main__':
    app.run()
    