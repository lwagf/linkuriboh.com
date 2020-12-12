CREATE DATABASE `linkuriboh` /*!40100 DEFAULT CHARACTER SET utf8 */;

CREATE TABLE `duel` (
  `id` int(11) NOT NULL,
  `CombinedRating` int(11) DEFAULT NULL,
  `Player1` varchar(255) DEFAULT NULL,
  `Player1Visible` mediumtext,
  `Player2` varchar(255) DEFAULT NULL,
  `Player2Visible` mediumtext,
  `Format` varchar(255) DEFAULT NULL,
  `Time` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Time` (`Time`),
  KEY `Time,Format,Visible` (`Time`,`Format`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `counter` (
  `counter` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`counter`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
