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



##########

app = webapp2.WSGIApplication([
      ('/', BasePage),
      Route('/transport/<transportation>', handler = Transportation)],
      config = config, debug = True)

if __name__ == '__main__':
    app.run()
    
