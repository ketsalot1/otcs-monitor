#!/bin/bash

SRC="\
app.js \
readme.txt \
app/controller/itsm.js \
app/model/desktopITSM.js \
app/model/itsm.js \
app/model/settings.js \
app/model/aboutInfo.js \
app/model/patches.js \
app/model/db.js \
app/model/count.js \
app/model/itsmOverview.js \
app/model/email.js \
app/store/desktopITSM.js \
app/store/activities.js \
app/store/dashboard.js \
app/store/itsm.js \
app/store/settings.js \
app/store/searchResult.js \
app/store/aboutInfo.js \
app/store/patches.js \
app/store/projects.js \
app/store/db.js \
app/store/count.js \
app/store/itsmOverview.js \
app/store/email.js \
app/view/ConfigurationView.js \
app/view/itsmDetail.js \
app/view/itsmRework.js \
app/view/itsmListContainer.js \
app/view/itsmList.js \
app/view/Main.js \
app/view/MainListContainer.js \
app/view/searchForm.js \
app/view/searchResultView.js \
app/view/searchResultDetail.js \
app/view/itsmOverview.js \
app/view/aboutScreen.js \
app/view/itsmEditForm.js \
app/view/itsmLinkForms.js \
app/view/itsmPatchAssignForm.js \
app/view/itsmProjectAssignForm.js \
app/view/itsmJiraAssignForm.js \
app/view/patchMainView.js \
app/view/patchMgmtUpdateForm.js \
app/view/patchMgmtInsertForm.js \
app/view/projectMgmtInsertForm.js \
app/view/emailView.js \
app/view/itsmCaseLinkForm.js \
app/view/itsmRefLinkForm.js \
app/view/setCheckpointForm.js \
app/view/setCaseStatusForm.js \
app/view/setPatchETAForm.js \
styles/config.rb \
styles/app.scss \
service/all.data \
service/Descriptor.data \
service/Ganesh.data \
service/Husain.data \
service/Michelle.data \
service/Stephan.data \
service/json.data \
service/nodejs/start.js \
service/nodejs/itsm.js \
service/nodejs/requestHandlers.js \
service/nodejs/router.js \
service/nodejs/service.js \
service/tomcat/senchaTouchServlet.java \
service/tomcat/web.xml \
resources/images/otcs-5y.png \
resources/images/otcs-1y.png \
resources/images/otcs-6m.png \
resources/images/iUnassigned-2.png \
resources/images/iUser1.png \
resources/images/iFavorites.png \
resources/images/iCases.png \
resources/images/iPatches.png \
resources/images/iPatch.png \
resources/images/iStar.png \
resources/images/iArchive.png \
resources/images/iArchive2.png \
resources/images/iArchive3.png \
resources/images/iEmail24.png \
resources/images/iEmailAtt24.png \
resources/images/iEmail31.png \
resources/images/iEmailAtt31.png \
resources/images/iFeed.png \
resources/images/iFeed2.png \
resources/images/iFeed3.png \
resources/images/iLink.png \
resources/images/iHotFix.png \
resources/images/iUpdated.png \
resources/images/iOutdated.png \
resources/images/iPending.png \
resources/images/iUpdated1.png \
resources/images/iOutdated1.png \
resources/images/iPending1.png \
resources/images/iQuestion.png \
resources/images/iExperimental.png \
resources/images/iCalendar.png \
resources/images/iCalendar2.png \
resources/images/iClock.png \
resources/images/iClock1.png \
resources/images/iProject1.png \
resources/images/iProject2.png \
resources/images/iRework.png \
resources/icons/Icon@2x.png \
resources/icons/Icon~ipad@2x.png \
resources/icons/Icon~ipad.png \
resources/icons/Icon.png \
resources/icons/icon-spot~ipad.png \
resources/icons/iTunesArtwork.png \
doc/css/default.css \
doc/res/opentext.png \
doc/api.html"

echo "** Synchronize SVN Application OTCS Monitor **"

if [ -n "$1" ]; then
	echo -n "Detecting configuration ... "
else 
	echo "failed"
	echo "ERROR: no target destination set. Set target destination first and restart this tool"
	exit -1
fi

echo " OK"

if [ -z "$2" ]; then
	echo "Warn, no device given, assuming iPad"
	cp -fvp ./app/view/MainListContainer.ipad.js ./app/view/MainListContainer.js
else
	if [ "$1" == "iPad" ]; then
		cp -fvp ./app/view/MainListContainer.ipad.js ./app/view/MainListContainer.js
	else 
		cp -fvp ./app/view/MainListContainer.iphone.js ./app/view/MainListContainer.js
	fi
fi

#
# List all the files here ...
#
for file in $SRC
do
	echo -n "checking $file ... "
	if [ -f $file ]; then
		echo " OK"
	else
		echo " failed"
		echo "Perform svn checkout command first"
		exit -1
	fi
done

for file in $SRC; do
	TARGET="$1/$file"
	echo -n "copying $file ... "
	echo $TARGET
	if [ ! -d `dirname $TARGET` ]; then
   	mkdir -m 755 -p $(dirname $TARGET)
	fi
	`cp -f $file $1/$file`
	if [ -f "$1/$file" ]; then
		echo -n " "
	else
		echo " Copying failed"
		echo "Check the destination path $1 and permission to write there"
		exit -1
	fi
done

if [ -n "$2" ] && [ "$2" = "css" ]; then
   FILE="resources/css/app.css"
   TARGET="$1/$FILE"
	echo " "
	echo "Copy pre-compiled CSS ... "
   echo -n " copying $FILE ... "
   echo $TARGET
   if [ ! -d `dirname $TARGET` ]; then
      mkdir -m 755 -p $(dirname $TARGET)
   fi
   `cp -f $FILE $1/$FILE`
	if [ -f "$1/$FILE" ]; then
		echo -n " "
	else
		echo " Copying failed"
		echo "Check the destination path $1 and permission to write there"
		exit -1
	fi
fi

echo " OK"
echo " "
echo "Finished. SVN project files copied into $1 location"
echo "This project depends on Sencha Touch Run-time 2.0.1.1 and node.js 0.8"
echo " "
echo "start your node server:"
echo "  node --debug ./service/nodejs/start.js"
echo " "
echo "start your remote debugger:"
echo "  node-inspector --web-port=8686 &"
echo " "
echo "to start debugging on 0.0.0.0:8686"
echo " "
echo "Make sure that you use the right version of the compass:"
echo "  /var/lib/gems/1.8/bin/compass compile"
echo " "
echo "In chrome browser you can connect to inspector and debug your application server logic."
echo "Make sure that the Sencha Touch application has been generated before"
echo "you synchronize your project files. Second, node.js must be installed"
echo " "
echo "ATTENTION"
echo "The project can be used against the Sencha 2.2 library. The difference is the style sheet"
echo "compilation. You have to use app.sass from the 'styles/2.2' folder and follow instructions"
echo "given in the app.sass itself about how to deploy".
