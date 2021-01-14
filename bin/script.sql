-- --------------------------------------------------------

-- creer et utiliser la base de donnée projet_piscine (en tout cas pour moi)

DROP DATABASE `projet_piscine`;
CREATE DATABASE `projet_piscine`;
USE `projet_piscine`;
--
-- Structure de la table `composer`
--

DROP TABLE IF EXISTS `composer`;
CREATE TABLE IF NOT EXISTS `composer` (
  `idGroupe` int(11) NOT NULL,
  `numeroEtudiant` int(11) NOT NULL,
  PRIMARY KEY (`idGroupe`,`numeroEtudiant`),
  KEY `fk_numeroEtudiant_etudiants` (`numeroEtudiant`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `creneaux`
--

DROP TABLE IF EXISTS `creneaux`;
CREATE TABLE IF NOT EXISTS `creneaux` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `heureDebut` time NOT NULL,
  `salle` varchar(15) DEFAULT "PAS DE SALLE",
  `idEvenement` int(11) NOT NULL,
  `idGroupeProjet` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idEvenement` (`id`),
  KEY `idGroupeProjet` (`idGroupeProjet`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `etudiants`
--

DROP TABLE IF EXISTS `etudiants`;
CREATE TABLE IF NOT EXISTS `etudiants` (
  `numero` int(11) NOT NULL,
  `nom` varchar(20) NOT NULL,
  `prenom` varchar(20) NOT NULL,
  `mail` varchar(40) NOT NULL,
  `motDePasse` varchar(64) NOT NULL,
  `anneePromo` varchar(15) NOT NULL,
  PRIMARY KEY (`numero`),
  KEY `anneePromo` (`anneePromo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `evenements`
--

DROP TABLE IF EXISTS `evenements`;
CREATE TABLE IF NOT EXISTS `evenements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(32) NOT NULL,
  `dateDebut` date NOT NULL,
  `Duree` int(11) NOT NULL,
  `dateLimiteResa` date NOT NULL,
  `dureeCreneau` time NOT NULL,
  `nombreMembresJury` int(11) NOT NULL,
  `anneePromo` varchar(15) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`),
  KEY `anneePromo` (`anneePromo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `groupeprojet`
--

DROP TABLE IF EXISTS `groupeprojet`;
CREATE TABLE IF NOT EXISTS `groupeprojet` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nomTuteurEntreprise` varchar(32) DEFAULT NULL,
  `prenomTuteurEntreprise` varchar(32) DEFAULT NULL,
  `nomEntreprise` varchar(32) DEFAULT NULL,
  `idProfesseur` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idProfesseur` (`idProfesseur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `participe`
--

DROP TABLE IF EXISTS `participe`;
CREATE TABLE IF NOT EXISTS `participe` (
  `idProfesseur` int(11) NOT NULL,
  `idCreneaux` int(11) NOT NULL,
  PRIMARY KEY (`idProfesseur`,`idCreneaux`),
  KEY `fk_idCreneau_creneaux` (`idCreneaux`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `professeurs`
--

DROP TABLE IF EXISTS `professeurs`;
CREATE TABLE IF NOT EXISTS `professeurs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(32) NOT NULL,
  `prenom` varchar(32) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `promotion`
--

DROP TABLE IF EXISTS `promotion`;
CREATE TABLE IF NOT EXISTS `promotion` (
  `annee` varchar(15) NOT NULL,
  PRIMARY KEY (`annee`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `composer`
--
ALTER TABLE `composer`
  ADD CONSTRAINT `fk_idGroupe_GroupeProjet` FOREIGN KEY (`idGroupe`) REFERENCES `groupeprojet` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_numeroEtudiant_etudiants` FOREIGN KEY (`numeroEtudiant`) REFERENCES `etudiants` (`numero`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `creneaux`
--
ALTER TABLE `creneaux`
  ADD CONSTRAINT `fk_idEvenement_evenements` FOREIGN KEY (`idEvenement`) REFERENCES `evenements` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_idGroupeProjet_groupeprojet` FOREIGN KEY (`idGroupeProjet`) REFERENCES `groupeprojet` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `etudiants`
--
ALTER TABLE `etudiants`
  ADD CONSTRAINT `fk_anneePromo_promotion_etudiant` FOREIGN KEY (`anneePromo`) REFERENCES `promotion` (`annee`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Contraintes pour la table `evenements`
--
ALTER TABLE `evenements`
  ADD CONSTRAINT `fk_anneePromo_promotion` FOREIGN KEY (`anneePromo`) REFERENCES `promotion` (`annee`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `groupeprojet`
--
ALTER TABLE `groupeprojet`
  ADD CONSTRAINT `fk_idProfesseur_professeur` FOREIGN KEY (`idProfesseur`) REFERENCES `professeurs` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `participe`
--
ALTER TABLE `participe`
  ADD CONSTRAINT `fk_idCreneau_creneaux` FOREIGN KEY (`idCreneaux`) REFERENCES `creneaux` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_idProf_Profeseurs` FOREIGN KEY (`idProfesseur`) REFERENCES `professeurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

-- creer les promos dans la DB
INSERT INTO promotion VALUES ("IG3"),("IG4"),("IG5"),("Admin");
-- insertion des professeur dans la DB
INSERT INTO professeurs(nom,prenom) values ("Berry","Vincent"),("Bourdon","Isabelle"),("Buisson-Lopez","Lysiane"),("Castelltort","Arnaud"),("Chapellier","Philippe"),("Fiorio","Christophe"),("Guerrini","Eléonora"),("Laurent","Anne"),("Pacitti","Esther"),("Stratulat","Tibériu"),("Tibermacine","Chouki"),("Toulemonde","Gwladys"),("Villaret","Anne-Laure");
-- création d'un evènment
INSERT INTO `evenements` VALUES (1,"test","2020-11-30",15,"2020-11-30","01:00:00",3,"IG3");
-- création de quelque créneaux
INSERT INTO creneaux(date,heureDebut,salle,idEvenement) values ("2020-12-1","14:00:00","TD005",1);
INSERT INTO creneaux(date,heureDebut,salle,idEvenement) values ("2020-12-2","15:00:00","TD005",1);
INSERT INTO creneaux(date,heureDebut,salle,idEvenement) values ("2020-12-3","16:00:00","TD005",1);
-- création du compte admin avec mot de passe correspondant à 96706546secure hasher
INSERT INTO `etudiants`(numero,nom,prenom,mail,motDePasse,anneePromo) values(-1,"admin","admin","mail@admin.fr","sha1$22f7aa80$1$26fdca0f74e49886ed59e04bb95ba975639f2fbc","Admin");