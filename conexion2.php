<?php
$host = "46.28.42.226";
$db   = "u760464709_24005037_bd";
$user = "u760464709_24005037_usr";
$pass = "N&2lbK=8;Mrt";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$db;charset=utf8",
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    die("Error de conexión a la base de datos");
}
