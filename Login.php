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
// ------------------------------------------------------
// ------------------------------------------------------
require_once "conexion.php";
require "firebase-php-jwt/vendor/autoload.php";

$JWT_SECRET = "4f9c8e2b1a6d7f903c51e8a4b6f1d2c7a9e5b3c8d1f4a7e2b6c9d0f3a5e8b1c2";

$error = "";

$con = new Conexion(array(
  "tipo"       => "mysql",
  "servidor"   => "46.28.42.226",
  "bd"         => "u760464709_24005037_bd",
  "usuario"    => "u760464709_24005037_usr",
  "contrasena" => "N&2lbK=8;Mrt"
));


$headers = getallheaders();

$token = "";
if (isset($headers["Authorization"])) {
  $token = str_replace("Bearer ", "", $headers["Authorization"]);
}

try {
  $decoded = Firebase\JWT\JWT::decode($token, new Firebase\JWT\Key($JWT_SECRET, "HS256"));

  $usuarioSesion  = explode("/", $decoded->sub);
  $id      = $usuarioSesion[0];
  $usuario = $usuarioSesion[1];
  $tipo    = $usuarioSesion[2];

  $login = true;
}
catch (Exception $error) {
  $usuario = array();
  $login   = false;
}

# endpoint para revisar estado de la sesión
if (isset($_GET["sesion"])) {
  header("Content-Type: application/json");
  echo json_encode($usuario);
}
# endpoint para iniciar sesión
elseif (isset($_GET["iniciarSesion"])) {
  $email = trim($_POST["email"]);
  $pass  = $_POST["pass"];

  try {
    $sql  = "SELECT * FROM Usuarios WHERE CorreoElectronico = ?";
    $stmt = $con->prepare($sql);
    $stmt->bindParam(1, $email);
    $stmt->execute();

    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario && password_verify($pass, $usuario["Contrasena"])) {

      $payload = [
        "iat" => time(),
        "exp" => time() + (60 * 60 * 24 * 7),
        "sub" => $usuario["idUsuario"] . "/" . $usuario["Nom_Usuario"] . "/" . $usuario["id_rol"]
      ];

      $jwt = Firebase\JWT\JWT::encode($payload, $JWT_SECRET, "HS256");
      
      echo $jwt;
      exit;

    // ... dentro de iniciarSesion ...
  } else {
    header('Content-Type: application/json');
    echo json_encode(["error" => "Correo o contraseña incorrectos"]);
    exit;
  }
  } catch (PDOException $e) {
   $error = "Error del sistema. Intenta más tarde.";
    exit;
  }
}
?>
