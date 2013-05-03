#!/bin/bash

COUNT=`ps -ef | grep "[0-9] /usr/local/bin/node --debug ./itsm.js" | wc -l`

if [ $COUNT -eq 0 ] ; then
   echo -n "Found : "
   echo -n $COUNT
   echo " instances of ITSM server. Server died unexpectedly, restarting"
   cd /home/martinme/Develop/google/itsm/service/nodejs
   nohup /usr/local/bin/node --debug ./itsm.js --config ./config.json &
else
   if [ $COUNT -eq 1 ] ; then
      echo "ITSM server healthy"
   else  
      echo -n "Found : "
      echo -n $COUNT
      echo " instances of ITSM server. Something is wrong"
      echo "Undefined situation encountered, more instances running? terminating all node.js servers ... "
      CMD=`ps -ef | grep "node --debug itsm.js" | awk ' { system("echo -n \"kill -9 \""); print $2 }'`
      $CMD
   fi
fi
