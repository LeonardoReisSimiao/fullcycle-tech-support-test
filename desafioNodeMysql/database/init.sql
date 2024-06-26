CREATE DATABASE IF NOT EXISTS `database`;

use `database`;

CREATE TABLE IF NOT EXISTS `people`(`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, PRIMARY KEY(`id`));