<?php
include 'conexion.php';
header('Content-Type: application/json');

// 1. OBTENER DATOS CON LOS NOMBRES REALES DE TU BD
if ($_SERVER['REQUEST_METHOD'] === 'GET' && !isset($_GET['borrar_u'])) {
    $sql = "SELECT 
                p.*, 
                u.Nom_Usuario AS nombreUsuario, 
                pr.Pregunta AS textoPregunta 
            FROM Progreso p
            INNER JOIN Usuarios u ON p.idUsuario = u.idUsuario
            INNER JOIN Preguntas pr ON p.idPregunta = pr.idPregunta";
    
    $res = mysqli_query($conn, $sql);
    
    if ($res) {
        echo json_encode(mysqli_fetch_all($res, MYSQLI_ASSOC));
    } else {
        echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
    }
    exit;
}

// 2. ELIMINAR
if (isset($_GET['borrar_u']) && isset($_GET['borrar_p'])) {
    $u = intval($_GET['borrar_u']);
    $p = intval($_GET['borrar_p']);
    $query = "DELETE FROM Progreso WHERE idUsuario=$u AND idPregunta=$p";
    
    if (mysqli_query($conn, $query)) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
    }
    exit;
}

// 3. GUARDAR O ACTUALIZAR
if (isset($_POST['idUsuario'])) {
    $idU = intval($_POST['idUsuario']);
    $idP = intval($_POST['idPregunta']);
    $comp = intval($_POST['Completado']);
    $int = intval($_POST['Intentos']);
    $time = intval($_POST['Tiempo_Segundos']);
    $fecha = mysqli_real_escape_string($conn, $_POST['Fecha']);
    $id_edit = $_POST['id_edit']; 

    $checkUser = mysqli_query($conn, "SELECT idUsuario FROM Usuarios WHERE idUsuario = $idU");
    $checkPreg = mysqli_query($conn, "SELECT idPregunta FROM Preguntas WHERE idPregunta = $idP");

    if (mysqli_num_rows($checkUser) == 0 || mysqli_num_rows($checkPreg) == 0) {
        echo json_encode(["status" => "error", "message" => "ese id no existe"]);
        exit;
    }

    if ($id_edit == "") {
        $sql = "INSERT INTO Progreso (idUsuario, idPregunta, Completado, Intentos, Tiempo_Segundos, Fecha)
                VALUES ($idU, $idP, $comp, $int, $time, '$fecha')";
    } else {
        $sql = "UPDATE Progreso SET 
                    Completado=$comp, 
                    Intentos=$int, 
                    Tiempo_Segundos=$time, 
                    Fecha='$fecha' 
                WHERE idUsuario=$idU AND idPregunta=$idP";
    }

    if(mysqli_query($conn, $sql)) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
    }
    exit;
}
?>