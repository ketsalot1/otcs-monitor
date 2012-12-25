SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

DROP SCHEMA IF EXISTS `test` ;
CREATE SCHEMA IF NOT EXISTS `test` DEFAULT CHARACTER SET latin2 COLLATE latin2_czech_cs ;
USE `test` ;

-- -----------------------------------------------------
-- Table `test`.`t01_case`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `test`.`t01_case` ;

CREATE  TABLE IF NOT EXISTS `test`.`t01_case` (
  `id_01` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `case_01` DECIMAL(10,0) NOT NULL ,
  `subject_01` VARCHAR(256) NOT NULL ,
  `customer_01` VARCHAR(45) NULL DEFAULT NULL ,
  `status_01` VARCHAR(45) NOT NULL ,
  `description_01` TEXT NULL DEFAULT NULL ,
  `score_01` VARCHAR(32) NULL DEFAULT NULL ,
  `start_01` DATE NOT NULL ,
  `stop_01` DATE NULL DEFAULT NULL ,
  `project_01` INT UNSIGNED NOT NULL ,
  PRIMARY KEY (`id_01`) ,
  INDEX `UNIQUE` (`project_01` ASC) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin2
COLLATE = latin2_czech_cs;


-- -----------------------------------------------------
-- Table `test`.`t02_patch`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `test`.`t02_patch` ;

CREATE  TABLE IF NOT EXISTS `test`.`t02_patch` (
  `id_02` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `name_02` VARCHAR(45) NOT NULL ,
  `release_02` DATE NOT NULL ,
  `status_02` VARCHAR(64) NULL DEFAULT NULL ,
  PRIMARY KEY (`id_02`) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin2
COLLATE = latin2_czech_cs;


-- -----------------------------------------------------
-- Table `test`.`t03_link`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `test`.`t03_link` ;

CREATE  TABLE IF NOT EXISTS `test`.`t03_link` (
  `id_01` INT UNSIGNED NULL DEFAULT NULL ,
  `id_02` INT UNSIGNED NULL DEFAULT NULL ,
  INDEX `fk_t03_link_1_idx` (`id_01` ASC) ,
  INDEX `fk_t03_link_2_idx` (`id_02` ASC) ,
  CONSTRAINT `fk_t03_link_1`
    FOREIGN KEY (`id_01` )
    REFERENCES `test`.`t01_case` (`id_01` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_t03_link_2`
    FOREIGN KEY (`id_02` )
    REFERENCES `test`.`t02_patch` (`id_02` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin2
COLLATE = latin2_czech_cs;


-- -----------------------------------------------------
-- Table `test`.`t04_project`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `test`.`t04_project` ;

CREATE  TABLE IF NOT EXISTS `test`.`t04_project` (
  `project_01` INT UNSIGNED NULL DEFAULT NULL ,
  `short_text_04` VARCHAR(32) NULL ,
  `long_text_04` VARCHAR(128) NULL ,
  INDEX `fk_t04_project_1_idx` (`project_01` ASC) ,
  CONSTRAINT `fk_t04_project_1`
    FOREIGN KEY (`project_01` )
    REFERENCES `test`.`t01_case` (`project_01` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin2
COLLATE = latin2_czech_cs;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
