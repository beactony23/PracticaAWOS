<?php
include("api2/conexion.php");

// Obtener cursos
$resultado = mysqli_query($conn, "SELECT * FROM Cursos");
$cursos = [];
while ($fila = mysqli_fetch_assoc($resultado)) {
    $cursos[] = $fila;
}


$editar = null;
if (isset($_GET['id_mod'])) {
    $result = mysqli_query($conn, "SELECT * FROM Cursos WHERE idCursos='{$_GET['id_mod']}'");
    $editar = mysqli_fetch_assoc($result);
}


echo json_encode([
    'cursos' => $cursos,
    'editar' => $editar
]);
?>