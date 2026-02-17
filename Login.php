<?php
session_start();
require_once "conexion.php";

$error = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

  $email = trim($_POST["email"]);
  $pass  = $_POST["pass"];

  if (empty($email) || empty($pass)) {
    $error = "Completa todos los campos";
  } 
  else {

    try {

      $sql = "SELECT * FROM Usuarios WHERE CorreoElectronico = ?";
      $stmt = $pdo->prepare($sql);
      $stmt->execute([$email]);

      $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($usuario && password_verify($pass, $usuario["Contrasena"])) {

        $_SESSION["idUsuario"] = $usuario["idUsuario"];
        $_SESSION["nombre"]   = $usuario["Nom_Usuario"];
        $_SESSION["rol"]      = $usuario["id_rol"];
        $_SESSION["nivel"] = $usuario["Nivel"];


        header("Location: index.html");
        exit;

      } else {
        $error = "Correo o contraseña incorrectos";
      }

    } catch (PDOException $e) {
      $error = "Error del sistema. Intenta más tarde.";
    }
  }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Login</title>
  <link rel="stylesheet" href="assets/estilosLR.css">
</head>

<body class="auth">
<div class="auth-wrapper">

  <div class="auth-left">
    <h1>Hola<br>usuario!</h1>
    <p>Bienvenido de nuevo.<br>Inicia sesión para continuar.</p>
  </div>

  <div class="auth-right">
    <h2>Iniciar sesión</h2>
    <p>¿No tienes cuenta? <a href="register.php">Regístrate</a></p>

    <?php if ($error): ?>
      <p class="error"><?= $error ?></p>
    <?php endif; ?>

    <form method="POST">
      <label>Email</label>
      <input type="email" name="email" placeholder="input text" required>

      <label>Contraseña</label>
      <input type="password" name="pass" placeholder="input text" required>

      <button type="submit">Entrar</button>
    </form>
  </div>

</div>
<!-- Botón WhatsApp -->
<a href="https://wa.me/5218441234567?text=Hola%20tengo%20problemas%20para%20iniciar%20sesión"
   class="wsp-btn"
   target="_blank">
   <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg">
</a>

</body>
</html>
