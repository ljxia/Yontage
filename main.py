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
import urllib2

import OpenTokSDK
                 
OPENTOK_API_KEY = '4383481'    
OPENTOK_API_SECRET = '2359bc5bdd56f90b4b6b24cd3442ffccddaad6c4'

class MainHandler(webapp.RequestHandler):
    def get(self):      
      token = str(uuid.uuid4())[:8]      
      self.redirect("/w/" + token)
             
class WatchHandler(webapp.RequestHandler):
    def get(self, token): 
        
        if not token:
            self.redirect("/")
            return      
            
            
        opentok_sdk = OpenTokSDK.OpenTokSDK(OPENTOK_API_KEY, OPENTOK_API_SECRET)  
        session_address = "localhost:8084" 
        opentok_session = opentok_sdk.create_session(session_address)  
        opentok_token = opentok_sdk.generate_token(opentok_session.session_id)
            
        channel_token = channel.create_channel(token)

        self.response.headers['Content-Type'] = 'text/html'
        self.response.out.write(template.render('templates/index.html',
                                  {
                                    'channel_token': channel_token,
                                    'token': token,
                                    'opentok_session_id' :opentok_session.session_id,
                                    'opentok_token' : opentok_token
                                  }))  

class QueryHandler(webapp.RequestHandler):
    def get(self,channel_token,query):
      
      
      if channel_token and query:        
        message = simplejson.dumps({
          'query':urllib2.unquote(query)
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
