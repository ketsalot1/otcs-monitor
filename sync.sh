#!/bin/bash
#cp /home/martinme/Documents/Develop/google/itsm/app.js /var/www/itsm/app.js
#cp /home/martinme/Documents/Develop/google/itsm/app.json /var/www/itsm/app.json
#cp /home/martinme/Documents/Develop/google/itsm/index.html /var/www/itsm/index.html
#cp /home/martinme/Documents/Develop/google/itsm/packager.json /var/www/itsm/packager.json
#cp /home/martinme/Documents/Develop/google/itsm/project.1204.vim /var/www/itsm/project.1204.vim
#cp /home/martinme/Documents/Develop/google/itsm/project.lin.dell.vim /var/www/itsm/project.lin.dell.vim
#cp /home/martinme/Documents/Develop/google/itsm/readme.txt /var/www/itsm/readme.txt
#
#cp /home/martinme/Documents/Develop/google/itsm/app/controller/itsm.js /var/www/itsm/app/controller/itsm.js
#
#cp /home/martinme/Documents/Develop/google/itsm/app/model/desktopITSM.js /var/www/itsm/app/model/desktopITSM.js
#cp /home/martinme/Documents/Develop/google/itsm/app/model/itsm.js /var/www/itsm/app/model/itsm.js
#cp /home/martinme/Documents/Develop/google/itsm/app/model/settings.js /var/www/itsm/app/model/settings.js
#cp /home/martinme/Documents/Develop/google/itsm/app/model/searchresult.js /var/www/itsm/app/model/searchresult.js
#
#cp /home/martinme/Documents/Develop/google/itsm/app/store/desktopITSM.js /var/www/itsm/app/store/desktopITSM.js
#cp /home/martinme/Documents/Develop/google/itsm/app/store/itsm.js /var/www/itsm/app/store/itsm.js
#cp /home/martinme/Documents/Develop/google/itsm/app/store/settings.js /var/www/itsm/app/store/settings.js
#cp /home/martinme/Documents/Develop/google/itsm/app/store/searchresult.js /var/www/itsm/app/store/searchresult.js
#
#cp /home/martinme/Documents/Develop/google/itsm/app/view/ConfigurationView.js /var/www/itsm/app/view/ConfigurationView.js
#cp /home/martinme/Documents/Develop/google/itsm/app/view/itsmDetail.js /var/www/itsm/app/view/itsmDetail.js
#cp /home/martinme/Documents/Develop/google/itsm/app/view/itsmList.js /var/www/itsm/app/view/itsmList.js
#cp /home/martinme/Documents/Develop/google/itsm/app/view/Main.js /var/www/itsm/app/view/Main.js
#cp /home/martinme/Documents/Develop/google/itsm/app/view/MainListContainer.js /var/www/itsm/app/view/MainListContainer.js
#cp /home/martinme/Documents/Develop/google/itsm/app/view/searchForm.js /var/www/itsm/app/view/searchForm.js
#cp /home/martinme/Documents/Develop/google/itsm/app/view/searchResultView.js /var/www/itsm/app/view/searchResultView.js
#cp /home/martinme/Documents/Develop/google/itsm/app/view/searchResultDetail.js /var/www/itsm/app/view/searchResultDetail.js
#
#cp /home/martinme/Documents/Develop/google/itsm/service/Descriptor.data /var/www/itsm/service/Descriptor.data
#
#cp /home/martinme/Documents/Develop/google/itsm/service/Ganesh.data /var/www/itsm/service/Ganesh.data
#cp /home/martinme/Documents/Develop/google/itsm/service/Husain.data /var/www/itsm/service/Husain.data
#cp /home/martinme/Documents/Develop/google/itsm/service/json.data /var/www/itsm/service/json.data
#
#cp /home/martinme/Documents/Develop/google/itsm/service/nodejs/start.js /var/www/itsm/service/nodejs/start.js
#
#cp /home/martinme/Documents/Develop/google/itsm/service/tomcat/senchaTouchServlet.java /var/www/itsm/service/tomcat/senchaTouchServlet.java
#cp /home/martinme/Documents/Develop/google/itsm/service/tomcat/web.xml /var/www/itsm/service/tomcat/web.xml
#
#cp /home/martinme/Documents/Develop/google/itsm/resources/css/app.css /var/www/itsm/resources/css/app.css

##############################################################################################################

SRC="\
app.js \
app.json \
index.html \
packager.json \
project.1204.vim \
project.lin.dell.vim \
readme.txt \
app/controller/itsm.js \
app/model/desktopITSM.js \
app/model/itsm.js \
app/model/settings.js \
app/model/searchresult.js \
app/store/desktopITSM.js \
app/store/itsm.js \
app/store/settings.js \
app/store/searchresult.js \
app/view/ConfigurationView.js \
app/view/itsmDetail.js \
app/view/itsmList.js \
app/view/Main.js \
app/view/MainListContainer.js \
app/view/searchForm.js \
app/view/searchResultView.js \
app/view/searchResultDetail.js \
service/Descriptor.data \
service/Ganesh.data \
service/Husain.data \
service/json.data \
service/nodejs/start.js \
service/tomcat/senchaTouchServlet.java \
service/tomcat/web.xml \
resources/css/app.css"

echo "** Synchronize SVN Application OTCS Monitor **"

if [ -n "$1" ]
then
	echo -n "Detecting configuration ... "
else 
	echo "failed"
	echo "ERROR: no target destination set. Set target destination first and restart this tool"
	exit -1
fi

echo " OK"

#
# List all the files here ...
#
for file in $SRC
do
	echo -n "checking $file ... "
	if [ -f $file ]
	then
		echo " OK"
	else
		echo " failed"
		echo "Perform svn checkout command first"
		exit -1
	fi
done

for file in $SRC
do
	TARGET="$1/$file"
	echo -n "copying $file ... "
	echo $TARGET
	if [ ! -d `dirname $TARGET` ]
	then
   	mkdir -m 755 -p $(dirname $TARGET)
	fi
	`cp -f $file $1/$file`
	if [ -f "$1/$file" ]
	then
		echo -n " "
	else
		echo " Copying failed"
		echo "Check the destination path $1 and permission to write there"
		exit -1
	fi
done

echo " "
echo "Finished. SVN project files copied into $1 location"
echo "This project depends on Sencha Touch Run-time 2.0.1.1 and node.js 0.8"
echo "Make sure that the Sencha Touch application has been generated before"
echo "you synchronize your project files. Second, node.js must be installed"
