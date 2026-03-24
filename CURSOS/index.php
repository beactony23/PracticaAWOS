<?php
include("api2/conexion.php");

/* EDITAR */
$editar = null;
if (isset($_GET['id_mod'])) {
    $editar = mysqli_fetch_assoc(
        mysqli_query($conn, "SELECT * FROM Cursos WHERE idCursos='{$_GET['id_mod']}'")
    );
}

/* BUSCAR */
$buscar = $_POST['txtbuscar'] ?? "";
$resultado = mysqli_query($conn,
    "SELECT * FROM Cursos WHERE NombreCursos LIKE '%$buscar%'"
);
?>

<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Cursos</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<script src="cursos.js"></script>

</head>

<body class="bg-light">

<div class="container mt-5">

<h2 class="text-center mb-4">CURSOS</h2>

<div class="card p-4 shadow-sm mb-4">
<form method="post" action="cursos.php">

<input type="hidden" name="txtid" value="<?= $editar['idCursos'] ?? '' ?>">

<div class="mb-3">
<label class="form-label">Nombre del curso</label>
<input type="text" name="txtnombre"
class="form-control"
value="<?= $editar['NombreCursos'] ?? '' ?>"
required>
</div>

<?php if ($editar) { ?>
<button class="btn btn-warning" name="btnmodificar">Modificar</button>
<a href="index.php" class="btn btn-secondary">Cancelar</a>
<?php } else { ?>
<button class="btn btn-success" name="btnguardar">Guardar</button>
<?php } ?>

</form>
</div>

<form method="post" class="mb-3">
<div class="input-group">
<input type="text" name="txtbuscar" class="form-control" placeholder="Buscar curso">
<button class="btn btn-primary" name="btnbuscar">Buscar</button>
</div>
</form>

<div class="card shadow-sm">
<table class="table table-bordered table-hover text-center mb-0">

<thead class="table-dark">
<tr>
<th>ID</th>
<th>Curso</th>
<th>Acciones</th>
</tr>
</thead>

<tbody>
<?php while ($fila = mysqli_fetch_assoc($resultado)) { ?>
<tr>
<td><?= $fila['idCursos'] ?></td>
<td><?= $fila['NombreCursos'] ?></td>
<td>

<a href="index.php?id_mod=<?= $fila['idCursos'] ?>"
class="btn btn-warning btn-sm">MODIFICAR</a>

<a href="cursos.php?id=<?= $fila['idCursos'] ?>"
class="btn btn-danger btn-sm"
onclick="return eliminar()">ELIMINAR</a>

</td>
</tr>
<?php } ?>
</tbody>

</table>
</div>

</div>

</body>
</html>