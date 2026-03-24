const API ="https://listing-mode-sam-ram.trycloudflare.com/4B/Api-GitHub/PracticaAWOS/Progreso/";

// ==========================================
// 1. CARGAR DATOS (READ - GET)
// ==========================================
$.ajaxSetup({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`
    }
})


function cargarTabla() {
    $.get(`${API}api.php?accion=listar`, function (datos) {
        let html = '';

        datos.forEach(p => {
            const rowData = JSON.stringify(p).replace(/"/g, '&quot;');
            
            html += `<tr>
                <td><strong>${p.nombreUsuario || 'Usuario'} (ID: ${p.idUsuario})</strong></td>
                <td>${p.idPregunta} - ${p.textoPregunta || ''}</td>
                <td>${p.Completado == 1 ? '✅ Finalizado' : '⏳ En curso'}</td>
                <td>${p.Intentos}</td>
                <td>${p.Tiempo_Segundos}s</td>
                <td>${p.Fecha}</td>
                <td>
                    <button class="btn btn-edit" onclick="cargarFormularioEdicion(${rowData})">Editar</button>
                    <button class="btn btn-del" onclick="eliminarRegistro(${p.idUsuario}, ${p.idPregunta})">Borrar</button>
                </td>
            </tr>`;
        });
        $('#tbodyProgreso').html(html);
    }, "json").fail(function () {
        console.error("No se pudieron cargar los progresos desde el servidor.");
    });
}

// Carga Inicial
$(document).ready(function () {
    cargarTabla();
});


// ==========================================
// 2. ENVIAR FORMULARIO (CREATE/UPDATE - POST)
// ==========================================
$("#progresoForm").submit(function (e) {
    e.preventDefault();
    $('#mensajeError').hide();

    let endpoint = $("#id_edit").val() === "" ? `${API}api.php?accion=guardar` : `${API}api.php?accion=modificar`;

    $.post(endpoint, $(this).serialize(), function (res) {
        if (res.status === "correcto") {
            alert("¡Operación realizada con éxito!");
            resetearFormulario();
            cargarTabla();

            if (typeof conn !== 'undefined' && conn.readyState === WebSocket.OPEN) {
                conn.send("cambio-progreso");
            }
        } else {
            $('#mensajeError').text("Error: " + res.message).show();
        }
    }, "json").fail(function () {
        $('#mensajeError').text("Error de conexión con el servidor").show();
    });
});


// ==========================================
// 3. EVENTOS DE UI (EDICIÓN Y CANCELACIÓN)
// ==========================================
function cargarFormularioEdicion(data) {
    $("#id_edit").val(data.idUsuario); 

    $("#idU").val(data.idUsuario).prop("readonly", true);
    $("#idP").val(data.idPregunta).prop("readonly", true);

    $("#comp").val(data.Completado);
    $("#int").val(data.Intentos);
    $("#time").val(data.Tiempo_Segundos);
    $("#fecha").val(data.Fecha);

    $("#btnSubmit").text("Actualizar Cambios").css("background", "#ff9800");
    $("#btnCancel").show();
    $('#mensajeError').hide();
}

function resetearFormulario() {
    $("#progresoForm")[0].reset();

    $("#id_edit").val("");
    $("#idU").prop("readonly", false);
    $("#idP").prop("readonly", false);

    $("#btnSubmit").text("Guardar Datos").css("background", "");
    $("#btnCancel").hide();
    $('#mensajeError').hide();
}

function cancelarEdicion() {
    resetearFormulario();
}


// ==========================================
// 4. ELIMINAR REGISTRO (DELETE - POST)
// ==========================================
function eliminarRegistro(u, p) {
    if (!confirm('¿Seguro que deseas eliminar este progreso?')) return;

    $.post(`${API}api.php?accion=eliminar`, { idUsuario: u, idPregunta: p }, function (res) {
        if (res.status === "correcto") {
            alert("¡Registro eliminado con éxito!");
            cargarTabla();
        } else {
            alert("No se pudo eliminar: " + res.message);
        }
    }, "json");
}