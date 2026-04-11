<?php
// Anti-Cache
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");
header("Content-Type: application/json; charset=utf-8");

require_once "conexion.php";
session_start();

$response = ["ok" => false, "error" => ""];

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    $response["error"] = "Método no permitido";
    echo json_encode($response);
    exit;
}

$nombre = trim($_POST["user"]  ?? "");
$email  = trim($_POST["email"] ?? "");
$pass   =      $_POST["pass"]  ?? "";
$pass2  =      $_POST["pass2"] ?? "";

if (empty($nombre) || empty($email) || empty($pass) || empty($pass2)) {
    $response["error"] = "Completa todos los campos";
    echo json_encode($response);
    exit;
}

if ($pass !== $pass2) {
    $response["error"] = "Las contraseñas no coinciden";
    echo json_encode($response);
    exit;
}

try {
    $con = new Conexion([
        "tipo"       => "mysql",
        "servidor"   => "46.28.42.226",
        "bd"         => "u760464709_24005037_bd",
        "usuario"    => "u760464709_24005037_usr",
        "contrasena" => "N&2lbK=8;Mrt"
    ]);

    $passHash = password_hash($pass, PASSWORD_DEFAULT);
    $sql  = "CALL sp_AltaNuevoUsuario(?, ?, ?)";
    $stmt = $con->prepare($sql);
    $stmt->bindParam(1, $nombre);
    $stmt->bindParam(2, $passHash);
    $stmt->bindParam(3, $email);
    $stmt->execute();

    $response["ok"] = true;
    echo json_encode($response);

} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        $response["error"] = "Este correo ya está registrado";
    } else {
        $response["error"] = "Error técnico al registrar";
    }
    echo json_encode($response);
}
?>
