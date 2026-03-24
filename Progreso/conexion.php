<?php
$host = "46.28.42.226"; 
$user = "u760464709_24005037_usr";       
$pass = "N&2lbK=8;Mrt";           
$db   = "u760464709_24005037_bd"; 

try {
    // 1. Crear la conexión PDO (Cambiamos mysqli por PDO)
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    
    // 2. Configurar el manejo de errores para que salten excepciones legibles
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // 3. Configurar para que las respuestas sean siempre arrays asociativos por defecto
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    // Si hay un error de conexión, frenamos el código y mostramos el error
    header('Content-Type: application/json');
    die(json_encode([
        "status" => "error", 
        "message" => "Fallo de conexión a la BD: " . $e->getMessage()
    ]));
}
?>