#!/bin/bash
DAY=$1
if [ -z "$DAY" ] && [ "${DAY+xxx}" = "xxx" ]; then 
	BACKUP=`date +"/home/martinme/Ubuntu One/My Backups/%Y%m%d-backup-itsm.sql"`
else
	BACKUP=`date +"/home/martinme/Ubuntu One/My Backups/%Y%m____-backup-itsm.sql"`
	BACKUP=`echo $BACKUP | sed -e "s/____/${DAY}/g"` 
fi

mysql -h localhost -u root --password=mysql < "$BACKUP"

/usr/local/bin/mongo <<EOF
use itsm;
db.dropDatabase();
exit;
EOF

if [ -z "$DAY" ] && [ "${DAY+xxx}" = "xxx" ]; then 
	BACKUP=`date +"/home/martinme/Ubuntu One/My Backups/%Y%m%d-backup-mongo/itsm"`
else
	BACKUP=`date +"/home/martinme/Ubuntu One/My Backups/%Y%m____-backup-mongo/itsm"`
	BACKUP=`echo $BACKUP | sed -e "s/____/${DAY}/g"` 
fi

/usr/local/bin/mongorestore --collection test --db itsm "$BACKUP"
