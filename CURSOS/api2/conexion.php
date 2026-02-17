<?php
$host = "82.180.168.1"; 
$user = "u760464709_24005037_usr";       // XAMPP siempre usa 'root' por defecto
$pass = "N&2lbK=8;Mrt";           // XAMPP viene sin contraseña por defecto
$db   = "u760464709_24005037_bd"; // Asegúrate de haber creado este nombre en tu Adminer local

$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    die("Error de conexión: " . mysqli_connect_error());
}
?>