<?php
include("api2/conexion.php");

/* ELIMINAR */
if (isset($_GET['eliminar'])) {
    $id = intval($_GET['eliminar']);
    mysqli_query($conn, "DELETE FROM cursos WHERE idCursos = $id");
    header("Location: index.php");
}

/* BUSCAR */
$buscar = isset($_GET['buscar']) ? $_GET['buscar'] : '';

$sql = "SELECT * FROM view_cursos WHERE NombreCursos LIKE '%$buscar%'";
$resultado = mysqli_query($conn, $sql);
?>

<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Cursos</title>

<style>
body {
    margin: 0;
    background: radial-gradient(circle, #0f2027, #203a43, #2c5364);
    font-family: Arial;
    overflow: hidden;
}

/* BUSCADOR */
.buscador {
    position: absolute;
    top: 20px;
    width: 100%;
    text-align: center;
}

.buscador input {
    padding: 10px;
    width: 250px;
    border-radius: 10px;
    border: none;
}

/* ESCENA */
.escena {
    width: 100%;
    height: 100vh;
    position: relative;
}

/* TARJETAS */
.card {
    position: absolute;
    width: 180px;
    height: 110px;
    border-radius: 15px;
    background: linear-gradient(135deg, #00c6ff, #0072ff);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    text-align: center;
    cursor: pointer;
    padding: 5px;
}

/* BOTONES */
.botones {
    margin-top: 5px;
}

.botones a {
    font-size: 12px;
    margin: 2px;
    padding: 3px 6px;
    border-radius: 5px;
    text-decoration: none;
    color: white;
}

.editar { background: orange; }
.eliminar { background: red; }
</style>
</head>

<body>


<div class="buscador">
    <form method="GET">
        <input type="text" name="buscar" placeholder="Buscar curso..." value="<?php echo $buscar; ?>">
    </form>
</div>

<div class="escena" id="escena">

<?php 
$cursos = [];
while($row = mysqli_fetch_assoc($resultado)) {
    $cursos[] = $row;
}
$total = count($cursos);

for($i=0; $i<$total; $i++) {
?>

<div class="card" id="card<?php echo $i; ?>">
    
  
    <a href="curso.php?id=<?php echo $cursos[$i]['idCursos']; ?>" style="color:white; text-decoration:none;">
        <?php echo $cursos[$i]['NombreCursos']; ?>
    </a>

    
    <div class="botones">
        <a class="editar" href="index.php?id=<?php echo $cursos[$i]['idCursos']; ?>">✏️</a>
        <a class="eliminar" href="index.php?eliminar=<?php echo $cursos[$i]['idCursos']; ?>" onclick="return confirm('¿Eliminar curso?')">🗑️</a>
    </div>

</div>

<?php } ?>

</div>

<script>
let total = <?php echo $total; ?>;
let radioX = 300;
let radioY = 120;
let centroX = window.innerWidth / 2;
let centroY = window.innerHeight / 2;

let angulo = 0;

function animar() {
    for (let i = 0; i < total; i++) {
        let theta = (2 * Math.PI / total) * i + angulo;

        let x = centroX + Math.cos(theta) * radioX;
        let y = centroY + Math.sin(theta) * radioY;

        let escala = (Math.sin(theta) + 1.5) / 2.5;

        let card = document.getElementById("card" + i);

        card.style.left = x + "px";
        card.style.top = y + "px";
        card.style.transform = "translate(-50%, -50%) scale(" + escala + ")";
        card.style.opacity = escala;
        card.style.zIndex = Math.floor(escala * 100);
    }

    angulo += 0.002; // velocidad lenta pro
    requestAnimationFrame(animar);
}

animar();
</script>

</body>
</html>