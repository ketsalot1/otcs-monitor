#!/bin/bash

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
app/view/itsmOverview.js \
service/Descriptor.data \
service/Ganesh.data \
service/Husain.data \
service/json.data \
service/nodejs/start.js \
service/tomcat/senchaTouchServlet.java \
service/tomcat/web.xml \
resources/css/app.css \
resources/images/otcs-1y.png \
resources/images/otcs-6m.png"

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