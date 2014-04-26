#!/bin/bash
STAMP=$1
if [ -z "$STAMP" ]; then 
	echo "No argument, bailing out. You have to specify the backup stamp in the format YYYYMMDD. "
	exit 0;
fi

#if [ -z "$DAY" ] && [ "${DAY+xxx}" = "xxx" ]; then 
if [[ `echo $STAMP | sed 's/^[-+0-9][0-9]*//' | wc -c` -ne 1 ]]; then
	echo -n 
	echo -n $STAMP
	echo " is invalid. You have to use the format YYYYMMDD only. Bailing out"
	exit 0;
fi

BACKUPSQL="/tmp/itsmdb/____-backup-itsm.sql"
BACKUPSQL=`echo $BACKUPSQL | sed -e "s/____/${STAMP}/g"` 
BACKUPMNG="/tmp/itsmdb/____-backup-mongo/itsm"
BACKUPMNG=`echo $BACKUPMNG | sed -e "s/____/${STAMP}/g"` 

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
