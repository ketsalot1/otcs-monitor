#!/bin/bash

start_engine() {
   cd $FLD
   nohup /usr/local/bin/node --debug ./itsm.js --config ./config.json &
   sleep 5
	COUNT=`ps -ef | grep "[0-9] /usr/local/bin/node --debug ./itsm.js" | wc -l`
   if [ $COUNT -eq 1 ]; then
      return 0
   else
      return 1
   fi
}

stop_engine() {
   KILLCMD=`ps -ef | grep "[0-9] /usr/local/bin/node --debug ./itsm.js" | awk ' {system("echo -n \"kill \""); print $2 }'`
   $KILLCMD
   sleep 3
   CNTR=0
	COUNT=`ps -ef | grep "[0-9] /usr/local/bin/node --debug ./itsm.js" | wc -l`
   while [ $COUNT -gt 0 ] && [ $CNTR -lt 20 ] ; do
	   COUNT=`ps -ef | grep "[0-9] /usr/local/bin/node --debug ./itsm.js" | wc -l`
      CNTR=`expr $CNTR + 1`
      sleep 1
   done
   if [ $COUNT -eq 0 ]; then
      return 0
   else
      return 1
   fi
}


FLD=$1
COUNT=`ps -ef | grep "[0-9] /usr/local/bin/node --debug ./itsm.js" | wc -l`

if [ -z "$FLD" ] && [ "${FLD+xxx}" = "xxx" ]; then 
   echo "Cannot determine the working folder. Bailing out."
else
	if [ $COUNT -eq 0 ] ; then
	   echo -n "Found : "
	   echo -n $COUNT
	   echo -n " instances of ITSM server. Server not running, starting ... "
      if start_engine; then
         echo " OK."
      else
         echo " fail."
      fi
	else
	   if [ $COUNT -eq 1 ] ; then
	      echo -n "ITSM server running, restarting ... "
	      if stop_engine; then
            if start_engine; then
               echo " OK."
            else
               echo " failed to start."
            fi
         else
            echo " failed to stop."
         fi
	   else  
	      echo -n "Found : "
	      echo -n $COUNT
	      echo " instances of ITSM server. Something is wrong"
	      echo "Undefined situation encountered, more instances running? terminating all node.js servers, check on it manually."
	   fi
	fi
fi
