USE `test`;

DROP TABLE IF EXISTS `t06_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t06_status` (
  `id_06` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `status_06` varchar(64) COLLATE latin2_czech_cs NOT NULL,
  PRIMARY KEY (`id_06`)
) ENGINE=InnoDB AUTO_INCREMENT=201 DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;

LOCK TABLES `t06_status` WRITE;

INSERT INTO `t06_status` VALUES (1,'Bug-Open Ticket'), (2,'Bugs-DB'), (3,'Closed'), (4,'Closed-PostProc'), (5,'Close-Wait'), (6,'Feedback (Waiting)'), (7,'Fixed Next Patch'), (8,'Fixed Next Release'), (9,'On Hold'), (10,'Pending-Internal'), (11,'Progress-To Do');

UNLOCK TABLES;


DROP TABLE IF EXISTS `t07_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t07_history` (
  `id_01` int(10) unsigned DEFAULT NULL,
  `id_06` int(10) unsigned DEFAULT NULL,
  `since_06` date NOT NULL,
  `till_06` date DEFAULT NULL,
  KEY `fk_t07_history_1_idx` (`id_01`),
  KEY `fk_t07_history_2_idx` (`id_06`),
  CONSTRAINT `fk_t07_history_1` FOREIGN KEY (`id_01`) REFERENCES `t01_case` (`id_01`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t07_history_2` FOREIGN KEY (`id_06`) REFERENCES `t06_status` (`id_06`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_czech_cs;
