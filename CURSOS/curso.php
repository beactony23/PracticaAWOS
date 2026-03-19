<?php
include("api2/conexion.php");

/* VALIDAR ID */
if (!isset($_GET['id'])) {
    header("Location: index.php");
    exit();
}

$id = intval($_GET['id']);

/* OBTENER CURSO */
$stmt = mysqli_prepare($conn, "SELECT * FROM view_cursos WHERE idCursos = ?");
mysqli_stmt_bind_param($stmt, "i", $id);
mysqli_stmt_execute($stmt);
$res = mysqli_stmt_get_result($stmt);
$curso = mysqli_fetch_assoc($res);
mysqli_stmt_close($stmt);

/* SI NO EXISTE */
if (!$curso) {
    echo "Curso no encontrado";
    exit();
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title><?= $curso['NombreCursos'] ?></title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<style>
body {
    background: #0a0a0a;
    color: white;
}

.card-curso {
    max-width: 600px;
    margin: 100px auto;
    background: #1a1a1a;
    border-radius: 15px;
    padding: 30px;
    text-align: center;
    box-shadow: 0 0 25px rgba(0, 123, 255, 0.5);
}

.btn-volver {
    margin-top: 20px;
}
</style>
</head>

<body>

<div class="card-curso">
    <h1><?= $curso['NombreCursos'] ?></h1>

    <p class="mt-3">
        Aquí puedes mostrar el contenido del curso, temas, videos, etc.
    </p>

    <!-- EJEMPLO: puedes agregar más info -->
    <ul class="mt-4 text-start">
        <li>📘 Tema 1</li>
        <li>📗 Tema 2</li>
        <li>📙 Tema 3</li>
    </ul>

    <a href="index.php" class="btn btn-primary btn-volver">⬅ Volver</a>
</div>

</body>
</html>