JSON Service:
-------------

1. JSONP technology in Sencha Touch 2 is using code injecting method to overcome
   the problem with cross-domain origin. The request for JSON data structure is
   actually injected as a new tag <script>, which contain a user defined
   callback. To deliver the data to JSONP two techniques were tested:

   a. Tomcat6 - a servlet is reading external data and pushing them into
      response object. The parameter 'otcs' in url reads the data file name that
      the servlet delivers back to browser/application in browser. Tomcat can
      provide this service on its own or can be 'hidden' behind a reverse proxy
      for standard internet access. 

   b. Nodejs - a JavaScript callback function doing exactly the same as the
      servlet. Just looks up external resource and feeds it back to HTTP
      response object. The same strategy as used with servlet approach -
      parameter in url - is used to determine the data that contains the JSON
      object. nodejs is a server and again for internet access is
      recommended to hide it behind a reverse proxy.

2. Configure Reverse proxy:

   Take standard Apache 2. 

   - in mode configuration page (/etc/apache2/mods-enabled) create two symbolic
     links. One is 'proxy.load' and the other 'proxy_http.load'. The sources are
     in mods-available folder.

   - modify the Apache configuration to use the proxy for specific URLs. Inside
     the configuration use the option: 

      ProxyPass /nd http://127.0.0.1:38080/

     Assuming the node server is started on the same host. Calling the local
     apache with /nd resource will reroute to nodejs server hosting the service
     for delivering the JSON objects. 

Appendix A.

   get nodejs. Use URL http://nodejs.org and follow instructions for install.
   The UNIX variante is build for the system from sources and installed. No
   problem found with it.
      
