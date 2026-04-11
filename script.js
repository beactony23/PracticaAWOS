$.ajaxSetup({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`
    }
})

$(document).ready(function () {
    listarCursos();

    // --- 1. LISTAR CURSOS ---
    function listarCursos() {
        $.get('datos.php', function (respuesta) {
            const tbody = $("#tablaCursos");
            tbody.empty();

            if (!respuesta.cursos || respuesta.cursos.length === 0) {
                tbody.append('<tr><td colspan="3" class="text-center">No hay cursos registrados</td></tr>');
                return;
            }

            respuesta.cursos.forEach(curso => {
                tbody.append(`
                    <tr>
                        <td>${curso.idCursos}</td>
                        <td>${curso.NombreCursos}</td>
                        <td>
                            <button class="btn btn-warning btn-sm btn-editar" data-id="${curso.idCursos}">Modificar</button>
                            <button class="btn btn-danger btn-sm btn-eliminar" data-id="${curso.idCursos}">Eliminar</button>
                        </td>
                    </tr>
                `);
            });
        });
    }

    // --- 2. GUARDAR O MODIFICAR ---
    $("#formCurso").submit(function (e) {
        e.preventDefault();
        
        const datos = $(this).serialize();
        const id = $("#txtid").val();
        
        const accion = id ? "btnmodificar=1" : "btnguardar=1";

        $.post('datos.php', datos + "&" + accion, function (res) {
            if(res.trim() === "correcto") {
                alert("¡Operación exitosa!");
                resetearFormulario();
                listarCursos();
            } else {
                alert("Hubo un error en la base de datos.");
            }
        });
    });

    // --- 3. CARGAR PARA EDITAR ---
    $(document).on("click", ".btn-editar", function () {
        const id = $(this).data("id");

        $.get('datos.php', { id_mod: id }, function (res) {
            const curso = res.editar;
            if (curso) {
                $("#txtid").val(curso.idCursos);
                $("#txtnombre").val(curso.NombreCursos);
                
                $("#btnGuardar").text("Actualizar").removeClass("btn-success").addClass("btn-warning");
                window.scrollTo(0, 0);
            }
        });
    });

    // --- 4. ELIMINAR ---
    $(document).on("click", ".btn-eliminar", function () {
        const id = $(this).data("id");

        if (confirm("¿Seguro que quieres eliminar este curso?")) {
            $.get('datos.php', { id_eliminar: id }, function (res) {
                listarCursos();
            });
        }
    });

    function resetearFormulario() {
        $("#formCurso")[0].reset();
        $("#txtid").val("");
        $("#btnGuardar").text("Guardar curso").removeClass("btn-warning").addClass("btn-success");
    }

    $("#btnCancelar").click(resetearFormulario);
});