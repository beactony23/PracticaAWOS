<?php
require_once "conexion.php";

$error = "";

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

            $sql = "INSERT INTO Usuarios 
                    (Nom_Usuario, CorreoElectronico, Contrasena, Nivel, Experiencia, id_rol)
                    VALUES (?, ?, ?, 1, 0, 2)"; // 2 = Usuario

            $stmt = $pdo->prepare($sql);
            $stmt->execute([$nombre, $email, $passHash]);

            header("Location: login.php");
            exit;

        } catch (PDOException $e) {

            if ($e->getCode() == 23000) {
                $error = "Este correo ya está registrado";
            } else {
                $error = "Error al registrar usuario";
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
    <p>Bienvenido a nuestra página web.<br>Crea tu cuenta.</p>
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
      <input
  type="password"
  id="pass"
  name="pass"
  required
  minlength="8"
  pattern="(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}"
  title="Mínimo 8 caracteres, una mayúscula, un número y un símbolo"
>


      <label>Confirmar contraseña</label>
      <input type="password" name="pass2" required>

      <button type="submit">Registrarse</button>
    </form>
  </div>

</div>
<!-- Botón WhatsApp -->
<a href="https://wa.me/5218441234567?text=Hola%20tengo%20dudas%20con%20el%20registro"
   class="wsp-btn"
   target="_blank">
   <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg">
</a>

</body>
</html>
