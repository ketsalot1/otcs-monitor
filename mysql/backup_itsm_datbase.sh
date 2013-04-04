#!/bin/bash
BACKUP=`date +"/home/martinme/Ubuntu One/My Backups/%Y%m%d-backup-itsm.sql"`
mysqldump --opt --add-drop-database -u root --password=mysql --databases test > "$BACKUP"

BACKUP=`date +"/home/martinme/Ubuntu One/My Backups/%Y%m%d-backup-mongo"`
/usr/local/bin/mongodump --collection test --db itsm --out "$BACKUP"
