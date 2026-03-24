<?php
include("api2/conexion.php");

// GUARDAR
if (isset($_POST['btnguardar'])) {
    $nombre = $_POST['txtnombre'];
    if (!empty($nombre)) {
        mysqli_query($conn, "INSERT INTO Cursos (NombreCursos) VALUES ('$nombre')");
        header("Location: index.php");
        exit();
    }
}

// ELIMINAR
if (isset($_GET['id'])) {
    mysqli_query($conn, "DELETE FROM Cursos WHERE idCursos='{$_GET['id']}'");
    header("Location: index.php");
    exit();
}


$editar = null;
if (isset($_GET['id_mod'])) {
    $result = mysqli_query($conn, "SELECT * FROM Cursos WHERE idCursos='{$_GET['id_mod']}'");
    $editar = mysqli_fetch_assoc($result);
}

// MODIFICAR
if (isset($_POST['btnmodificar'])) {
    $id = $_POST['txtid'];
    $nombre = $_POST['txtnombre'];
    mysqli_query($conn, "UPDATE Cursos SET NombreCursos='$nombre' WHERE idCursos='$id'");
    header("Location: index.php");
    exit();
}

// BUSCAR
$buscar = "";
if (isset($_POST['btnbuscar'])) {
    $buscar = $_POST['txtbuscar'];
}

$resultado = mysqli_query($conn, "SELECT * FROM Cursos WHERE NombreCursos LIKE '$buscar%'");


$cursos = [];
while ($fila = mysqli_fetch_assoc($resultado)) {
    $cursos[] = $fila;
}


include("vistas_cursos.html");
?>