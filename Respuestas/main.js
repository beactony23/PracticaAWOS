const API = "https://joy-rain-loan-civic.trycloudflare.com/4B/Api-GitHub/PracticaAWOS"

$.ajaxSetup({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`
    }
})


$("#btnCerrarSesion").click(function (event) {
    //localStorage.removeItem("jwt")
    //window.location = "../Login.html?reload"
})

$.get(`${API}/Login.php?sesion`, function (sesion) {

    if (sesion.length === 0) {
            //window.location.replace("Login.html");
    } else {
          return
    }


    if (sesion.length) {
        console.log(sesion)
        $("#btnCerrarSesion")
        .show()
        .css("visibility", "visible")
        return
    }

        $("#btnIniciarSesion")
        .show()
        .css("visibility", "visible")
        $("#tbodyProductos").html("")
})

function buscarRespuestas() {
    $.get(`${API}/Respuestas/servicio.php?respuestas`, function (datos) {
        $("#tbodyRespuestas").html("");

        for (let i = 0; i < datos.length; i++) {
            let r = datos[i];

           $("#tbodyRespuestas").append(`
    <tr>
        <td>${r.Pregunta}</td>
        <td>${r.Respuesta}</td>
        <td>
            <button class="btn-editar" data-id="${r.idRespuesta}">Editar</button>
            <button class="btn-eliminar" data-id="${r.idRespuesta}">Eliminar</button>
            <button onclick="verLongitud(${r.idRespuesta})" class="btn-row" style="background: #a78bfa; color:white;">
                📏 Longitud
            </button>
        </td>
    </tr>
`);
        }
    }, "json");
}


function mostrarPreguntasSinRespuesta() {
    $.get(`${API}/Respuestas/servicio.php?PreguntasSinrespuestas`, function (datos) {
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

$.get(`${API}/Respuestas/servicio.php?preguntasCombo`, function (datos) {
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

    if ($("#txtId").val() === "") {
        $.post(`${API}/Respuestas/servicio.php?agregarRespuesta`,$(this).serialize(),function (res) {
            alert("Se agregó una nueva respuesta!.");
                    buscarRespuestas();
                    conn.send("insertar-respuesta");
            }
        )
        .fail(function () {
            alert("Se agregó una nueva respuesta!.");
            buscarRespuestas();
                    conn.send("insertar-respuesta");
        });
        return;
    }

    $.post(`${API}/Respuestas/servicio.php?modificarRespuesta`, $(this).serialize(),function (res) {
                alert("Se modificó la respuesta!.");
                buscarRespuestas();
                conn.send("modificar-respuesta");      
        }
    );
});

$(document).on("click", ".btn-editar", function () {


    let id = $(this).data("id");

    $.get(`${API}/Respuestas/servicio.php?editarRespuesta`, { id }, function (data) {

        let r = data[0];
        $("#txtId").val(r.idRespuesta);
        $("#txtRespuesta").val(r.Respuesta);
        $("#cboPregunta").val(r.idPregunta);
    }, "json");
});


$(document).on("click", ".btn-eliminar", function () {
    if (!confirm("¿Eliminar respuesta?")) return;

    $.post(`${API}/Respuestas/servicio.php?eliminarRespuesta`,
        { txtId: $(this).data("id") },
        function (res) {
                alert("Se eliminó la respuesta!.");
                buscarRespuestas()

                conn.send("buscar-respuestas")
            }
        
    );
});

function mostrarToast(mensaje) {
    document.getElementById("toastMensaje").innerText = mensaje
    const toastEl = document.getElementById("liveToast")
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastEl)
    toastBootstrap.show()
}

const conn = new WebSocket("ws://localhost:8080/chat")
conn.onmessage = function (e) {
    const comando = e.data
    console.log(comando)
    if (comando == "buscar-respuestas") {
        alert("Se ha eliminado una respuesta de la lista de respuestas")

        // Asincrono (Dentro de la APP)
        buscarRespuestas()

        mostrarToast("se ha eliminado una respuesta de la lista de respuestas.")
    }
     if (comando == "modificar-respuesta") {
        alert("Se modificó una respuesta por otro usuario")
        buscarRespuestas()
        mostrarToast(" Se modificó una respuesta por otro usuario.")
    }

    if (comando == "insertar-respuesta") {
        alert("Se agregó una respuesta por otro usuario") 
        buscarRespuestas()
        mostrarToast("se agregó una nueva respuesta por otro usuario.")
    }
}
conn.onopen = function (e) {
    conn.send("Conexión WebSocket Correcta")
}

$("#btnTotal").click(function () {
    $.get(`${API}/Respuestas/servicio.php?totalRespuestas`, function (d) {
        alert("Total de respuestas: " + d.totalRespuestas);
    }, "json");
});

function verLongitud(id) {
    $.get(`${API}/Respuestas/servicio.php?longitudRespuesta&id=` + id, function (d) {
        alert("La respuesta tiene " + d.longitud + " caracteres");
    }, "json");
}

$("#btnHoy").click(function () {
    $.get(`${API}/Respuestas/servicio.php?respuestasHoy`, function (d) {
        alert("Respuestas registradas hoy: " + d.total);
    }, "json");
});


