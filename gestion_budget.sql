-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 13 nov. 2025 à 10:57
-- Version du serveur : 9.1.0
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gestion_budget`
--

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `type` enum('revenu','depense') COLLATE utf8mb4_general_ci NOT NULL,
  `id_user` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_user` (`id_user`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `nom`, `type`, `id_user`) VALUES
(1, 'Revenus', 'revenu', 1),
(2, 'Dépenses', 'depense', 1);

-- --------------------------------------------------------

--
-- Structure de la table `sous_categories`
--

DROP TABLE IF EXISTS `sous_categories`;
CREATE TABLE IF NOT EXISTS `sous_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `id_categorie` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_categorie` (`id_categorie`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `sous_categories`
--

INSERT INTO `sous_categories` (`id`, `nom`, `id_categorie`) VALUES
(1, 'Salaire', 1),
(2, 'Alimentation', 2),
(3, 'Logement', 2);

-- --------------------------------------------------------

--
-- Structure de la table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_categorie` int NOT NULL,
  `id_sous_categorie` int DEFAULT NULL,
  `titre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `montant` decimal(10,2) NOT NULL,
  `date_transaction` date NOT NULL,
  `lieu` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_user` (`id_user`),
  KEY `id_categorie` (`id_categorie`),
  KEY `id_sous_categorie` (`id_sous_categorie`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `transactions`
--

INSERT INTO `transactions` (`id`, `id_user`, `id_categorie`, `id_sous_categorie`, `titre`, `description`, `montant`, `date_transaction`, `lieu`, `date_creation`) VALUES
(1, 1, 1, 1, 'Salaire Novembre', 'Salaire mensuel', 2500.00, '2025-11-01', 'Entreprise X', '2025-11-04 09:37:58'),
(2, 1, 2, 2, 'Courses Carrefour', 'Courses de la semaine', 85.50, '2025-11-03', 'Carrefour', '2025-11-04 09:37:58'),
(3, 1, 2, 3, 'Loyer', 'Loyer mensuel', 750.00, '2025-11-01', 'Agence Immo', '2025-11-04 09:37:58');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `mot_de_passe` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `nom`, `email`, `mot_de_passe`, `date_creation`) VALUES
(1, 'Alice Dupont', 'alice@example.com', 'motdepassehashé', '2025-11-04 09:37:57'),
(2, 'toto', 'toto@toto.fr', '3ee809619efea26840bd52f8414c6fd2:dea1d1982a1b35d00865428a23e6761638a73bbdc90ebfd7e068bc9052a6f4182f59702eed9b87dfc7e90da0c9f86c8730a408066d3e81eddc49d8cc55dbdf4d', '2025-11-13 10:46:35');

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `vue_solde`
-- (Voir ci-dessous la vue réelle)
--
DROP VIEW IF EXISTS `vue_solde`;
CREATE TABLE IF NOT EXISTS `vue_solde` (
`user_id` int
,`solde` decimal(32,2)
);

-- --------------------------------------------------------

--
-- Structure de la vue `vue_solde`
--
DROP TABLE IF EXISTS `vue_solde`;

DROP VIEW IF EXISTS `vue_solde`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vue_solde`  AS SELECT `u`.`id` AS `user_id`, sum((case when (`c`.`type` = 'revenu') then `t`.`montant` when (`c`.`type` = 'depense') then -(`t`.`montant`) end)) AS `solde` FROM ((`transactions` `t` join `categories` `c` on((`t`.`id_categorie` = `c`.`id`))) join `users` `u` on((`t`.`id_user` = `u`.`id`))) GROUP BY `u`.`id` ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
