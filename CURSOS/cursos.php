<?php
include("api2/conexion.php");

/* GUARDAR */
if (isset($_POST['btnguardar'])) {
    $nombre = $_POST['txtnombre'];
    if (!empty($nombre)) {
        mysqli_query($conn, "INSERT INTO Cursos (NombreCursos) VALUES ('$nombre')");
    }
    header("Location: diseño.php");
    exit();
}

/* ELIMINAR */
if (isset($_GET['id'])) {
    mysqli_query($conn, "DELETE FROM Cursos WHERE idCursos='{$_GET['id']}'");
    header("Location: diseño.php");
    exit();
}

/* MODIFICAR */
if (isset($_POST['btnmodificar'])) {
    mysqli_query($conn,
        "UPDATE Cursos SET NombreCursos='{$_POST['txtnombre']}'
         WHERE idCursos='{$_POST['txtid']}'"
    );
    header("Location: diseño.php");
    exit();
}
?>