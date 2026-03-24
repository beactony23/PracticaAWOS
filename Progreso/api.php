<?php
// api.php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'conexion.php'; 
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$accion = $_GET['accion'] ?? 'listar';

require_once '../firebase-php-jwt/vendor/autoload.php';


$JWT_SECRET = "4f9c8e2b1a6d7f903c51e8a4b6f1d2c7a9e5b3c8d1f4a7e2b6c9d0f3a5e8b1c2";

$headers = getallheaders();

$token = "";
if (isset($headers["Authorization"])) {
  $token = str_replace("Bearer ", "", $headers["Authorization"]);
}

try {
  # el segundo parametro es la clave para codificar y decodificar el JWT
  # debe ser una string no corta, por eso rellené de guiones
  $decoded = Firebase\JWT\JWT::decode($token, new Firebase\JWT\Key($JWT_SECRET, "HS256"));

  # $usuario puede ser usada para validaciones
  $usuarioSesion = explode("/", $decoded->sub);
  $id      = $usuarioSesion[0];
  $usuario = $usuarioSesion[1];
  $tipo    = $usuarioSesion[2];

  # $login puede ser usada para validaciones
  $login = true;
}
catch (Exception $error) {
  $usuarioSesion = array();
  $login   = false;
}

// ==========================================
// ENDPOINTS DE LECTURA (GET)
// ==========================================
if ($method === 'GET') {

    if ($accion === 'listar'  && $login) {
        $sql = "
            SELECT p.idUsuario, u.Nom_Usuario AS nombreUsuario, p.idPregunta, pr.Pregunta AS textoPregunta,
                   p.Completado, p.Intentos, p.Tiempo_Segundos, p.Fecha
            FROM Progreso p
            LEFT JOIN Usuarios u ON u.idUsuario = p.idUsuario
            LEFT JOIN Preguntas pr ON pr.idPregunta = p.idPregunta
            ORDER BY p.Fecha DESC
        ";
        $stmt = $pdo->query($sql);
        echo json_encode($stmt->fetchAll());
        exit;
    }

    if ($accion === 'obtenerUno') {
        $idU = $_GET['idUsuario'] ?? 0;
        $idP = $_GET['idPregunta'] ?? 0;

        $stmt = $pdo->prepare("SELECT * FROM Progreso WHERE idUsuario = ? AND idPregunta = ?");
        $stmt->execute([$idU, $idP]);
        echo json_encode($stmt->fetchAll());
        exit;
    }
}

// ==========================================
// ENDPOINTS DE ESCRITURA (POST)
// ==========================================
if ($method === 'POST') {

    if ($accion === 'guardar' && $login) {
        $idU = $_POST['idUsuario'];
        $idP = $_POST['idPregunta'];
        $comp = $_POST['Completado'];
        $time = $_POST['Tiempo_Segundos'] ?? 0;

        try {
            $stmt = $pdo->prepare("CALL sp_RegistrarResultado(?, ?, ?, ?)");
            $stmt->execute([$idU, $idP, $comp, $time]);
            echo json_encode(["status" => "correcto"]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        exit;
    }

    if ($accion === 'modificar' && $login) {
        $idU = $_POST['idUsuario'];
        $idP = $_POST['idPregunta'];
        $comp = $_POST['Completado'];
        $intentos = $_POST['Intentos'] ?? 0;
        $time = $_POST['Tiempo_Segundos'] ?? 0;
        $fecha = !empty($_POST['Fecha']) ? $_POST['Fecha'] : date('Y-m-d');

        try {
            $stmt = $pdo->prepare("UPDATE Progreso SET Completado = ?, Intentos = ?, Tiempo_Segundos = ?, Fecha = ? WHERE idUsuario = ? AND idPregunta = ?");
            $stmt->execute([$comp, $intentos, $time, $fecha, $idU, $idP]);
            echo json_encode(["status" => "correcto"]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        exit;
    }

    if ($accion === 'eliminar' && $login) {

        $idU = $_POST['idUsuario'];
        $idP = $_POST['idPregunta'];

        try {
            $stmt = $pdo->prepare("DELETE FROM Progreso WHERE idUsuario = ? AND idPregunta = ?");
            $stmt->execute([$idU, $idP]);
            echo json_encode(["status" => "correcto"]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        exit;
    }
}

echo json_encode(["status" => "error", "message" => "Endpoint no encontrado"]);
?>