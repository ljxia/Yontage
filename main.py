#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util        
from google.appengine.ext.webapp import RequestHandler,template 
from google.appengine.api import channel
import uuid
import simplejson


class MainHandler(webapp.RequestHandler):
    def get(self):      
      token = str(uuid.uuid4())[:8]      
      self.redirect("/w/" + token)
             
class WatchHandler(webapp.RequestHandler):
    def get(self, token): 
        
        if not token:
            self.redirect("/")
            return
            
        channel_token = channel.create_channel(token)

        self.response.headers['Content-Type'] = 'text/html'
        self.response.out.write(template.render('templates/index.html',
                                  {
                                    'channel_token': channel_token,
                                    'token': token
                                  }))  

class QueryHandler(webapp.RequestHandler):
    def get(self,channel_token,query):
      
      
      if channel_token and query:        
        message = simplejson.dumps({
          'query':query
        })
        
        
        channel.send_message(channel_token,message)
      
      self.response.out.write("%s - %s" % (channel_token, message))
      pass

def main():
    application = webapp.WSGIApplication([
                                          ('/', MainHandler),     
                                          ('/w/([^/]+)?',WatchHandler),
                                          ('/q/([^/]+)?/([^/]+)?', QueryHandler)
                                         ],
                                         debug=True)
    util.run_wsgi_app(application)


if __name__ == '__main__':
    main()
