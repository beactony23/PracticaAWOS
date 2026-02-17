<?php
// ... (Dentro de servicio.php)

if (isset($_GET["verProgresos"])) {
    // Seleccionamos campos de ambas tablas usando alias
    $campos = "p.idUsuario, u.usuario AS nombreUsuario, p.idPregunta, p.Completado, p.Intentos, p.Tiempo_Segundos, p.Fecha";
    
    // p = progresos (tu tabla de la imagen), u = usuarios
    $select = $con->select("progresos p", $campos);
    
    // Aplicamos el INNER JOIN para obtener el nombre del usuario
    $select->innerjoin("usuarios u ON u.id = p.idUsuario");
    
    $select->orderby("p.Fecha DESC");

    header("Content-Type: application/json");
    echo json_encode($select->execute());
}
?>