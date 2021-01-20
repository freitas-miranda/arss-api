CREATE DATABASE  IF NOT EXISTS `arss` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `arss`;
-- MariaDB dump 10.18  Distrib 10.5.8-MariaDB, for Win64 (AMD64)
--
-- Host: 127.0.0.1    Database: arss
-- ------------------------------------------------------
-- Server version	10.5.8-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `agendamento`
--

DROP TABLE IF EXISTS `agendamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `agendamento` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `paciente_id` int(10) unsigned NOT NULL,
  `medico_id` int(10) unsigned NOT NULL,
  `tipo` int(11) NOT NULL COMMENT '1-Consulta; 2-Exames',
  `status` int(11) NOT NULL COMMENT '1-Solicitado; 2-Confirmado; 3-Iniciado; 4-Finalizado; 5-Cancelado',
  `dia` date NOT NULL,
  `hora` varchar(5) NOT NULL,
  `solicitacao` datetime NOT NULL,
  `confirmacao` datetime DEFAULT NULL,
  `responsavel` int(11) DEFAULT NULL COMMENT 'Responsável pela confirmação',
  `inicio` datetime DEFAULT NULL,
  `fim` datetime DEFAULT NULL,
  `observacao` text DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(45) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(45) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_agendamento_medico_idx` (`medico_id`),
  KEY `fk_agendamento_paciente_idx` (`paciente_id`),
  CONSTRAINT `fk_agendamento_medico` FOREIGN KEY (`medico_id`) REFERENCES `medico` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_agendamento_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `paciente` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agendamento`
--

LOCK TABLES `agendamento` WRITE;
/*!40000 ALTER TABLE `agendamento` DISABLE KEYS */;
INSERT INTO `agendamento` VALUES (1,1,2,1,1,'2021-01-25','08:00','2021-01-19 22:48:01',NULL,NULL,NULL,NULL,NULL,'arss.sistema@gmail.com','2021-01-20 02:49:01',NULL,NULL,NULL,NULL),(2,2,3,2,1,'2021-01-25','10:00','2021-01-19 22:56:48',NULL,NULL,NULL,NULL,NULL,'arss.sistema@gmail.com','2021-01-20 02:56:53',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `agendamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consulta_medica`
--

DROP TABLE IF EXISTS `consulta_medica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `consulta_medica` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `agendamento_id` int(10) unsigned NOT NULL,
  `queixa_principal` text DEFAULT NULL,
  `historia_atual` text DEFAULT NULL,
  `historia_pregressa` text DEFAULT NULL,
  `historia_familiar` text DEFAULT NULL COMMENT 'Quando começou a sentir, ',
  `historia_social` text DEFAULT NULL,
  `peso` float DEFAULT NULL,
  `temperatura` float DEFAULT NULL,
  `pressao_sanguinea` float DEFAULT NULL,
  `batimento_cardiaco` float DEFAULT NULL,
  `plano_tratamento` text DEFAULT NULL,
  `observacao` text DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(45) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(45) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_consulta_agenda_idx` (`agendamento_id`),
  CONSTRAINT `fk_consulta_agenda` FOREIGN KEY (`agendamento_id`) REFERENCES `agendamento` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consulta_medica`
--

