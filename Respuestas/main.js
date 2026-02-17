function buscarRespuestas() {
    $.get("servicio.php?respuestas", function (datos) {
        $("#tbodyRespuestas").html("");

        for (let i = 0; i < datos.length; i++) {
            let r = datos[i];

            $("#tbodyRespuestas").append(`
                <tr>
                    <td>${r.Pregunta}</td>
                    <td>${r.Respuesta}</td>
                    <td>
                        <button class="btn btn-info btn-editar" data-id="${r.idRespuesta}">Editar</button>
                        <button class="btn btn-danger btn-eliminar" data-id="${r.idRespuesta}">Eliminar</button>
                        <button onclick="verLongitud(${r.idRespuesta})" class="btn btn-secondary">
    Longitud
</button>

                    </td>
                </tr>
            `);
        }
    }, "json");
}


function mostrarPreguntasSinRespuesta() {
    $.get("servicio.php?PreguntasSinrespuestas", function (datos) {
        $("#tbodyRespuestas").html("");

        for (let i = 0; i < datos.length; i++) {
            let p = datos[i];

            $("#tbodyRespuestas").append(`
                <tr>
                    <td>${p.Pregunta}</td>
                    <td>Sin respuesta</td>
                    <td></td>
                </tr>
            `);
        }
    }, "json");
}
$(document).on("click", "#btnSinRespuesta", function () {
    mostrarPreguntasSinRespuesta();
});

$(document).on("click", "#btnRespuestas", function () {
    buscarRespuestas();
});


buscarRespuestas();

$.get("servicio.php?preguntasCombo", function (datos) {
    $("#cboPregunta").html("");

    for (let x in datos) {
        $("#cboPregunta").append(`
            <option value="${datos[x].value}">
                ${datos[x].label}
            </option>
        `);
    }
}, "json");

$("#frmRespuesta").submit(function (e) {
    e.preventDefault();

    let url = $("#txtId").val()
        ? "modificarRespuesta"
        : "agregarRespuesta";

    $.post("servicio.php?" + url, $(this).serialize(), function (res) {

    });
});

$(document).on("click", ".btn-editar", function () {


    let id = $(this).data("id");

    $.get("servicio.php?editarRespuesta", { id }, function (data) {

        let r = data[0];
        $("#txtId").val(r.idRespuesta);
        $("#txtRespuesta").val(r.Respuesta);
        $("#cboPregunta").val(r.idPregunta);
    }, "json");
});


$(document).on("click", ".btn-eliminar", function () {
    if (!confirm("¿Eliminar respuesta?")) return;

    $.post("servicio.php?eliminarRespuesta",
        { txtId: $(this).data("id") },
        function (res) {
            if (res === "correcto") {
                 alert("Respuesta eliminada correctamente")
                buscarRespuestas();

                // En tiempo real para los demás clientes
            conn.send("buscar-respuestas")
            }
        }
    );
});

const conn = new WebSocket("ws://localhost:8080/chat")
conn.onmessage = function (e) {
    const comando = e.data
    console.log(comando)
    if (comando == "buscar-respuestas") {
        const toastLiveExample = document.getElementById("liveToast")
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
        toastBootstrap.show()

        // Asincrono (Dentro de la APP)
        buscarRespuestas()
    }
}
conn.onopen = function (e) {
    conn.send("Conexión WebSocket Correcta")
}

$("#btnTotal").click(function () {
    $.get("servicio.php?totalRespuestas", function (d) {
        alert("Total de respuestas: " + d.totalRespuestas);
    }, "json");
});

function verLongitud(id) {
    $.get("servicio.php?longitudRespuesta&id=" + id, function (d) {
        alert("La respuesta tiene " + d.longitud + " caracteres");
    }, "json");
}

$("#btnHoy").click(function () {
    $.get("servicio.php?respuestasHoy", function (d) {
        alert("Respuestas registradas hoy: " + d.total);
    }, "json");
});


