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

		  Start node-inspector like this:

		  node-inspector --web-port=8686


2. Configure Reverse proxy:

   Take standard Apache 2. 

   - in mode configuration page (/etc/apache2/mods-enabled) create two symbolic
     links. One is 'proxy.load' and the other 'proxy_http.load'. The sources are
     in mods-available folder.

   - modify the Apache configuration to use the proxy for specific URLs. Inside
     the configuration for your virtual host (/etc/apache2/sites-enabled/000-default)
     find the sectiopn for <VirtualRoot *80> and add the configuration option: 

      ProxyPass /nd http://127.0.0.1:38080/

     Assuming the node server and Apache2 are on the same host. Calling the local
     apache with /nd resource will reroute to nodejs server hosting the service
     for delivering the JSON objects. 

3. Tools required for styling:

   Sencha Touch 2 works SASS and Compass tools to manipulate CSS. The trick is
   installation under Ubuntu. do nor use the 'compass' that is installed via the
   standard repository (apt-get). That is an old version and does not work with
   Senca Touch 2, SASS HAML 3.0respectively. The correct version must be
   installed via 'gem' tool from ruby. This link discusses the problem in
   details:

 http://www.sencha.com/forum/showthread.php?119356-Running-Compass-on-Linux-gives-quot-no-such-file-to-load-quot
 http://groups.google.com/group/compass-users/browse_thread/thread/6816d0f328031d64

   First, install ruby libraries and gem:

      $ sudo apt-get install ruby1.8 rubygems1.8

      $ sudo gem install haml 
      $ gem sources --add http://gems.github.com/ 
      $ sudo gem uninstall chriseppstein-compass 
      $ sudo gem install compass 

   The right version of compass must say:

      root@mameasus:/var/lib/gems/1.8/bin# ./compass -v
      Compass 0.12.2 (Alnilam)
      Copyright (c) 2008-2012 Chris Eppstein
      Released under the MIT License.

   You should avoid using:

      $ sudo apt-get install libcompass-ruby1.8
      $ sudo apt-get install compass-susy-plugin

   That will install the 0.8.17 version of compass, which is incompatible with
   SASS 3.0 (HAML).

 3.1 Sencha 2.2 specific

 	Sencha 2.2 completely reworks the styling. The pictos are not used as base64 encoded images
	inlined inside the CSS any more, a dedicated TTF is used instead. The font is delivered
	together with Sencha 2.2 however does not contain all the pictos that were available in the 
	sencha 2.0 and 2.1. Certain reduction must happen.

	Second, the technique of using the TTF instead of PNG inlined images differs remarkably compared
	to the original technique. See comments inside the app.sass file under the "style/2.2" folder
	for further details.

	The mentioned sass file must be manually compiled into /webroot/my_generated_app/resources/sass
	folder and compiled as described inside the sass file itself.

4. Protocol specification:
   http://host:port/otds?cmd=<command>&data={"key1":"value1","key2":"value2",...}

	The API documentation is under /itsm/doc/api.html

Appendix A.

   get nodejs. Use URL http://nodejs.org and follow instructions for install.
   The UNIX variant is build for the system from sources and installed. No
   problem found with it.
      
Appending B - additional modules installed to Node.js

	Install the modules to the folder, where the node scripts are stored. Module
	installation will add sub-folders in the root directory.

	npm install mysql@2.0.0-alpha2
 	npm install mysql@2.0.0-alpha3 (alternatively)
	npm install log4js

5. Auto recovery from crash and database backup:

   Following entries are required in crontab:

   0 3 * * * /usr/local/sbin/backup_itsm_db.sh
   */15 * * * * /home/martinme/Develop/google/itsm/recover.me.sh

   where the recover.me.sh is under source control as part of project and the database
   backup script is:


		#!/bin/bash
		BACKUP=`date +"/home/martinme/Ubuntu One/My Backups/%Y%m%d-backup-itsm.sql"`
		mysqldump --opt --add-drop-database -u root --password=mysql --databases test > "$BACKUP"
		
		BACKUP=`date +"/home/martinme/Ubuntu One/My Backups/%Y%m%d-backup-mongo"`
		/usr/local/bin/mongodump --collection test --db itsm --out "$BACKUP"

6. Installation and deployment:

	Server side:
	
		Install node.js server. Standard distribution requires to compile the copy
		of the server. The readme file says what tools are required, just for
		complition:

			- make 3.81 (is part of standard distribution)
			- Python 2.7 (is part of standard distribution)
			- gcc (is part of standard distribution)
			- g++ (apt-get install g++)

		Follow the readme file:

			./configure
			make
			make install

		And the node.js and npm are installed in the /usr/ folder.

		- copy the application logic file in the installation directory.
		  The application log is usually stored in multiple files, one of them is
		  the main file.
	
		- Navigate to the folder with application logic and type command:

			sudo npm install

		  This will take the package.jspn file and install all required
		  dependencies in the folder node_modules. After that you can alrewady
		  start your application 

			node my_app.js




