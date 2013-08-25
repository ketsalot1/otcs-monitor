#!/bin/bash
DAY=$1
if [ -z "$DAY" ]; then 
	echo "No argument, fall back"
	DAY=-1
fi
#if [ -z "$DAY" ] && [ "${DAY+xxx}" = "xxx" ]; then 
if [[ `echo $DAY | sed 's/^[-+0-9][0-9]*//' | wc -c` -ne 1 ]]; then
	echo "Input invalid, taking fallback"
	DAY=-1
fi

BASE=`date +"%d"`
if [ $[$BASE+$DAY] -le 0 ]; then
	echo "No month has negative day"
   exit 0;
fi
DAY=$[$BASE+$DAY]
BACKUPSQL=`date +"/tmp/itsmdb/%Y%m____-backup-itsm.sql"`
if [ ${DAY} -lt 10 ]; then
	BACKUPSQL=`echo $BACKUPSQL | sed -e "s/____/0${DAY}/g"` 
else
	BACKUPSQL=`echo $BACKUPSQL | sed -e "s/____/${DAY}/g"` 
fi
BACKUPMNG=`date +"/tmp/itsmdb/%Y%m____-backup-mongo/itsm"`
if [ ${DAY} -lt 10 ]; then
	BACKUPMNG=`echo $BACKUPMNG | sed -e "s/____/0${DAY}/g"` 
else
	BACKUPMNG=`echo $BACKUPMNG | sed -e "s/____/${DAY}/g"` 
fi

if [ -f "$BACKUPSQL" ]; then
	echo Found restore source for MySQL: $BACKUPSQL
else
	echo "The restore path for MySQL does not exist"
	exit 0;
fi

if [ -f "$BACKUPMNG/test.bson" ]; then
	echo Found restore source for MongoDB: $BACKUPMNG
else
	echo "The restore patch for MongoDB does not exist"
	exit 0;
fi

mysql -h localhost -u root --password=mysql < "$BACKUPSQL"

/usr/local/bin/mongo <<EOF
use itsm;
db.dropDatabase();
exit;
EOF

/usr/local/bin/mongorestore --collection test --db itsm "${BACKUPMNG}"
