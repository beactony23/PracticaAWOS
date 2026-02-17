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
  "servidor"   => "82.180.168.1",
  "bd"         => "u760464709_24005037_bd",
  "usuario"    => "u760464709_24005037_usr",
  "contrasena" => "N&2lbK=8;Mrt"
));




if (isset($_GET["Preguntas"])) {
  $select = $con->select("Preguntas", "Preguntas.idPregunta as ID , Preguntas.Pregunta  , Preguntas.Valor , Cursos.NombreCursos as 'Nombre del curso' , Preguntas.HoraRegistro ");
  $select->innerjoin("Cursos on Cursos.idCursos = Preguntas.idCursos");
  $select->orderby("idPregunta DESC");
  $select->limit(10);

  header("Content-Type: application/json");
  echo json_encode($select->execute());
}
elseif (isset($_GET["editarPregunta"])) {
  $id = $_GET["txtId"];

  $select = $con->select("Preguntas", "*");
  $select->where("idPregunta", "=", $id);

  header("Content-Type: application/json");
  echo json_encode($select->execute());
}


elseif (isset($_GET["ObtenerCursos"])) {
  $select = $con->select("Cursos", "idCursos AS ID , NombreCursos AS Nombre");
  $select->orderby("NombreCursos ASC");
  $select->limit(10);


  header("Content-Type: application/json");
  echo json_encode($select->execute());   
}



elseif (isset($_GET["eliminarPregunta"])) {
  $delete = $con->delete("Preguntas");
  $delete->where("idPregunta", "=", $_POST["txtId"]);

  if ($delete->execute()) {
    echo "correcto";
  }
  else {
    echo "error";
  }
}
elseif (isset($_GET["insertarPregunta"])) {
  $insert = $con->insert("Preguntas", "Pregunta, idCursos, Valor, HoraRegistro");

  $insert->value($_POST["txtPregunta"]);
  $insert->value($_POST["cboCurso"]);
  $insert->value($_POST["txtValor"]);
  $insert->values .= ", NOW()";  

  $insert->execute();

  $id = $con->lastInsertId();

  if (is_numeric($id)) {
    echo $id;
  }
  else {
    echo "0";
  }
}
elseif (isset($_GET["modificarPregunta"])) {
  $update = $con->update("Preguntas");
  $update->set("idCursos", $_POST["cboCurso"]);
  $update->set("Valor", $_POST["txtValor"]);
  $update->set("Pregunta", $_POST["txtPregunta"]);
  $update->where("idPregunta", "=", $_POST["txtId"]);

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

  $consulta = $con->select("Preguntas","concat( Cursos.NombreCursos , ' : ' , sum(Preguntas.Valor) ) as curso_suma");
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
elseif (isset($_GET["VerificarCoordenadas"])){

  $latitud = $_POST["latitud"];
  $longitud = $_POST["longitud"];

  $solucion_lat = $_POST["latitud-solucion"];
  $solucion_long = $_POST["longitud-solucion"];

  if ( ($latitud == $solucion_lat)  &&  ($longitud == $solucion_long) ){
    echo "correcto";
  }

}


?>
