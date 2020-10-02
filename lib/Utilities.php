<?php
/**
 * Class Utilities : Nous allons mettre des fonctions qui nous seront utile à travers tous le site.
 */

class Utilities
{
    /**
     * @param $path_array ([String]) est un tableau de chaine de caractère représentant le chemin relatif vers le dossier depuis la racine du projet
     * @return string String représente un chemin absolu construit en fonction de la machine
     * Cette fonction permet de créer un chemin absolu.
     * Les séparateurs pour un chemin sont différents en fonction du SE, cela permet de ne pas tenir compte de ce problème.
     * Cela permet d'éviter les problèmes dû à des chemins relatifs et de ne pas avoir de problème lors de l'utilisation de require sur les fichiers notamment.
     */
    public static function build_path($path_array) {
        $ROOT_FOLDER = __DIR__ . DIRECTORY_SEPARATOR . "..";
        return $ROOT_FOLDER . DIRECTORY_SEPARATOR . join(DIRECTORY_SEPARATOR, $path_array);
    }
}