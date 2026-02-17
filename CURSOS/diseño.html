<?php
include("api2/conexion.php");

/* GUARDAR */
if (isset($_POST['btnguardar'])) {
    $nombre = $_POST['txtnombre'];

    if (!empty($nombre)) {
        mysqli_query($conn,
            "INSERT INTO Cursos (NombreCursos) VALUES ('$nombre')"
        );

       
        header("Location: index.php");
        exit();
    }
}


/* BUSCAR */
$buscar = "";
if (isset($_POST['btnbuscar'])) {
    $buscar = $_POST['txtbuscar'];
}

$resultado = mysqli_query(
    $conn,
    "SELECT * FROM Cursos WHERE NombreCursos LIKE '%$buscar%'"
);
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>CURSOS</title>
</head>
<body>

<h2>📘 REGISTRO DE CURSOS</h2>

<form method="post">
    <label>Nombre del curso:</label><br>
    <input type="text" name="txtnombre" required>
    <br><br>
    <input type="submit" name="btnguardar" value="Guardar curso">
</form>

<hr>

<form method="post">
    <label>Buscar curso:</label>
    <input type="text" name="txtbuscar">
    <input type="submit" name="btnbuscar" value="Buscar">
</form>

<br>

<table border="1">
    <tr>
        <th>ID</th>
        <th>Curso</th>
    </tr>

    <?php while ($fila = mysqli_fetch_assoc($resultado)) { ?>
        <tr>
            <td><?= $fila['idCursos'] ?></td>
            <td><?= $fila['NombreCursos'] ?></td>
        </tr>
    <?php } ?>
</table>

</body>
</html>
