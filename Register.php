<?php
// Anti-Cache
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

require_once "conexion.php";
session_start();

$error = "";

$con = new Conexion(array(
  "tipo"       => "mysql",
  "servidor"   => "46.28.42.226",
  "bd"         => "u760464709_24005037_bd",
  "usuario"    => "u760464709_24005037_usr",
  "contrasena" => "N&2lbK=8;Mrt"
));


if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $nombre = trim($_POST["user"]);
    $email  = trim($_POST["email"]);
    $pass   = $_POST["pass"];
    $pass2  = $_POST["pass2"];

    if (empty($nombre) || empty($email) || empty($pass) || empty($pass2)) {
        $error = "Completa todos los campos";
    }
    elseif ($pass !== $pass2) {
        $error = "Las contraseñas no coinciden";
    }
    else {
        try {
            $passHash = password_hash($pass, PASSWORD_DEFAULT);
            $sql = "CALL sp_AltaNuevoUsuario(?, ?, ?)";
            $stmt = $con->prepare($sql);
            $stmt->bindParam(1,$nombre);
            $stmt->bindParam(2,$passHash);
            $stmt->bindParam(3,$email);
            $stmt->execute();

            // Redirigir al login con un mensaje de éxito
            header("Location: login.html?status=success");
            exit;

        } catch (PDOException $e) {
            if ($e->getCode() == 23000) {
                $error = "Este correo ya está registrado";
            } else {
                $error = "Error técnico al registrar.";
            }
        }
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Registro</title>
  <link rel="stylesheet" href="assets/estilosLR.css">
</head>
<body class="auth">
<div class="auth-wrapper">
  <div class="auth-left">
    <h1>Hello<br>World.</h1>
    <p>Bienvenido a nuestra página web.<br>Crea tu cuenta usando procedimientos SQL.</p>
  </div>
  <div class="auth-right">
    <h2>Crear cuenta</h2>
    <p>¿Ya tienes cuenta? <a href="login.php">Inicia sesión</a></p>
    <?php if ($error): ?>
      <p class="error"><?= $error ?></p>
    <?php endif; ?>
    <form method="POST">
      <label>Nombre</label>
      <input type="text" name="user" required>
      <label>Email</label>
      <input type="email" name="email" required>
      <label>Contraseña</label>
      <input type="password" name="pass" required minlength="8" pattern="(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}" title="Mínimo 8 caracteres, una mayúscula, un número y un símbolo">
      <label>Confirmar contraseña</label>
      <input type="password" name="pass2" required>
      <button type="submit">Registrarse</button>
    </form>
  </div>
</div>
</body>
</html>