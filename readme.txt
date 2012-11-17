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

		- Debugging in Node.js

		  Debugging in in-build debugger is trully frustrating experience. It
		  changes however very quickly, if node-inspector:

		  		https://github.com/dannycoates/node-inspector

		  gets installed. The GIT home page contain full description how to deply
		  node-inspector and how to connect to it from Chrome. All worked just
		  great. The key moments are:

		  - install node-inspector: npm install -g node-inspector

		  	 the installation takes some time and seems to freeze for longer time
			 just before end of installation process. It looks like some process
			 enters listening mode:

> ws@0.4.22 install /usr/local/lib/node_modules/node-inspector/node_modules/socket.io/node_modules/socket.io-client/node_modules/ws
> node install.js

[ws v0.4.22] Attempting to compile blazing fast native extensions.
[ws v0.4.22] Native extension compilation successful!
/usr/local/bin/node-inspector -> /usr/local/lib/node_modules/node-inspector/bin/inspector.js
node-inspector@0.2.0beta3 /usr/local/lib/node_modules/node-inspector
├── async@0.1.22
├── connect@1.8.7 (mime@1.2.7, formidable@1.0.11, qs@0.5.2)
└── socket.io@0.9.11 (policyfile@0.0.4, redis@0.7.3, socket.io-client@0.9.11)

			 It is actually just copiling someting and after a while it resumes
			 the control returns to the prompt. The installation is done.			  

		  - start the node-inspector and follow the instruction displayed on the
		    screen. There is a little change comapred to what the home page says,
			 the local address to connect to is 0.0.0.0.

		  Debugging experience is great, ecactly the saem as using the script in
		  your HTML projects.


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
      
