<?php
session_start();
error_reporting(0);
require_once "conexion2.php";

/* 🛠 PROCESAR ACCIONES DE ROL */
if (isset($_GET["accion"], $_GET["id"])) {

    $accion = $_GET["accion"];
    $idUsuario = $_GET["id"];

    if ($idUsuario != $_SESSION["idUsuario"]) {

        if ($accion === "hacer_admin") {
            $nuevoRol = 1;
        } elseif ($accion === "quitar_admin") {
            $nuevoRol = 2;
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

    header("Location: gestion_usuarios.php");
    exit;
}

/* 📋 CONSULTA DE USUARIOS */
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
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <style>
        
        body { font-family: Arial; background: #f4f4f4; }
        table { border-collapse: collapse; width: 85%; margin: 40px auto; background: white; }
        th, td { padding: 10px; border: 1px solid #ccc; text-align: center; }
        th { background: #333; color: white; }
        h2 { text-align: center; }
        a { display: block; text-align: center; margin-top: 20px; }

        .chat-box {
            width: 85%;
            margin: 30px auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        #chatAdmin {
            height: 300px;
            overflow-y: auto;
            border: 1px solid #ccc;
            padding: 10px;
            margin-bottom: 10px;
        }

        #txtMensajeAdmin {
            width: 80%;
            padding: 8px;
        }

        button {
            padding: 8px 15px;
            cursor: pointer;
        }
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
    <td><?= htmlspecialchars($u["Nom_Usuario"]) ?></td>
    <td><?= htmlspecialchars($u["CorreoElectronico"]) ?></td>
    <td><?= htmlspecialchars($u["nombre_rol"]) ?></td>
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

<div class="chat-box">
    <h2>Chat Soporte (Admin)</h2>

    <div id="chatAdmin"></div>

    <input type="text" id="txtMensajeAdmin" placeholder="Escribe respuesta...">
    <button onclick="enviarRespuesta()">Enviar</button>
</div>

<a href="index.html">Volver</a>
<a href="assets/logout.php">Cerrar sesión</a>

<script>

    if (!localStorage.getItem("jwt")) {
        location.replace("Login.html");
    }

    $.ajaxSetup({
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`
        }
    });

    $.get("Login.php?sesion", function(respuesta) {
        if (respuesta[2] == 1) {
            return   
        } else {
            location.replace("index.html");
        }

    });

    function agregarMensaje(data) {
        const mensaje = JSON.parse(data);

        const div = document.createElement("div");
        div.style.marginBottom = "8px";
        div.innerHTML = "<strong>" + (mensaje.usuario || "Sistema") + ":</strong> " + mensaje.mensaje;

        document.getElementById("chatAdmin").appendChild(div);
        document.getElementById("chatAdmin").scrollTop = document.getElementById("chatAdmin").scrollHeight;
    }

    const conn = new WebSocket("ws://localhost:8080");

    conn.onopen = function() {
        console.log("Admin conectado");
        conn.send(JSON.stringify({
            tipo: "admin"
        }));
    };

    conn.onmessage = function(e) {
        agregarMensaje(e.data);
    };

    conn.onerror = function(error){
        console.log("Error WebSocket:", error);
    };

    function enviarRespuesta() {
        const mensaje = {
            tipo: "admin",
            usuario: "Admin",
            mensaje: document.getElementById("txtMensajeAdmin").value,
            colorFondo: "#d1ecf1",
            colorTexto: "#000000"
        };

        conn.send(JSON.stringify(mensaje));
        document.getElementById("txtMensajeAdmin").value = "";
    }
</script>

</body>
</html>