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
require "enviarCorreo.php";

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

if (isset($_GET["Preguntas"]) && $login && $usuarioSesion[2] === "1") {
  $select = $con->select("MostrarPreguntas", "*");

  header("Content-Type: application/json");
  echo json_encode($select->execute());
}


elseif (isset($_GET["editarPregunta"]) && $login && $usuarioSesion[2] === "1") {
  $id = $_GET["txtId"];

  $select = $con->select("Preguntas", "*");
  $select->where("idPregunta", "=", $id);

  header("Content-Type: application/json");
  echo json_encode($select->execute());
}


elseif (isset($_GET["ObtenerCursos"] )  && $login && $usuarioSesion[2] === "1") {
  $select = $con->select("MostrarCursos", "*");

  header("Content-Type: application/json");
  echo json_encode($select->execute());
}

elseif (isset($_GET["eliminarPregunta"]) && $login && $usuarioSesion[2] === "1") {
  $delete = $con->prepare("call EliminarPregunta(?)");
  $delete->bindParam(1,$_POST["txtId"]);

  if ($delete->execute()) {
    echo "correcto";
  }
  else {
    echo "error";
  }
}
elseif (isset($_GET["insertarPregunta"]) && $login && $usuarioSesion[2] === "1") {
  $stmt = $con->prepare("CALL CrearPregunta(?, ?, ?)");
  $stmt->bindParam(1,$_POST["txtPregunta"] );
  $stmt->bindParam(2, $_POST["cboCurso"]);
  $stmt->bindParam(3, $_POST["txtValor"]);


  $stmt->execute();

}
elseif (isset($_GET["modificarPregunta"]) && $login && $usuarioSesion[2] === "1") {
  $update = $con->prepare("call ModificarPregunta(?,?,?,?)");
  $update->bindParam(1,$_POST["cboCurso"]);
  $update->bindParam(2, $_POST["txtValor"]);
  $update->bindParam(3,$_POST["txtPregunta"]);
  $update->bindParam(4,$_POST["txtId"]);


  if ($update->execute()) {
    echo "correcto";
  }
  else {
    echo "error";
  }
}
elseif (isset($_GET["PreguntasSinCurso"])){



  $consulta = $con->select("Preguntas","Cursos.NombreCursos");
  $consulta->rightjoin("Cursos on Cursos.idCursos = Preguntas.idCursos");
  $consulta->where("IFNULL(Preguntas.Pregunta,'es nulo')", "=" , "es nulo");

  header("Content-Type: application/json");
  
  echo json_encode($consulta->execute());

}
elseif (isset($_GET["ValorPorCurso"])){

  $consulta = $con->select("Preguntas","concat( Cursos.NombreCursos , ' : ' , 
  sum(Preguntas.Valor) ) as curso_suma");
  $consulta->innerjoin("Cursos on Cursos.idCursos = Preguntas.idCursos");
  $consulta->groupby("Cursos.NombreCursos");


  header("Content-Type: application/json");

  echo json_encode($consulta->execute());

}
elseif (isset($_GET["PreguntasMayorPromedio"])){

    $sql = "SELECT *
            FROM Preguntas 
            WHERE Valor > (SELECT AVG(Valor) FROM Preguntas)";
    
    $resultado = $con->query($sql);
    $data = $resultado->fetchAll(PDO::FETCH_ASSOC);

    header("Content-Type: application/json");
    echo json_encode($data);

}
elseif (isset($_GET["PreguntasHoy"])){

    $sql = "SELECT * FROM Preguntas 
    WHERE DATE_FORMAT(HoraRegistro,'%Y-%m-%d') = DATE_FORMAT(NOW(),'%Y-%m-%d');
    ";
    
    $resultado = $con->query($sql);
    $data = $resultado->fetchAll(PDO::FETCH_ASSOC);

    header("Content-Type: application/json");
    echo json_encode($data);

}
elseif (isset($_GET["VerificarCoordenadas"]) && $login){

  $latitud = $_POST["latitud"];
  $longitud = $_POST["longitud"];

  $solucion_lat = $_POST["latitud-solucion"];
  $solucion_long = $_POST["longitud-solucion"];

  if ( ($latitud == $solucion_lat)  &&  ($longitud == $solucion_long) ){
    echo "correcto";
  }

}


?>
