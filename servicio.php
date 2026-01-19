<?php
$cn = new mysqli(
"82.180.168.1", //servidor
"u760464709_24005037_usr", //usuario
"N&2lbK=8;Mrt", //contraseña
"u760464709_24005037_bd" //base de datos
);

$cn->set_charset("utf8mb4");

if (isset($_GET["respuestas"])) {
    $sql = "SELECT r.idRespuesta, r.Respuesta, p.Pregunta
            FROM Respuesta r
            INNER JOIN Preguntas p ON r.idPregunta = p.idPregunta";
    $res = $cn->query($sql);

    $datos = [];
    while ($row = $res->fetch_assoc()) {
        $datos[] = $row;
    }

    echo json_encode($datos);
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

    $sql = "INSERT INTO Respuesta (Respuesta, idPregunta)
            VALUES ('$respuesta', '$idPregunta')";

    echo $cn->query($sql) ? $cn->insert_id : 0;
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
    $idPregunta = $_POST["cboPregunta"];

    $sql = "UPDATE Respuesta
            SET Respuesta='$respuesta', idPregunta='$idPregunta'
            WHERE idRespuesta=$id";

    echo $cn->query($sql) ? "correcto" : "error";
}

if (isset($_GET["eliminarRespuesta"])) {
    $id = $_POST["txtId"];

    $sql = "DELETE FROM Respuesta WHERE idRespuesta=$id";
    echo $cn->query($sql) ? "correcto" : "error";
}
