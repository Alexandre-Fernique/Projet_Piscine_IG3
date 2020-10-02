<?php
/**
 * Ce fichier est utilisé pour noter les informations de connexion du site web à la base de données
 * Note : Il faudra l'ajouter dans le .gitignore ou penser à ne pas pousser le sien sur GitHub pour ne pas gêner les autres membres du groupe.
 */

class Conf_MySQL {

    static private $databases_MySql = array(
        'hostname' => 'localhost',
        'database' => 'DB',
        'login' => 'root',
        'password' => ''
    );

    static private $debug = true;

    static public function getDebug() {
        return self::$debug;
    }

    static public function getLogin() {
        return self::$databases_MySql['login'];
    }
    static public function getHostname() {
        return self::$databases_MySql['hostname'];
    }
    static public function getDatabase() {
        return self::$databases_MySql['database'];
    }
    static public function getPassword() {
        return self::$databases_MySql['password'];
    }

}