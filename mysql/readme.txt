 6552390227 / 0100
 SQL Prikazy
 ------------

Udrzba ciselniku patchu.
 insert into t02_patch (name_02,release_02,status_02) values ( "WEV-1000-005", "28.12.2012", "open");

Udrzba hlavniho ciselniku cases
 insert into t01_case (case_01,subject_01,status_01,description_01,start_01,project_01) values (1323434,"OTCS Ticket 1323434: Pages cannot be ordered","Progress To-Do","01.12.2012 - status update not available\n26.11.2012 - case received","24.11.2012","Pavana");

Vyber case i s informaci o patchi
  select t01.case_01,t01.status_01,t02.name_02 from t01_case t01, t02_patch t02, t03_link t03  where t01.id_01 = t03.id_01 and t02.id_02 = t03.id_02;

Vyber inforamce o Patch pro projekt
  select case_01 "case",subject_01 "description",status_01 "status", description_01 "details" from t01_case where project_01 = "Pavana" order by case_01 asc;

Konstrukce Descriptor.data:
 1. select long_text_04 "category", short_text_04 "code" from t04_project;
 2. Pres iterator se pak prida klic "title" s obsahem "OTCS Cases (curretn date)"

Udrzba SVN na Google  
-------------------

 https://otcs-monitor.googlecode.com/svn/trunk/
 https://otcs-monitor.googlecode.com/svn/branches/

svn import 1.0 https://otcs-monitor.googlecode.com/svn/branches/1.0 --username mr.martin.metal@gmail.com --password Ww7qz2VW2pp2

svn copy https://otcs-monitor.googlecode.com/svn/trunk/ https://otcs-monitor.googlecode.com/svn/branches/1.0 --username mr.martin.metal@gmail.com --password Ww7qz2VW2pp2

 --username mr.martin.metal@gmail.com --password Ww7qz2VW2pp2

Prenos Database:
----------------
sudo mysqldump --opt --add-drop-database -u root --password=mysql --databases test > backup/20121220-test.sql
mysql -h localhost -u root -p < backup/test.sql 


====== Command Foundry, test DB =======
 http://localhost/otcsdata?cmd=queryDB&data=
 &processSupportData=cb1

 http://localhost/otcsdata?cmd=queryDB&data=select%20case_01%20"case",subject_01%20"description",status_01%20"status"%20from%20t01_case%20order%20by%20case_01%20asc;&processSupportData=cb1

 http://localhost/otcsdata?cmd=queryDB&data=select%20case_01%20"case",subject_01%20"description",status_01%20"status",%20description_01%20"details"%20from%20t01_case%20where%20project_01%20=%20"Pavana"%20order%20by%20case_01%20asc;&processSupportData=cb1
