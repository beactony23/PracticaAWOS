<?php
$host = "82.180.168.1"; 
$user = "u760464709_24005037_usr";       
$pass = "N&2lbK=8;Mrt";           
$db   = "u760464709_24005037_bd"; 

$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    die("Error de conexión: " . mysqli_connect_error());
}
?>