LOCK TABLES `consulta_medica` WRITE;
/*!40000 ALTER TABLE `consulta_medica` DISABLE KEYS */;
/*!40000 ALTER TABLE `consulta_medica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email`
--

DROP TABLE IF EXISTS `email`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `email` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(150) NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(50) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(50) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email`
--

LOCK TABLES `email` WRITE;
/*!40000 ALTER TABLE `email` DISABLE KEYS */;
INSERT INTO `email` VALUES (1,'freitas.miranda@gmail.com','freitas.miranda@gmail.com','2021-01-18 03:49:54',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 03:50:37'),(2,'freitas.miranda@gmail.coms','freitas.miranda@gmail.com','2021-01-18 03:50:37',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 03:50:52'),(3,'freitas.miranda@gmail.com','freitas.miranda@gmail.com','2021-01-18 03:50:52',NULL,NULL,NULL,NULL),(4,'leonardosousamelo@fleckens.hu','freitas.miranda@gmail.com','2021-01-18 03:53:42',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 03:54:52'),(5,'leonardosousamelo@fleckens.hus','freitas.miranda@gmail.com','2021-01-18 03:54:52',NULL,NULL,NULL,NULL),(6,'migueldiassantos@teleworm.us','freitas.miranda@gmail.com','2021-01-18 04:53:26',NULL,NULL,NULL,NULL),(7,'freitas.miranda@gmail.com','freitas.miranda@gmail.com','2021-01-19 03:34:01',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `email` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_confirmacao`
--

DROP TABLE IF EXISTS `email_confirmacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `email_confirmacao` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `token` varchar(300) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `email_atual` varchar(50) NOT NULL,
  `email_novo` varchar(50) NOT NULL,
  `data_vencimento` datetime NOT NULL,
  `ativo` int(1) unsigned NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(50) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(50) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_confirmacao`
--

LOCK TABLES `email_confirmacao` WRITE;
/*!40000 ALTER TABLE `email_confirmacao` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_confirmacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `endereco`
--

DROP TABLE IF EXISTS `endereco`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `endereco` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `logradouro` varchar(100) NOT NULL,
  `numero` varchar(45) DEFAULT NULL,
  `bairro` varchar(100) DEFAULT NULL,
  `cep` varchar(15) NOT NULL,
  `cidade` varchar(45) NOT NULL,
  `uf` char(2) NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(50) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(50) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `endereco`
--

LOCK TABLES `endereco` WRITE;
/*!40000 ALTER TABLE `endereco` DISABLE KEYS */;
INSERT INTO `endereco` VALUES (1,'RUA JOSÉ ALVES ','1718','CASA GRANDE','58103-125','CAMPINA GRANDE','PB','freitas.miranda@gmail.com','2021-01-18 04:53:26',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 04:54:24'),(2,'RUA JOSÉ ALVES ','1718','CASA GRANDES','58103-125','CAMPINA GRANDES','PB','freitas.miranda@gmail.com','2021-01-18 04:54:24',NULL,NULL,NULL,NULL),(3,'RUA PIAUÍ','620','SETOR 2','76890-000','JARU','RO','freitas.miranda@gmail.com','2021-01-18 04:54:58',NULL,NULL,NULL,NULL),(4,'RUA PIAUI','620','SETOR 5','76890-000','JARU','RO','freitas.miranda@gmail.com','2021-01-19 03:34:01',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `endereco` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `especialidade`
--

DROP TABLE IF EXISTS `especialidade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `especialidade` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(45) NOT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(45) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(45) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `especialidade`
--

LOCK TABLES `especialidade` WRITE;
/*!40000 ALTER TABLE `especialidade` DISABLE KEYS */;
INSERT INTO `especialidade` VALUES (1,'CLÍNICA MÉDICA','arss.sistema@gmail.com','2021-01-20 01:35:28',NULL,NULL,NULL,NULL),(2,'PEDIATRIA','arss.sistema@gmail.com','2021-01-20 01:35:28',NULL,NULL,NULL,NULL),(3,'GINECOLOGIA','arss.sistema@gmail.com','2021-01-20 01:35:28',NULL,NULL,NULL,NULL),(4,'OBSTETRÍCIA','arss.sistema@gmail.com','2021-01-20 01:35:28',NULL,NULL,NULL,NULL),(5,'ANESTESIOLOGIA','arss.sistema@gmail.com','2021-01-20 01:35:28',NULL,NULL,NULL,NULL),(6,'ORTOPEDIA','arss.sistema@gmail.com','2021-01-20 01:35:28',NULL,NULL,NULL,NULL),(7,'TRAUMATOLOGIA','arss.sistema@gmail.com','2021-01-20 01:35:28',NULL,NULL,NULL,NULL),(8,'CARDIOLOGIA','arss.sistema@gmail.com','2021-01-20 01:35:28',NULL,NULL,NULL,NULL),(9,'OFTALMOLOGIA','arss.sistema@gmail.com','2021-01-20 01:35:28',NULL,NULL,NULL,NULL),(10,'DERMATOLOGIA','arss.sistema@gmail.com','2021-01-20 01:35:28',NULL,NULL,NULL,NULL),(11,'RADIOLOGIA','arss.sistema@gmail.com','2021-01-20 01:35:28',NULL,NULL,NULL,NULL),(12,'PNEUMOLOGIA','arss.sistema@gmail.com','2021-01-20 01:37:39',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `especialidade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exame_medico`
--

DROP TABLE IF EXISTS `exame_medico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `exame_medico` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `agendamento_id` int(10) unsigned NOT NULL,
  `exame_medico_id` int(10) unsigned NOT NULL,
  `reultado` text DEFAULT NULL,
  `observacao` text DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(45) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(45) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_exame_agenda_idx` (`agendamento_id`),
  KEY `fk_exame_exame_medico_idx` (`exame_medico_id`),
  CONSTRAINT `fk_exame_agenda` FOREIGN KEY (`agendamento_id`) REFERENCES `agendamento` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_exame_exame_medico` FOREIGN KEY (`exame_medico_id`) REFERENCES `tipo_exame` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exame_medico`
--

LOCK TABLES `exame_medico` WRITE;
/*!40000 ALTER TABLE `exame_medico` DISABLE KEYS */;
/*!40000 ALTER TABLE `exame_medico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horario_trabalho`
--

DROP TABLE IF EXISTS `horario_trabalho`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `horario_trabalho` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `profissional_saude_id` int(10) unsigned NOT NULL,
  `unidade_saude_id` int(11) NOT NULL,
  `dia` date NOT NULL,
  `hora` varchar(5) NOT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(45) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(45) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_horario_profissional_profissional_saude_idx` (`profissional_saude_id`),
  CONSTRAINT `fk_horario_profissional_profissional_saude` FOREIGN KEY (`profissional_saude_id`) REFERENCES `profissional_saude` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horario_trabalho`
--

LOCK TABLES `horario_trabalho` WRITE;
/*!40000 ALTER TABLE `horario_trabalho` DISABLE KEYS */;
INSERT INTO `horario_trabalho` VALUES (1,1,1,'2021-01-25','08:00','arss.sistema@gmail.com','2021-01-20 02:21:15',NULL,NULL,NULL,NULL),(2,1,1,'2021-01-25','09:00','arss.sistema@gmail.com','2021-01-20 02:31:01',NULL,NULL,NULL,NULL),(3,1,1,'2021-01-25','10:00','arss.sistema@gmail.com','2021-01-20 02:31:01',NULL,NULL,NULL,NULL),(4,1,1,'2021-01-25','11:00','arss.sistema@gmail.com','2021-01-20 02:31:01',NULL,NULL,NULL,NULL),(5,1,1,'2021-01-25','12:00','arss.sistema@gmail.com','2021-01-20 02:31:01',NULL,NULL,NULL,NULL),(6,1,1,'2021-01-25','14:00','arss.sistema@gmail.com','2021-01-20 02:31:01',NULL,NULL,NULL,NULL),(7,1,1,'2021-01-25','15:00','arss.sistema@gmail.com','2021-01-20 02:31:01',NULL,NULL,NULL,NULL),(8,1,1,'2021-01-25','16:00','arss.sistema@gmail.com','2021-01-20 02:31:01',NULL,NULL,NULL,NULL),(9,1,1,'2021-01-25','17:00','arss.sistema@gmail.com','2021-01-20 02:31:01',NULL,NULL,NULL,NULL),(10,1,1,'2021-01-25','18:00','arss.sistema@gmail.com','2021-01-20 02:31:01',NULL,NULL,NULL,NULL),(11,1,1,'2021-01-26','08:00','arss.sistema@gmail.com','2021-01-20 02:31:01',NULL,NULL,NULL,NULL),(12,1,1,'2021-01-26','09:00','arss.sistema@gmail.com','2021-01-20 02:31:01',NULL,NULL,NULL,NULL),(13,1,1,'2021-01-26','10:00','arss.sistema@gmail.com','2021-01-20 02:31:01',NULL,NULL,NULL,NULL),(14,1,1,'2021-01-26','11:00','arss.sistema@gmail.com','2021-01-20 02:31:01',NULL,NULL,NULL,NULL),(15,1,1,'2021-01-26','12:00','arss.sistema@gmail.com','2021-01-20 02:31:01',NULL,NULL,NULL,NULL),(16,1,1,'2021-01-26','14:00','arss.sistema@gmail.com','2021-01-20 02:31:01',NULL,NULL,NULL,NULL),(17,1,1,'2021-01-26','15:00','arss.sistema@gmail.com','2021-01-20 02:33:39',NULL,NULL,NULL,NULL),(18,1,1,'2021-01-26','16:00','arss.sistema@gmail.com','2021-01-20 02:33:39',NULL,NULL,NULL,NULL),(19,1,1,'2021-01-26','17:00','arss.sistema@gmail.com','2021-01-20 02:33:39',NULL,NULL,NULL,NULL),(20,1,1,'2021-01-26','18:00','arss.sistema@gmail.com','2021-01-20 02:33:39',NULL,NULL,NULL,NULL),(21,2,1,'2021-01-25','08:00','arss.sistema@gmail.com','2021-01-20 02:43:26',NULL,NULL,NULL,NULL),(22,2,1,'2021-01-25','09:00','arss.sistema@gmail.com','2021-01-20 02:43:26',NULL,NULL,NULL,NULL),(23,2,1,'2021-01-25','10:00','arss.sistema@gmail.com','2021-01-20 02:43:26',NULL,NULL,NULL,NULL),(24,2,1,'2021-01-25','11:00','arss.sistema@gmail.com','2021-01-20 02:43:26',NULL,NULL,NULL,NULL),(25,2,1,'2021-01-25','12:00','arss.sistema@gmail.com','2021-01-20 02:43:26',NULL,NULL,NULL,NULL),(26,2,1,'2021-01-25','14:00','arss.sistema@gmail.com','2021-01-20 02:43:26',NULL,NULL,NULL,NULL),(27,2,1,'2021-01-25','15:00','arss.sistema@gmail.com','2021-01-20 02:43:26',NULL,NULL,NULL,NULL),(28,2,1,'2021-01-25','16:00','arss.sistema@gmail.com','2021-01-20 02:43:26',NULL,NULL,NULL,NULL),(29,2,1,'2021-01-25','17:00','arss.sistema@gmail.com','2021-01-20 02:43:26',NULL,NULL,NULL,NULL),(30,2,1,'2021-01-25','18:00','arss.sistema@gmail.com','2021-01-20 02:43:26',NULL,NULL,NULL,NULL),(31,2,1,'2021-01-26','08:00','arss.sistema@gmail.com','2021-01-20 02:43:26',NULL,NULL,NULL,NULL),(32,2,1,'2021-01-26','09:00','arss.sistema@gmail.com','2021-01-20 02:43:26',NULL,NULL,NULL,NULL),(33,2,1,'2021-01-26','10:00','arss.sistema@gmail.com','2021-01-20 02:43:26',NULL,NULL,NULL,NULL),(34,2,1,'2021-01-26','11:00','arss.sistema@gmail.com','2021-01-20 02:43:26',NULL,NULL,NULL,NULL),(35,2,1,'2021-01-26','12:00','arss.sistema@gmail.com','2021-01-20 02:43:26',NULL,NULL,NULL,NULL),(36,2,1,'2021-01-26','14:00','arss.sistema@gmail.com','2021-01-20 02:43:26',NULL,NULL,NULL,NULL),(37,2,1,'2021-01-26','15:00','arss.sistema@gmail.com','2021-01-20 02:43:26',NULL,NULL,NULL,NULL),(38,2,1,'2021-01-26','16:00','arss.sistema@gmail.com','2021-01-20 02:43:26',NULL,NULL,NULL,NULL),(39,2,1,'2021-01-26','17:00','arss.sistema@gmail.com','2021-01-20 02:43:26',NULL,NULL,NULL,NULL),(40,2,1,'2021-01-26','18:00','arss.sistema@gmail.com','2021-01-20 02:43:26',NULL,NULL,NULL,NULL),(41,3,1,'2021-01-25','08:00','arss.sistema@gmail.com','2021-01-20 02:57:51',NULL,NULL,NULL,NULL),(42,3,1,'2021-01-25','09:00','arss.sistema@gmail.com','2021-01-20 02:57:51',NULL,NULL,NULL,NULL),(43,3,1,'2021-01-25','10:00','arss.sistema@gmail.com','2021-01-20 02:57:51',NULL,NULL,NULL,NULL),(44,3,1,'2021-01-25','11:00','arss.sistema@gmail.com','2021-01-20 02:57:51',NULL,NULL,NULL,NULL),(45,3,1,'2021-01-25','12:00','arss.sistema@gmail.com','2021-01-20 02:57:51',NULL,NULL,NULL,NULL),(46,3,1,'2021-01-25','14:00','arss.sistema@gmail.com','2021-01-20 02:57:51',NULL,NULL,NULL,NULL),(47,3,1,'2021-01-25','15:00','arss.sistema@gmail.com','2021-01-20 02:57:51',NULL,NULL,NULL,NULL),(48,3,1,'2021-01-25','16:00','arss.sistema@gmail.com','2021-01-20 02:57:51',NULL,NULL,NULL,NULL),(49,3,1,'2021-01-25','17:00','arss.sistema@gmail.com','2021-01-20 02:57:51',NULL,NULL,NULL,NULL),(50,3,1,'2021-01-25','18:00','arss.sistema@gmail.com','2021-01-20 02:57:51',NULL,NULL,NULL,NULL),(51,3,1,'2021-01-26','08:00','arss.sistema@gmail.com','2021-01-20 02:57:51',NULL,NULL,NULL,NULL),(52,3,1,'2021-01-26','09:00','arss.sistema@gmail.com','2021-01-20 02:57:51',NULL,NULL,NULL,NULL),(53,3,1,'2021-01-26','10:00','arss.sistema@gmail.com','2021-01-20 02:57:51',NULL,NULL,NULL,NULL),(54,3,1,'2021-01-26','11:00','arss.sistema@gmail.com','2021-01-20 02:57:51',NULL,NULL,NULL,NULL),(55,3,1,'2021-01-26','12:00','arss.sistema@gmail.com','2021-01-20 02:57:51',NULL,NULL,NULL,NULL),(56,3,1,'2021-01-26','14:00','arss.sistema@gmail.com','2021-01-20 02:57:51',NULL,NULL,NULL,NULL),(57,3,1,'2021-01-26','15:00','arss.sistema@gmail.com','2021-01-20 02:57:51',NULL,NULL,NULL,NULL),(58,3,1,'2021-01-26','16:00','arss.sistema@gmail.com','2021-01-20 02:57:51',NULL,NULL,NULL,NULL),(59,3,1,'2021-01-26','17:00','arss.sistema@gmail.com','2021-01-20 02:57:51',NULL,NULL,NULL,NULL),(60,3,1,'2021-01-26','18:00','arss.sistema@gmail.com','2021-01-20 02:57:51',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `horario_trabalho` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medico`
--

DROP TABLE IF EXISTS `medico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `medico` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `profissional_saude_id` int(10) unsigned NOT NULL,
  `crm` varchar(45) NOT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(45) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(45) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_medico_profissional_saude_idx` (`profissional_saude_id`),
  CONSTRAINT `fk_medico_profissional_saude` FOREIGN KEY (`profissional_saude_id`) REFERENCES `profissional_saude` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medico`
--

LOCK TABLES `medico` WRITE;
/*!40000 ALTER TABLE `medico` DISABLE KEYS */;
INSERT INTO `medico` VALUES (1,1,'42893','arss.sistema@gmail.com','2021-01-20 01:54:16',NULL,NULL,NULL,NULL),(2,2,'5824','arss.sistema@gmail.com','2021-01-20 01:56:23',NULL,NULL,NULL,NULL),(3,3,'60259','arss.sistema@gmail.com','2021-01-20 02:03:19',NULL,NULL,NULL,NULL),(4,5,'60260','arss.sistema@gmail.com','2021-01-20 02:07:49',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `medico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medico_especialidade`
--

DROP TABLE IF EXISTS `medico_especialidade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `medico_especialidade` (
  `medico_id` int(10) unsigned NOT NULL,
  `especialidade_id` int(10) unsigned NOT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(45) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(45) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`medico_id`,`especialidade_id`),
  KEY `fk_especialidade_medico_medico_idx` (`medico_id`),
  KEY `fk_especialidade_medico_especialidade_idx` (`especialidade_id`),
  CONSTRAINT `fk_especialidade_medico_especialidade` FOREIGN KEY (`especialidade_id`) REFERENCES `especialidade` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_especialidade_medico_medico` FOREIGN KEY (`medico_id`) REFERENCES `medico` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medico_especialidade`
--

LOCK TABLES `medico_especialidade` WRITE;
/*!40000 ALTER TABLE `medico_especialidade` DISABLE KEYS */;
INSERT INTO `medico_especialidade` VALUES (1,1,'arss.sistema@gmail.com','2021-01-20 01:58:37',NULL,NULL,NULL,NULL),(2,12,'arss.sistema@gmail.com','2021-01-20 01:58:37',NULL,NULL,NULL,NULL),(3,3,'arss.sistema@gmail.com','2021-01-20 02:03:51',NULL,NULL,NULL,NULL),(3,4,'arss.sistema@gmail.com','2021-01-20 02:03:51',NULL,NULL,NULL,NULL),(4,10,'arss.sistema@gmail.com','2021-01-20 02:08:14',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `medico_especialidade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opcao`
--

DROP TABLE IF EXISTS `opcao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `opcao` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(100) NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(50) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(50) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opcao`
--

LOCK TABLES `opcao` WRITE;
/*!40000 ALTER TABLE `opcao` DISABLE KEYS */;
INSERT INTO `opcao` VALUES (1,'SIM OU NAO','arss.sistema@gmail.com','2021-01-17 14:16:35',NULL,NULL,NULL,NULL),(2,'SEXO','arss.sistema@gmail.com','2021-01-17 14:17:31',NULL,NULL,NULL,NULL),(3,'TIPO SANGUINEO','arss.sistema@gmail.com','2021-01-17 14:17:31',NULL,NULL,NULL,NULL),(4,'TIPO TELEFONE','arss.sistema@gmail.com','2021-01-18 01:14:58',NULL,NULL,NULL,NULL),(5,'TIPO AGENDAMENTO','arss.sistema@gmail.com','2021-01-20 03:05:27',NULL,NULL,NULL,NULL),(6,'STATUS AGENDAMENTO','arss.sistema@gmail.com','2021-01-20 03:05:27',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `opcao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opcao_item`
--

DROP TABLE IF EXISTS `opcao_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `opcao_item` (
  `opcao_id` int(10) unsigned NOT NULL,
  `codigo` varchar(30) NOT NULL,
  `descricao` varchar(100) NOT NULL,
  `ordem` int(11) NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(50) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(50) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`opcao_id`,`codigo`),
  KEY `fk_item_opcao_idx` (`opcao_id`),
  CONSTRAINT `fk_item_opcao` FOREIGN KEY (`opcao_id`) REFERENCES `opcao` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opcao_item`
--

LOCK TABLES `opcao_item` WRITE;
/*!40000 ALTER TABLE `opcao_item` DISABLE KEYS */;
INSERT INTO `opcao_item` VALUES (1,'N','NÃO',2,'arss.sistema@gmail.com','2021-01-17 14:18:47',NULL,NULL,NULL,NULL),(1,'S','SIM',1,'arss.sistema@gmail.com','2021-01-17 14:18:47',NULL,NULL,NULL,NULL),(2,'F','FEMININO',1,'arss.sistema@gmail.com','2021-01-17 14:18:47',NULL,NULL,NULL,NULL),(2,'M','MASCULINO',2,'arss.sistema@gmail.com','2021-01-17 14:18:47',NULL,NULL,NULL,NULL),(3,'A+','A+++',3,'arss.sistema@gmail.com','2021-01-17 14:21:48',NULL,NULL,NULL,NULL),(3,'A-','A-',4,'arss.sistema@gmail.com','2021-01-17 14:21:49',NULL,NULL,NULL,NULL),(3,'AB+','AB+',7,'arss.sistema@gmail.com','2021-01-17 14:21:49',NULL,NULL,NULL,NULL),(3,'AB-','AB-',8,'arss.sistema@gmail.com','2021-01-17 14:21:49',NULL,NULL,NULL,NULL),(3,'B+','B+',5,'arss.sistema@gmail.com','2021-01-17 14:21:49',NULL,NULL,NULL,NULL),(3,'B-','B-',6,'arss.sistema@gmail.com','2021-01-17 14:21:49',NULL,NULL,NULL,NULL),(3,'O+','O+',1,'arss.sistema@gmail.com','2021-01-17 14:21:48',NULL,NULL,NULL,NULL),(3,'O-','O-',2,'arss.sistema@gmail.com','2021-01-17 14:21:48',NULL,NULL,NULL,NULL),(4,'1','PESSOAL',1,'arss.sistema@gmail.com','2021-01-18 01:15:01',NULL,NULL,NULL,NULL),(4,'2','TRABALHO',2,'arss.sistema@gmail.com','2021-01-18 01:15:01',NULL,NULL,NULL,NULL),(4,'3','PARENTE',3,'arss.sistema@gmail.com','2021-01-18 01:15:01',NULL,NULL,NULL,NULL),(5,'1','CONSULTA',1,'arss.sistema@gmail.com','2021-01-20 03:05:38',NULL,NULL,NULL,NULL),(5,'2','EXAME',2,'arss.sistema@gmail.com','2021-01-20 03:05:38',NULL,NULL,NULL,NULL),(6,'1','SOLICITADO',1,'arss.sistema@gmail.com','2021-01-20 03:05:38',NULL,NULL,NULL,NULL),(6,'2','CONFIRMADO',2,'arss.sistema@gmail.com','2021-01-20 03:05:38',NULL,NULL,NULL,NULL),(6,'3','INICIADO',3,'arss.sistema@gmail.com','2021-01-20 03:05:38',NULL,NULL,NULL,NULL),(6,'4','FINALIZADO',4,'arss.sistema@gmail.com','2021-01-20 03:05:38',NULL,NULL,NULL,NULL),(6,'5','CANCELADO',5,'arss.sistema@gmail.com','2021-01-20 03:05:38',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `opcao_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paciente`
--

DROP TABLE IF EXISTS `paciente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `paciente` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pessoa_id` int(10) unsigned NOT NULL,
  `cartao_sus` varchar(45) DEFAULT NULL,
  `tipo_sanguineo` varchar(45) DEFAULT NULL,
  `peso` float DEFAULT NULL COMMENT 'Em quilos',
  `altura` float DEFAULT NULL COMMENT 'Em centímetros',
  `created_by` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(45) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(45) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_paciente_pessoa_idx` (`pessoa_id`),
  CONSTRAINT `fk_paciente_pessoa` FOREIGN KEY (`pessoa_id`) REFERENCES `pessoa` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paciente`
--

LOCK TABLES `paciente` WRITE;
/*!40000 ALTER TABLE `paciente` DISABLE KEYS */;
INSERT INTO `paciente` VALUES (1,1,'3213131','O+',102.5,1.73,'arss.sistema@gmail.com','2021-01-19 03:34:01',NULL,NULL,NULL,NULL),(2,2,'44565464','A-',45,1.63,'arss.sistema@gmail.com','2021-01-20 02:55:40',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `paciente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perfil_acesso`
--

DROP TABLE IF EXISTS `perfil_acesso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `perfil_acesso` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(45) NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(50) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(50) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfil_acesso`
--

LOCK TABLES `perfil_acesso` WRITE;
/*!40000 ALTER TABLE `perfil_acesso` DISABLE KEYS */;
INSERT INTO `perfil_acesso` VALUES (1,'ADMINISTRADOR','1','2021-01-15 02:02:16',NULL,NULL,NULL,NULL),(2,'GESTOR','SISTEMA_ARSS','2021-01-15 02:31:42','SISTEMA_ARSS','2021-01-16 02:14:19',NULL,NULL),(3,'SECRETÁRIA',NULL,'2021-01-16 02:15:02',NULL,NULL,NULL,NULL),(4,'PACIENTES',NULL,'2021-01-16 02:27:14',NULL,'2021-01-16 19:26:23',NULL,NULL);
/*!40000 ALTER TABLE `perfil_acesso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pessoa`
--

DROP TABLE IF EXISTS `pessoa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pessoa` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cpf` varchar(11) NOT NULL,
  `data_nascimento` date NOT NULL,
  `sexo` char(1) NOT NULL,
  `usuario_id` int(10) unsigned DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(50) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(50) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_pessoa_usuario_idx` (`usuario_id`),
  CONSTRAINT `fk_pessoa_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pessoa`
--

LOCK TABLES `pessoa` WRITE;
/*!40000 ALTER TABLE `pessoa` DISABLE KEYS */;
INSERT INTO `pessoa` VALUES (1,'ALAN MIRANDA','96481250234','1991-09-16','M',NULL,'freitas.miranda@gmail.com','2021-01-16 15:22:45','freitas.miranda@gmail.com','2021-01-19 03:34:01',NULL,NULL),(2,'RAIANE BELE','99481250234','1997-02-17','F',NULL,'freitas.miranda@gmail.com','2021-01-16 15:51:41','freitas.miranda@gmail.com','2021-01-18 02:23:59',NULL,NULL),(3,'GILBERTO SILVA','38846804716','1987-01-17','M',NULL,'freitas.miranda@gmail.com','2021-01-17 02:59:25','freitas.miranda@gmail.com','2021-01-18 02:23:25',NULL,NULL),(4,'LEILA COSTA','30071294350','1990-07-31','F',NULL,'freitas.miranda@gmail.com','2021-01-17 21:20:13','freitas.miranda@gmail.com','2021-01-18 03:09:11',NULL,NULL),(13,'KAUAN SOUZA','55902362822','2000-01-21','M',NULL,'freitas.miranda@gmail.com','2021-01-18 02:45:29','freitas.miranda@gmail.com','2021-01-18 03:23:10',NULL,NULL),(14,'LUCIANA MELO','21939678811','1978-12-13','F',NULL,'freitas.miranda@gmail.com','2021-01-18 02:46:32',NULL,NULL,NULL,NULL),(15,'LEONARDO MELO','79109284753','1921-11-07','M',NULL,'freitas.miranda@gmail.com','2021-01-18 03:53:42','freitas.miranda@gmail.com','2021-01-18 03:54:51',NULL,NULL),(16,'MIGUEL SANTOS','75167505224','1926-09-30','M',NULL,'freitas.miranda@gmail.com','2021-01-18 04:53:26','freitas.miranda@gmail.com','2021-01-18 04:54:24',NULL,NULL),(17,'ALINE FERRAZ','66096055486','1985-02-10','F',NULL,'freitas.miranda@gmail.com','2021-01-20 01:19:12',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `pessoa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pessoa_email`
--

DROP TABLE IF EXISTS `pessoa_email`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pessoa_email` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pessoa_id` int(10) unsigned NOT NULL,
  `email_id` int(11) NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(50) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(50) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_pessoa_email_email_idx` (`email_id`),
  KEY `fk_pessoa_email_pessoa_idx` (`pessoa_id`),
  CONSTRAINT `fk_pessoa_email_email` FOREIGN KEY (`email_id`) REFERENCES `email` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_pessoa_email_pessoa` FOREIGN KEY (`pessoa_id`) REFERENCES `pessoa` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pessoa_email`
--

LOCK TABLES `pessoa_email` WRITE;
/*!40000 ALTER TABLE `pessoa_email` DISABLE KEYS */;
INSERT INTO `pessoa_email` VALUES (1,1,1,'freitas.miranda@gmail.com','2021-01-18 03:49:54',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 03:50:37'),(2,1,2,'freitas.miranda@gmail.com','2021-01-18 03:50:37',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 03:50:52'),(3,1,3,'freitas.miranda@gmail.com','2021-01-18 03:50:52',NULL,NULL,NULL,NULL),(4,15,4,'freitas.miranda@gmail.com','2021-01-18 03:53:42',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 03:54:52'),(5,15,5,'freitas.miranda@gmail.com','2021-01-18 03:54:52',NULL,NULL,NULL,NULL),(6,16,6,'freitas.miranda@gmail.com','2021-01-18 04:53:26',NULL,NULL,NULL,NULL),(7,1,7,'freitas.miranda@gmail.com','2021-01-19 03:34:02',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `pessoa_email` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pessoa_endereco`
--

DROP TABLE IF EXISTS `pessoa_endereco`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pessoa_endereco` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pessoa_id` int(10) unsigned NOT NULL,
  `endereco_id` int(10) unsigned NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(50) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(50) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_pessoa_endereco_endereco_idx` (`endereco_id`),
  KEY `fk_pessoa_endereco_pessoa_idx` (`pessoa_id`),
  CONSTRAINT `fk_pessoa_endereco_endereco` FOREIGN KEY (`endereco_id`) REFERENCES `endereco` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_pessoa_endereco_pessoa` FOREIGN KEY (`pessoa_id`) REFERENCES `pessoa` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pessoa_endereco`
--

LOCK TABLES `pessoa_endereco` WRITE;
/*!40000 ALTER TABLE `pessoa_endereco` DISABLE KEYS */;
INSERT INTO `pessoa_endereco` VALUES (1,16,1,'freitas.miranda@gmail.com','2021-01-18 04:53:26',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 04:54:24'),(2,16,2,'freitas.miranda@gmail.com','2021-01-18 04:54:25',NULL,NULL,NULL,NULL),(3,1,3,'freitas.miranda@gmail.com','2021-01-18 04:54:58',NULL,NULL,NULL,NULL),(4,1,4,'freitas.miranda@gmail.com','2021-01-19 03:34:01',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `pessoa_endereco` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pessoa_telefone`
--

DROP TABLE IF EXISTS `pessoa_telefone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pessoa_telefone` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pessoa_id` int(10) unsigned NOT NULL,
  `telefone_id` int(10) unsigned NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(50) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(50) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_pessoa_telefone_telefone_idx` (`telefone_id`),
  KEY `fk_pessoa_telefone_pessoa_idx` (`pessoa_id`),
  CONSTRAINT `fk_pessoa_telefone_pessoa` FOREIGN KEY (`pessoa_id`) REFERENCES `pessoa` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_pessoa_telefone_telefone` FOREIGN KEY (`telefone_id`) REFERENCES `telefone` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pessoa_telefone`
--

LOCK TABLES `pessoa_telefone` WRITE;
/*!40000 ALTER TABLE `pessoa_telefone` DISABLE KEYS */;
INSERT INTO `pessoa_telefone` VALUES (1,1,1,'freitas.miranda@gmail.com','2021-01-17 18:05:00',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 00:44:09'),(2,2,2,'freitas.miranda@gmail.com','2021-01-17 19:08:04',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 02:24:00'),(3,1,4,'freitas.miranda@gmail.com','2021-01-18 00:44:10',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 00:48:12'),(4,1,5,'freitas.miranda@gmail.com','2021-01-18 00:48:12',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 01:21:29'),(5,1,6,'freitas.miranda@gmail.com','2021-01-18 01:21:29',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 01:34:07'),(6,1,7,'freitas.miranda@gmail.com','2021-01-18 01:34:07',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 01:55:06'),(7,1,8,'freitas.miranda@gmail.com','2021-01-18 01:55:06',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 02:01:23'),(8,1,9,'freitas.miranda@gmail.com','2021-01-18 02:01:23',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 02:01:39'),(9,1,10,'freitas.miranda@gmail.com','2021-01-18 02:01:39',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 02:02:05'),(10,1,11,'freitas.miranda@gmail.com','2021-01-18 02:02:05',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 02:02:15'),(11,1,12,'freitas.miranda@gmail.com','2021-01-18 02:02:15',NULL,NULL,NULL,NULL),(12,3,13,'freitas.miranda@gmail.com','2021-01-18 02:23:26',NULL,NULL,NULL,NULL),(13,2,14,'freitas.miranda@gmail.com','2021-01-18 02:24:00',NULL,NULL,NULL,NULL),(14,13,15,'freitas.miranda@gmail.com','2021-01-18 02:45:29',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 03:23:10'),(15,13,16,'freitas.miranda@gmail.com','2021-01-18 03:10:41',NULL,NULL,NULL,NULL),(16,13,17,'freitas.miranda@gmail.com','2021-01-18 03:23:10',NULL,NULL,NULL,NULL),(17,15,18,'freitas.miranda@gmail.com','2021-01-18 03:53:42',NULL,NULL,NULL,NULL),(18,16,19,'freitas.miranda@gmail.com','2021-01-18 04:53:26',NULL,NULL,NULL,NULL),(19,1,20,'freitas.miranda@gmail.com','2021-01-19 03:34:01',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `pessoa_telefone` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `procedimento`
--

DROP TABLE IF EXISTS `procedimento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `procedimento` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `agendamento_id` int(10) unsigned NOT NULL,
  `tipo_procedimento_id` int(10) unsigned NOT NULL,
  `obsercavao` text DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(45) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(45) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_procedimento_tipo_procedimento_idx` (`tipo_procedimento_id`),
  KEY `fk_procedimento_agendamento_idx` (`agendamento_id`),
  CONSTRAINT `fk_procedimento_agendamento` FOREIGN KEY (`agendamento_id`) REFERENCES `agendamento` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_procedimento_tipo_procedimento` FOREIGN KEY (`tipo_procedimento_id`) REFERENCES `tipo_procedimento` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `procedimento`
--

LOCK TABLES `procedimento` WRITE;
/*!40000 ALTER TABLE `procedimento` DISABLE KEYS */;
/*!40000 ALTER TABLE `procedimento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profissional_saude`
--

DROP TABLE IF EXISTS `profissional_saude`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profissional_saude` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pessoa_id` int(10) unsigned NOT NULL,
  `tipo_profissional_id` int(10) unsigned NOT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(45) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(45) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_profissional_saude_tipo_profissional_idx` (`tipo_profissional_id`),
  KEY `fk_profissional_saude_pessoa_idx` (`pessoa_id`),
  CONSTRAINT `fk_profissional_saude_pessoa` FOREIGN KEY (`pessoa_id`) REFERENCES `pessoa` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_profissional_saude_tipo_profissional` FOREIGN KEY (`tipo_profissional_id`) REFERENCES `tipo_profissional` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profissional_saude`
--

LOCK TABLES `profissional_saude` WRITE;
/*!40000 ALTER TABLE `profissional_saude` DISABLE KEYS */;
INSERT INTO `profissional_saude` VALUES (1,3,1,'arss.sistema@gmail.com','2021-01-20 01:25:14',NULL,NULL,NULL,NULL),(2,17,1,'arss.sistema@gmail.com','2021-01-20 01:42:57',NULL,NULL,NULL,NULL),(3,14,1,'arss.sistema@gmail.com','2021-01-20 02:02:21',NULL,NULL,NULL,NULL),(4,4,5,'arss.sistema@gmail.com','2021-01-20 02:05:23',NULL,NULL,NULL,NULL),(5,15,1,'arss.sistema@gmail.com','2021-01-20 02:07:30',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `profissional_saude` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recuperacao_senha`
--

DROP TABLE IF EXISTS `recuperacao_senha`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `recuperacao_senha` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `token` varchar(300) NOT NULL,
  `usuario_id` int(11) unsigned NOT NULL,
  `data_vencimento` datetime NOT NULL,
  `ativo` int(1) unsigned NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(50) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(50) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recuperacao_senha`
--

LOCK TABLES `recuperacao_senha` WRITE;
/*!40000 ALTER TABLE `recuperacao_senha` DISABLE KEYS */;
/*!40000 ALTER TABLE `recuperacao_senha` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `telefone`
--

DROP TABLE IF EXISTS `telefone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `telefone` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ddd` varchar(3) NOT NULL,
  `numero` varchar(20) NOT NULL,
  `tipo` char(1) NOT NULL COMMENT '1-Pessoal; 2-Trabalho; 3-Parente',
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(50) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(50) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `telefone`
--

LOCK TABLES `telefone` WRITE;
/*!40000 ALTER TABLE `telefone` DISABLE KEYS */;
INSERT INTO `telefone` VALUES (1,'69','999999999','1','freitas.miranda@gmail.com','2021-01-17 18:04:05',NULL,NULL,'FREITAS.MIRANDA@GMAIL.COM','2021-01-18 00:44:10'),(2,'69','12345678','1','freitas.miranda@gmail.com','2021-01-17 19:07:52',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 02:24:00'),(4,'12','345678999','1','FREITAS.MIRANDA@GMAIL.COM','2021-01-18 00:44:10',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 00:48:12'),(5,'69','999827230','1','freitas.miranda@gmail.com','2021-01-18 00:48:12',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 01:21:29'),(6,'69','35215729','1','freitas.miranda@gmail.com','2021-01-18 01:21:29',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 01:34:07'),(7,'69','35215729','2','freitas.miranda@gmail.com','2021-01-18 01:34:07',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 01:55:06'),(8,'69','35215729','3','freitas.miranda@gmail.com','2021-01-18 01:55:06',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 02:01:23'),(9,'69','35215729','2','freitas.miranda@gmail.com','2021-01-18 02:01:23',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 02:01:39'),(10,'69','35215727','3','freitas.miranda@gmail.com','2021-01-18 02:01:39',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 02:02:05'),(11,'69','35215727','1','freitas.miranda@gmail.com','2021-01-18 02:02:05',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 02:02:15'),(12,'69','35215728','1','freitas.miranda@gmail.com','2021-01-18 02:02:15',NULL,NULL,NULL,NULL),(13,'69','35218000','2','freitas.miranda@gmail.com','2021-01-18 02:23:25',NULL,NULL,NULL,NULL),(14,'69','12345678','2','freitas.miranda@gmail.com','2021-01-18 02:24:00',NULL,NULL,NULL,NULL),(15,'82','49004760','1','freitas.miranda@gmail.com','2021-01-18 02:45:29',NULL,NULL,'freitas.miranda@gmail.com','2021-01-18 03:23:10'),(16,'69','999827230','1','freitas.miranda@gmail.com','2021-01-18 03:10:41',NULL,NULL,NULL,NULL),(17,'82','49004760','2','freitas.miranda@gmail.com','2021-01-18 03:23:10',NULL,NULL,NULL,NULL),(18,'84','20402533','1','freitas.miranda@gmail.com','2021-01-18 03:53:42',NULL,NULL,NULL,NULL),(19,'83','79393964','1','freitas.miranda@gmail.com','2021-01-18 04:53:26',NULL,NULL,NULL,NULL),(20,'69','999827230','1','freitas.miranda@gmail.com','2021-01-19 03:34:01',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `telefone` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_exame`
--

DROP TABLE IF EXISTS `tipo_exame`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tipo_exame` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(45) DEFAULT NULL COMMENT 'Por exemplo, exames de sangue, ultrassonografias, endoscopia, etc.',
  `created_by` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(45) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(45) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_exame`
--

LOCK TABLES `tipo_exame` WRITE;
/*!40000 ALTER TABLE `tipo_exame` DISABLE KEYS */;
/*!40000 ALTER TABLE `tipo_exame` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_procedimento`
--

DROP TABLE IF EXISTS `tipo_procedimento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tipo_procedimento` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(45) DEFAULT NULL COMMENT 'Hemodiálise',
  `created_by` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(45) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(45) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_procedimento`
--

LOCK TABLES `tipo_procedimento` WRITE;
/*!40000 ALTER TABLE `tipo_procedimento` DISABLE KEYS */;
/*!40000 ALTER TABLE `tipo_procedimento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_profissional`
--

DROP TABLE IF EXISTS `tipo_profissional`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tipo_profissional` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(100) NOT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(45) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(45) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_profissional`
--

LOCK TABLES `tipo_profissional` WRITE;
/*!40000 ALTER TABLE `tipo_profissional` DISABLE KEYS */;
INSERT INTO `tipo_profissional` VALUES (1,'MÉDICO(A)','freitas.miranda@gmail.com','2021-01-20 01:11:50',NULL,NULL,NULL,NULL),(2,'ENFERMEIRO(A)','freitas.miranda@gmail.com','2021-01-20 01:11:50',NULL,NULL,NULL,NULL),(3,'FISIOTERAPEUTA','freitas.miranda@gmail.com','2021-01-20 01:11:51',NULL,NULL,NULL,NULL),(4,'PSICÓLOGO(A)','freitas.miranda@gmail.com','2021-01-20 01:11:51',NULL,NULL,NULL,NULL),(5,'SECRETARIO(A)','freitas.miranda@gmail.com','2021-01-20 01:11:52',NULL,NULL,NULL,NULL),(6,'RADIOLOGISTA','freitas.miranda@gmail.com','2021-01-20 01:11:52',NULL,NULL,NULL,NULL),(7,'RECEPCIONISTA','freitas.miranda@gmail.com','2021-01-20 01:11:52',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `tipo_profissional` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_unidade`
--

DROP TABLE IF EXISTS `tipo_unidade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tipo_unidade` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(45) DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(45) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(45) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_unidade`
--

LOCK TABLES `tipo_unidade` WRITE;
/*!40000 ALTER TABLE `tipo_unidade` DISABLE KEYS */;
INSERT INTO `tipo_unidade` VALUES (1,'HOSPITAL','freitas.miranda@gmail.com','2021-01-20 00:30:38',NULL,NULL,NULL,NULL),(2,'POSTOS DE SAÚDE','freitas.miranda@gmail.com','2021-01-20 00:30:38',NULL,NULL,NULL,NULL),(3,'CLÍNICA MÉDICA','freitas.miranda@gmail.com','2021-01-20 00:30:39',NULL,NULL,NULL,NULL),(4,'LABORATÓRIO DE ANÁLISES CLÍNICAS','freitas.miranda@gmail.com','2021-01-20 00:30:39',NULL,NULL,NULL,NULL),(5,'FARMÁCIA MINICIPAL','freitas.miranda@gmail.com','2021-01-20 00:44:41',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `tipo_unidade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unidade_saude`
--

DROP TABLE IF EXISTS `unidade_saude`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `unidade_saude` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tipo_unidade_id` int(10) unsigned NOT NULL,
  `descricao` varchar(100) NOT NULL,
  `cnes` varchar(10) DEFAULT NULL,
  `cnpj` varchar(14) DEFAULT NULL,
  `publica` tinyint(4) DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(45) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(45) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_unidade_saude_tipo_unidade_idx` (`tipo_unidade_id`),
  CONSTRAINT `fk_unidade_saude_tipo_unidade` FOREIGN KEY (`tipo_unidade_id`) REFERENCES `tipo_unidade` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unidade_saude`
--

LOCK TABLES `unidade_saude` WRITE;
/*!40000 ALTER TABLE `unidade_saude` DISABLE KEYS */;
INSERT INTO `unidade_saude` VALUES (1,1,'HOSPITAL MUNICIPAL SANDOVAL DE ARAUJO ','2808609','04279238000230',1,'freitas.miranda@gmail.com','2021-01-20 00:41:26',NULL,NULL,NULL,NULL),(2,1,'HOSPITAL SAO CAMILO JARU','2802996','05896767000164',0,'freitas.miranda@gmail.com','2021-01-20 00:42:19',NULL,NULL,NULL,NULL),(3,2,'POSTO DE SAUDE JOSE AMABILE SANTA CRUZ','2803771',NULL,1,'freitas.miranda@gmail.com','2021-01-20 00:52:25',NULL,NULL,NULL,NULL),(4,3,'CLINICA DIAGNOSIS','3792595','5094146000167',0,'freitas.miranda@gmail.com','2021-01-20 00:46:43',NULL,NULL,NULL,NULL),(6,4,'LABORATORIO SAO CAMILO','5260671','08003182000166',0,'freitas.miranda@gmail.com','2021-01-20 00:54:08',NULL,NULL,NULL,NULL),(7,5,'FARMACIA MUNICIPAL DE JARU','5370078',NULL,1,'freitas.miranda@gmail.com','2021-01-20 00:59:40',NULL,NULL,NULL,NULL),(8,2,'CENTRO DE SAUDE ESPECIALIZADO DA MULHER','2806894',NULL,1,'freitas.miranda@gmail.com','2021-01-20 01:01:09',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `unidade_saude` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `senha` varchar(64) NOT NULL,
  `ativo` int(1) unsigned NOT NULL,
  `perfil_acesso_id` int(11) NOT NULL DEFAULT 4 COMMENT '1-Administrador; 2-Gestor; 3-Secretária; 4-Paciente;',
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(50) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(50) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'ALAN DE FREITAS MIRANDA','freitas.miranda@gmail.com','d3880a7a0b880149150ed3e59b51fb7e9300709560a27dd08e999b01f7d35a45',1,1,NULL,'2021-01-13 02:29:44',NULL,'2021-01-16 03:57:59',NULL,NULL),(2,'ADMINS','ADMIN@ARSS.LINK','123',1,1,NULL,'2021-01-15 02:16:31','SISTEMA_ARSS','2021-01-16 13:05:53',NULL,NULL),(3,'RAIANE DA SILVA BELE','RAIANEBELE.GMAIL.COM','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',1,2,NULL,'2021-01-16 03:53:58',NULL,NULL,NULL,NULL),(4,'ALAN','TESTE@TESTE.COM','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',1,4,NULL,'2021-01-16 13:06:29',NULL,'2021-01-16 13:06:40',NULL,NULL);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_solicitacao`
--

DROP TABLE IF EXISTS `usuario_solicitacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario_solicitacao` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `token` varchar(300) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `data_confirmacao` datetime DEFAULT NULL,
  `dados_confirmacao` longtext DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(50) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(50) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_solicitacao`
--

LOCK TABLES `usuario_solicitacao` WRITE;
/*!40000 ALTER TABLE `usuario_solicitacao` DISABLE KEYS */;
INSERT INTO `usuario_solicitacao` VALUES (1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmcmVpdGFzLm1pcmFuZGFAZ21haWwuY29tIiwiaWF0IjoxNjEwNTA0NzMzLCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayJ9.FJwrckt1Y1ZNgYzRhnC8nrZix1V86B8N9SrzkcN9yqg','Alan de Freitas Miranda','freitas.miranda@gmail.com','2021-01-12 22:29:43','{\"solicitacaoId\":1,\"email\":\"freitas.miranda@gmail.com\"}',1,NULL,'2021-01-13 02:25:35',NULL,'2021-01-13 02:29:44',NULL,NULL);
/*!40000 ALTER TABLE `usuario_solicitacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_token`
--

DROP TABLE IF EXISTS `usuario_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario_token` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `agente` varchar(300) NOT NULL,
  `ativo` int(1) NOT NULL DEFAULT 1,
  `data_cadastro` datetime NOT NULL,
  `data_vencimento` datetime DEFAULT NULL,
  `ip` varchar(15) NOT NULL,
  `token` varchar(300) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(50) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(50) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `usuario_token_usuario_idx` (`usuario_id`),
  KEY `usuario_tokens_token` (`token`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_token`
--

LOCK TABLES `usuario_token` WRITE;
/*!40000 ALTER TABLE `usuario_token` DISABLE KEYS */;
INSERT INTO `usuario_token` VALUES (1,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',0,'2021-01-12 22:29:46','2021-01-13 03:29:46','::1','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDUwNDk4NiwiZXhwIjoxNjEwNTIyOTg2LCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.Vd1BKjyXxkPOq8qJTUtej6NCThuWiwQ3vVc91pOjAtw',1,NULL,'2021-01-13 02:29:48',NULL,'2021-01-13 02:36:22',NULL,NULL),(2,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',0,'2021-01-12 22:36:24','2021-01-13 03:36:24','::1','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDUwNTM4NCwiZXhwIjoxNjEwNTIzMzg0LCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.GinF9NS7fqlcrjJu0-WrkGhvx0HkilKoiIIv4UxgAMY',1,NULL,'2021-01-13 02:36:26',NULL,'2021-01-13 02:47:51',NULL,NULL),(3,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',1,'2021-01-12 22:47:55','2021-01-13 03:47:55','::1','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDUwNjA3NSwiZXhwIjoxNjEwNTI0MDc1LCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.9FafWcqlmV7DfIab3epOeCOvDhib8PWlFLRORD0SbOk',1,NULL,'2021-01-13 02:47:56',NULL,NULL,NULL,NULL),(4,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',1,'2021-01-14 22:40:53','2021-01-15 03:40:53','::1','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDY3ODQ1MywiZXhwIjoxNjEwNjk2NDUzLCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.bgngZAyZUHNYziZmt29CKSxP7nLjOINbiEnByt6nD5E',1,NULL,'2021-01-15 02:40:55',NULL,NULL,NULL,NULL),(5,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',0,'2021-01-14 22:46:34','2021-01-15 03:46:34','::1','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDY3ODc5NCwiZXhwIjoxNjEwNjk2Nzk0LCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.Xv4GTyKvzNzvQBJsgNkhcirhetsIGiM2I6IURY_HWDA',1,NULL,'2021-01-15 02:46:35',NULL,'2021-01-15 02:50:13',NULL,NULL),(6,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',0,'2021-01-14 23:07:13','2021-01-15 04:07:13','::1','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDY4MDAzMywiZXhwIjoxNjEwNjk4MDMzLCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.kRsEw21c3GDgue6pJaMklxCGU-aicK4a8GM1r-yGjA8',1,NULL,'2021-01-15 03:07:15',NULL,'2021-01-15 03:09:22',NULL,NULL),(7,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',0,'2021-01-14 23:09:38','2021-01-15 04:09:38','::1','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDY4MDE3OCwiZXhwIjoxNjEwNjk4MTc4LCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.6eAuk4pK9IZDkbavtc6Pb5Y3P__lrVWEDdct2miU2u4',1,NULL,'2021-01-15 03:09:40',NULL,'2021-01-15 03:14:09',NULL,NULL),(8,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',1,'2021-01-14 23:14:20','2021-01-15 04:14:20','::1','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDY4MDQ2MCwiZXhwIjoxNjEwNjk4NDYwLCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.ENWPZsKbEw-8Ok1ocMRVvty9NOZVPu1wdq-W5yFGHxo',1,NULL,'2021-01-15 03:14:22',NULL,NULL,NULL,NULL),(9,'insomnia/2020.5.2',1,'2021-01-14 23:14:52','2021-01-15 04:14:52','::1','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDY4MDQ5MiwiZXhwIjoxNjEwNjk4NDkyLCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.lXDPPXj-meKX4_MnFLfFsOCBEZc8sGe2UlPd8YSu5UE',1,NULL,'2021-01-15 03:14:53',NULL,NULL,NULL,NULL),(10,'insomnia/2020.5.2',1,'2021-01-14 23:14:55','2021-01-15 04:14:55','::1','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDY4MDQ5NSwiZXhwIjoxNjEwNjk4NDk1LCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.dMlmQCKhqytqFcNpNjgEaNonoNnw1RYY3GMHEHQzkhA',1,NULL,'2021-01-15 03:14:57',NULL,NULL,NULL,NULL),(11,'insomnia/2020.5.2',1,'2021-01-14 23:14:56','2021-01-15 04:14:56','::1','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDY4MDQ5NiwiZXhwIjoxNjEwNjk4NDk2LCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.uweE-fuWCPFyWC-jtw5SrXgxJNMJFyeVJcrZC2Xpzb4',1,NULL,'2021-01-15 03:14:57',NULL,NULL,NULL,NULL),(12,'insomnia/2020.5.2',1,'2021-01-14 23:14:56','2021-01-15 04:14:56','::1','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDY4MDQ5NiwiZXhwIjoxNjEwNjk4NDk2LCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.uweE-fuWCPFyWC-jtw5SrXgxJNMJFyeVJcrZC2Xpzb4',1,NULL,'2021-01-15 03:14:58',NULL,NULL,NULL,NULL),(13,'insomnia/2020.5.2',1,'2021-01-14 23:14:57','2021-01-15 04:14:57','::1','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDY4MDQ5NywiZXhwIjoxNjEwNjk4NDk3LCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.pS6Ga-3lgpsSbdyA73EwmlJLAQm-hY_hYT0-_U5LrTo',1,NULL,'2021-01-15 03:14:58',NULL,NULL,NULL,NULL),(14,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',0,'2021-01-15 20:51:12','2021-01-16 01:51:12','::1','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDc1ODI3MiwiZXhwIjoxNjEwNzc2MjcyLCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.q_6K-9UJc7bg9c9H8_L5JUz-DSgjC9sLRGo214JA8uA',1,NULL,'2021-01-16 00:51:12',NULL,'2021-01-16 02:42:13',NULL,NULL),(15,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',0,'2021-01-15 22:42:19','2021-01-16 03:42:19','::1','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDc2NDkzOSwiZXhwIjoxNjEwNzgyOTM5LCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.gAniLwf46do4XOCl_SdeBNkEto_TTLcch_HYlFXaiQI',1,NULL,'2021-01-16 02:42:19',NULL,'2021-01-16 02:45:54',NULL,NULL),(16,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',0,'2021-01-15 22:48:23','2021-01-16 03:48:23','::1','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDc2NTMwMywiZXhwIjoxNjEwNzgzMzAzLCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.2Z6GbUqQi-fXTqhlxnYx-PuoIUgrvb5whWqn1je5v9k',1,NULL,'2021-01-16 02:48:23',NULL,'2021-01-16 02:53:10',NULL,NULL),(17,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',0,'2021-01-15 22:55:38','2021-01-16 03:55:38','::1','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDc2NTczOCwiZXhwIjoxNjEwNzgzNzM4LCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.2nOUKF9XBAXJqU4976yVacoIIHGG9RohKrQgl7Z7tZ4',1,NULL,'2021-01-16 02:55:38',NULL,'2021-01-16 02:56:46',NULL,NULL),(18,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',0,'2021-01-15 23:03:28','2021-01-16 04:03:28','::1','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDc2NjIwOCwiZXhwIjoxNjEwNzg0MjA4LCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.yBL5RXahMcL6sbJA65dpxXcq6qfbmNJOF6sTzWIFgo0',1,NULL,'2021-01-16 03:03:28',NULL,'2021-01-16 03:58:19',NULL,NULL),(19,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36 Edg/87.0.664.75',1,'2021-01-15 23:10:17','2021-01-16 04:10:17','::1','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDc2NjYxNywiZXhwIjoxNjEwNzg0NjE3LCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.rNy2_vcqFDG7KRxrXvRUJRnUTuV4FMpIhK3hp9a92nw',1,NULL,'2021-01-16 03:10:17',NULL,NULL,NULL,NULL),(20,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',1,'2021-01-15 23:58:25','2021-01-16 04:58:25','::1','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDc2OTUwNSwiZXhwIjoxNjEwNzg3NTA1LCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.CO0Clx574B90REtsxIWa_TPOjB7bgeoMgw3SncKcJok',1,NULL,'2021-01-16 03:58:25',NULL,NULL,NULL,NULL),(21,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',0,'2021-01-16 07:59:35','2021-01-16 12:59:35','::1','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDc5ODM3NSwiZXhwIjoxNjEwODE2Mzc1LCJhdWQiOiJhcGkuc2l0ZS5jb20iLCJpc3MiOiJhcGkuc2l0ZS5jb20iLCJ1c3VhcmlvSWQiOjF9.yRntPE0A9uHLN06FBHoqXZr1afqhMNto4bPUWJiD4tk',1,NULL,'2021-01-16 11:59:35',NULL,'2021-01-16 13:04:42',NULL,NULL),(22,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',1,'2021-01-16 09:05:42','2021-01-16 14:05:42','::1','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDgwMjM0MiwiZXhwIjoxNjEwODIwMzQyLCJhdWQiOiJhcGkuc2l0ZS5jb20iLCJpc3MiOiJhcGkuc2l0ZS5jb20iLCJ1c3VhcmlvSWQiOjF9.XyEAPEixc_IkAi5FDddM53jUmNgL2ZKrGZZC0Iwd9I0',1,NULL,'2021-01-16 13:05:42',NULL,NULL,NULL,NULL),(23,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',1,'2021-01-16 14:29:45','2021-01-16 19:29:45','::1','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDgyMTc4NSwiZXhwIjoxNjEwODM5Nzg1LCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.OLkwcPF8R4QVaKyNsmIUBn99hA3iJUTPfUTFORa6XOE',1,NULL,'2021-01-16 18:29:45',NULL,NULL,NULL,NULL),(24,'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Safari/605.1.15',1,'2021-01-16 15:14:37','2021-01-16 20:14:37','192.168.0.102','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDgyNDQ3NywiZXhwIjoxNjEwODQyNDc3LCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.ePd2RxauWMfLy_0cfQq7qPhQjFCIr_TMeBRWxwoPGTA',1,NULL,'2021-01-16 19:14:37',NULL,NULL,NULL,NULL),(25,'Mozilla/5.0 (iPad; CPU OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1',1,'2021-01-16 15:20:47','2021-01-16 20:20:47','192.168.0.102','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDgyNDg0NywiZXhwIjoxNjEwODQyODQ3LCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.fH3iN7gOSJrmwSi-DwTPPo2gs_w8th_b-J4t9cD-GlA',1,NULL,'2021-01-16 19:20:47',NULL,NULL,NULL,NULL),(26,'Mozilla/5.0 (iPad; CPU OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1',1,'2021-01-16 15:22:43','2021-01-16 20:22:43','192.168.0.102','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDgyNDk2MywiZXhwIjoxNjEwODQyOTYzLCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.542oYj7R_4TkNzXq3cDuna_7tCLnJBMfq2leSQUy9kE',1,NULL,'2021-01-16 19:22:43',NULL,NULL,NULL,NULL),(27,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',1,'2021-01-16 19:35:32','2021-01-17 00:35:32','192.168.0.108','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDg0MDEzMiwiZXhwIjoxNjEwODU4MTMyLCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.YbtjcBJEy1LfzChyw9WawoF47UQ7M5TDr1eeKOi49vw',1,NULL,'2021-01-16 23:35:32',NULL,NULL,NULL,NULL),(28,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',1,'2021-01-17 10:49:44','2021-01-17 15:49:44','192.168.0.108','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDg5NDk4NCwiZXhwIjoxNjEwOTEyOTg0LCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.B2APoiXrsZXfOgrMSohbztvLkrrdOE9362AGm_NlggU',1,NULL,'2021-01-17 14:49:44',NULL,NULL,NULL,NULL),(29,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',0,'2021-01-17 16:35:50','2021-01-17 21:35:50','192.168.0.108','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDkxNTc1MCwiZXhwIjoxNjEwOTMzNzUwLCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.dNrkcBzUCHoMTWnHImLQC1I6iCVoe9FqnTwvHa3zh4c',1,NULL,'2021-01-17 20:35:51',NULL,'2021-01-17 23:40:39',NULL,NULL),(30,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',0,'2021-01-17 19:40:41','2021-01-18 00:40:41','192.168.0.108','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDkyNjg0MSwiZXhwIjoxNjEwOTQ0ODQxLCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.uzQZEllKuLlxDM9Lp8TNv_rqezrqrBa5ploaqtRxToE',1,NULL,'2021-01-17 23:40:43',NULL,'2021-01-17 23:41:31',NULL,NULL),(31,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',1,'2021-01-17 19:41:32','2021-01-18 00:41:32','192.168.0.108','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDkyNjg5MiwiZXhwIjoxNjEwOTQ0ODkyLCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.EW3YYOyCE6PGf_Vi_omatBquhFAacKO0kAL-W9tme7k',1,NULL,'2021-01-17 23:41:34',NULL,NULL,NULL,NULL),(32,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',1,'2021-01-18 00:49:18','2021-01-18 05:49:18','192.168.0.108','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMDk0NTM1OCwiZXhwIjoxNjEwOTYzMzU4LCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.UY---RBUrJIBz0d3OhRP3RB7fq0R98Mn2pGj59VTt7Y',1,'freitas.miranda@gmail.com','2021-01-18 04:49:20',NULL,NULL,NULL,NULL),(33,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',1,'2021-01-18 21:00:35','2021-01-19 02:00:35','192.168.0.108','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxMTAxODAzNSwiZXhwIjoxNjExMDM2MDM1LCJhdWQiOiJhcGkuYXJzcy5saW5rIiwiaXNzIjoiYXBpLmFyc3MubGluayIsInVzdWFyaW9JZCI6MX0.ekMiFgXZjPvkMOuDZJLFciXcPX8HfeOFN_xYhM2IqEM',1,'freitas.miranda@gmail.com','2021-01-19 01:00:37',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `usuario_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'arss'
--

--
-- Dumping routines for database 'arss'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-01-19 23:24:45
