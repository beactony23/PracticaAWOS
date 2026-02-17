<?php
session_start();
require_once "conexion.php";
// Procesar acciones de rol
if (isset($_GET["accion"], $_GET["id"])) {
    $accion = $_GET["accion"];
    $idUsuario = $_GET["id"];

    // Evitar que el usuario se cambie su propio rol
    if ($idUsuario != $_SESSION["idUsuario"]) {

        if ($accion === "hacer_admin") {
            $nuevoRol = 1; // Admin
        } elseif ($accion === "quitar_admin") {
            $nuevoRol = 2; // Usuario normal
        }

        if (isset($nuevoRol)) {
            $sqlUpdate = "UPDATE Usuarios SET id_rol = :rol WHERE idUsuario = :id";
            $stmtUpdate = $pdo->prepare($sqlUpdate);
            $stmtUpdate->execute([
                ":rol" => $nuevoRol,
                ":id" => $idUsuario
            ]);
        }
    }

    // Redirigir para limpiar la URL
    header("Location: gestion_usuarios.php");
    exit;
}


// Consulta con JOIN a roles
$sql = "
SELECT 
    u.idUsuario,
    u.Nom_Usuario,
    u.CorreoElectronico,
    r.nombre_rol,
    u.id_rol
FROM Usuarios u
INNER JOIN roles r ON u.id_rol = r.id_rol
";


$stmt = $pdo->query($sql);
$usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Gestión de Usuarios</title>
    <style>
        body { font-family: Arial; background: #f4f4f4; }
        table { border-collapse: collapse; width: 85%; margin: 40px auto; background: white; }
        th, td { padding: 10px; border: 1px solid #ccc; text-align: center; }
        th { background: #333; color: white; }
        h2 { text-align: center; }
        a { display: block; text-align: center; margin-top: 20px; }
    </style>
</head>
<body>

<h2>Gestión de Usuarios</h2>

<table>
<tr>
    <th>Nombre</th>
    <th>Email</th>
    <th>Rol</th>
    <th>Acción</th>
</tr>

<?php foreach ($usuarios as $u): ?>
<tr>
    <td><?= $u["Nom_Usuario"] ?></td>
    <td><?= $u["CorreoElectronico"] ?></td>
    <td><?= $u["nombre_rol"] ?></td>
    <td>
        <?php if ($u["idUsuario"] != $_SESSION["idUsuario"]): ?>

            <?php if ($u["id_rol"] == 2): ?>
                <a href="?accion=hacer_admin&id=<?= $u["idUsuario"] ?>">Hacer admin</a>
            <?php else: ?>
                <a href="?accion=quitar_admin&id=<?= $u["idUsuario"] ?>">Quitar admin</a>
            <?php endif; ?>

        <?php else: ?>
            —
        <?php endif; ?>
    </td>
</tr>
<?php endforeach; ?>
</table>

<a href="index.html">Volver</a>
<a href="assets/logout.php">Cerrar sesión</a>

</body>
</html>
