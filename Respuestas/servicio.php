<?php
$cn = new mysqli(
"46.28.42.226", //servidor
"u760464709_24005037_usr", //usuario
"N&2lbK=8;Mrt", //contraseña
"u760464709_24005037_bd" //base de datos
);

$cn->set_charset("utf8mb4");

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

if (isset($_GET["respuestas"])) {
    $sql = "SELECT * FROM View_Respuestas";
    $res = $cn->query($sql);

    $datos = [];
    while ($row = $res->fetch_assoc()) {
        $datos[] = $row;
    }

    echo json_encode($datos);
}

if (isset($_GET["PreguntasSinrespuestas"])) {

    $sql = "SELECT * FROM `view_RespuestasSinPreguntas`";

    $res = $cn->query($sql);

    $datos = [];
    while ($row = $res->fetch_assoc()) {
        $datos[] = $row;
    }

    echo json_encode($datos);
    exit;
}

if (isset($_GET["preguntasSinRespuestaSub"])) {

    $sql = "
        SELECT idPregunta, Pregunta
        FROM Preguntas
        WHERE idPregunta NOT IN (
            SELECT idPregunta FROM Respuesta
        )
    ";

    $res = $cn->query($sql);
    $datos = [];

    while ($row = $res->fetch_assoc()) {
        $datos[] = $row;
    }

    echo json_encode($datos);
    exit;
}


if (isset($_GET["preguntasCombo"])) {
    $sql = "SELECT idPregunta AS value, Pregunta AS label FROM Preguntas";
    $res = $cn->query($sql);

    $datos = [];
    while ($row = $res->fetch_assoc()) {
        $datos[] = $row;
    }

    echo json_encode($datos);
}

if (isset($_GET["agregarRespuesta"])) {
    $respuesta = $_POST["txtRespuesta"];
    $idPregunta = $_POST["cboPregunta"];

    #$sql = "INSERT INTO Respuesta (Respuesta, idPregunta, fechaRegistro)
        #VALUES ('$respuesta', '$idPregunta', NOW())";

    #echo $cn->query($sql) ? $cn->insert_id : 0;
    #echo "correcto";
    
    $prepare = $pdo->prepare("CALL agregarRespuesta(:respuesta, :idPregunta, :pFechaRegistro)");
    $prepare->bindParam(":respuesta", $_POST["txtRespuesta"]);
    $prepare->bindParam(":idPregunta", $_POST["cboPregunta"]);
    $prepare->bindParam(":pFechaRegistro", date("Y-m-d H:i:s"));
    $prepare->execute();
    

    header("Content-Type: application/json");
    echo json_encode(["status" => "correcto"]);

}

if (isset($_GET["editarRespuesta"])) {
    $id = $_GET["id"];

    $sql = "SELECT * FROM Respuesta WHERE idRespuesta = $id";
    $res = $cn->query($sql);

    echo json_encode($res->fetch_all(MYSQLI_ASSOC));
}

if (isset($_GET["modificarRespuesta"])) {
    $id = $_POST["txtId"];
    $respuesta = $_POST["txtRespuesta"];

    #$sql = "UPDATE Respuesta
            #SET Respuesta='$respuesta', idPregunta='$idPregunta'
            #WHERE idRespuesta=$id";

    #echo $cn->query($sql) ? "correcto" : "error";

    $prepare = $pdo->prepare("CALL modificarRespuesta(:idRespuesta, :respuesta)");
    $prepare->bindParam(":idRespuesta", $_POST["txtId"]);
    $prepare->bindParam(":respuesta", $_POST["txtRespuesta"]);
    $prepare->execute();
    

    header("Content-Type: application/json");
    echo json_encode(["status" => "correcto"]);
}

if (isset($_GET["eliminarRespuesta"])) {
    $id = $_POST["txtId"];

    $prepare = $pdo->prepare("CALL eliminarRespuesta(:idRespuesta)");
    $prepare->bindParam(":idRespuesta", $_POST["txtId"]);
    $prepare->execute();
    

    header("Content-Type: application/json");
    echo json_encode(["status" => "correcto"]);
}

if (isset($_GET["longitudRespuesta"])) {
    $id = $_GET["id"];

    $sql = "SELECT LENGTH(Respuesta) AS longitud FROM Respuesta WHERE idRespuesta = $id";
    $res = $cn->query($sql);
    echo json_encode($res->fetch_assoc());
    exit;
}


if (isset($_GET["respuestasHoy"])) {
    $sql = "SELECT COUNT(*) AS total FROM Respuesta WHERE DATE(fechaRegistro) = CURDATE()";
    $res = $cn->query($sql);
    echo json_encode($res->fetch_assoc());
    exit;
}

if (isset($_GET["totalRespuestas"])) {

    $sql = "SELECT COUNT(*) AS totalRespuestas FROM Respuesta";
    $res = $cn->query($sql);
    echo json_encode($res->fetch_assoc());
    exit;
}
