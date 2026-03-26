<?php

ini_set("display_errors", 1);
ini_set("display_startup_errors", 1);
error_reporting(E_ALL & ~E_DEPRECATED);

header("Cache-Control: no-cache, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Allow: GET, POST, OPTIONS");

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
  http_response_code(200);
  exit;
}

if (isset($_GET["PING"])) {
  exit;
}

date_default_timezone_set("America/Matamoros");

if (isset($_GET["DATETIME"])) {
  echo date("Y-m-d H:i:s");
  exit;
}

require "conexion.php";
// require "enviarCorreo.php"; // Activar si es necesario

$con = new Conexion(array(
  "tipo"       => "mysql",
  "servidor"   => "46.28.42.226",
  "bd"         => "u760464709_24005037_bd",
  "usuario"    => "u760464709_24005037_usr",
  "contrasena" => "N&2lbK=8;Mrt"
));

require_once '../firebase-php-jwt/vendor/autoload.php';

$JWT_SECRET = "4f9c8e2b1a6d7f903c51e8a4b6f1d2c7a9e5b3c8d1f4a7e2b6c9d0f3a5e8b1c2";
$headers = getallheaders();

$token = "";
if (isset($headers["Authorization"])) {
  $token = str_replace("Bearer ", "", $headers["Authorization"]);
}

try {
  $decoded = Firebase\JWT\JWT::decode($token, new Firebase\JWT\Key($JWT_SECRET, "HS256"));
  $usuarioSesion = explode("/", $decoded->sub);
  $login = true;
}
catch (Exception $error) {
  $usuarioSesion = array();
  $login = false;
}

if (!$login) {
    http_response_code(401);
    echo json_encode(["error" => "Sesión no válida o expirada"]);
    exit;
}

// 1. Obtener todos los cursos
if (isset($_GET["Cursos"]) || ($_SERVER['REQUEST_METHOD'] == 'GET' && empty($_GET))) {
    $select = $con->select("Cursos", "*"); 
    $lista = $select->execute();
    
    header("Content-Type: application/json");
    echo json_encode(["cursos" => $lista]);
    exit;
}

// 2. Obtener un curso específico para editar
elseif (isset($_GET["id_mod"])) {
    $id = $_GET["id_mod"];
    $select = $con->select("Cursos", "*");
    $select->where("idCursos", "=", $id);
    $resultado = $select->execute();

    header("Content-Type: application/json");
    echo json_encode(["editar" => $resultado[0] ?? null]);
    exit;
}

// 3. Insertar nuevo curso
elseif (isset($_POST["btnguardar"])) {
    $stmt = $con->prepare("INSERT INTO Cursos (NombreCursos) VALUES (?)");
    $stmt->bindParam(1, $_POST["txtnombre"]);
    echo $stmt->execute() ? "correcto" : "error";
    exit;
}

// 4. Modificar curso existente
elseif (isset($_POST["btnmodificar"])) {
    $update = $con->prepare("UPDATE Cursos SET NombreCursos = ? WHERE idCursos = ?");
    $update->bindParam(1, $_POST["txtnombre"]);
    $update->bindParam(2, $_POST["txtid"]);
    echo $update->execute() ? "correcto" : "error";
    exit;
}

// 5. Eliminar curso
elseif (isset($_GET["id_eliminar"])) {
    $delete = $con->prepare("DELETE FROM Cursos WHERE idCursos = ?");
    $delete->bindParam(1, $_GET["id_eliminar"]);
    echo $delete->execute() ? "correcto" : "error";
    exit;
}

?>