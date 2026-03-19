$.get("servicio.php?ObtenerCursos", function (cursos) {
    cursos.forEach(curso => {
        $("#cboCurso").append(
            `<option value=${curso["ID"]}>${curso['Nombre']}</option>`
        )
    });
})

buscarPreguntas()

function buscarPreguntas() {
    $.get("servicio.php?Preguntas", function (Preguntas) {
        document.getElementById("tbodyPreguntas").innerHTML = ''

        Preguntas.forEach(Pregunta => {
            $("#tbodyPreguntas").append(`<tr>
                <td>${Pregunta['ID']}</td>
                <td>${Pregunta['Pregunta']}</td>
                <td>${Pregunta['Valor']}</td>
                <td>${Pregunta['Nombre del curso']}</td>
                <td>${Pregunta['HoraRegistro']}</td>
                <td>
                    <button class="btn btn-info btn-editar w-25" data-id="${Pregunta['ID']}">Editar</button>
                    <button class="btn btn-danger btn-eliminar w-25" data-id="${Pregunta['ID']}">Eliminar</button>
                </td>
            </tr>`)
        })
    })
}


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

    if (comando == "eliminarPregunta") {
        alert("Se eliminó una pregunta por otro usuario")
        buscarPreguntas()
        mostrarToast(" se eliminó una pregunta por otro usuario.")
    }

    if (comando == "modificarPregunta") {
        alert("Se modificó una pregunta por otro usuario")
        buscarPreguntas()
        mostrarToast(" Se modificó una pregunta por otro usuario.")
    }

    if (comando == "insertarPregunta") {
        alert("Se agregó una pregunta por otro usuario") 
        buscarPreguntas()
        mostrarToast("se agregó una nueva pregunta por otro usuario.")
    }  
}

conn.onopen = function (e) {
    conn.send("Conexión WebSocket Correcta")
}

$(document).on("click", ".btn-eliminar", function (event) {
    const id = $(this).data("id")

    if (!confirm("Deseas eliminar esta pregunta?")) return

    $.post("servicio.php?eliminarPregunta", { txtId: id }, function (respuesta) {
        if (respuesta == "correcto") {
            alert("Pregunta eliminada correctamente")
            buscarPreguntas()
            conn.send("eliminarPregunta")
        }
    })
})

$(document).on("click", ".btn-editar", function (event) {
    const id = $(this).data("id")

    if (!confirm("Deseas editar esta pregunta?")) return

    $.get("servicio.php?editarPregunta", { txtId: id }, function (respuesta) {
        const campos_respuesta = respuesta[0]

        $("#txtId").val(campos_respuesta["idPregunta"])
        $("#cboCurso").val(campos_respuesta["idCursos"])
        $("#txtValor").val(campos_respuesta['Valor'])
        $("#txtPregunta").val(campos_respuesta['Pregunta'])
    })
})

$("#frmProducto").submit(function (event) {
    event.preventDefault()

    if ($("#txtId").val()) {
        $.post("servicio.php?modificarPregunta", $(this).serialize(), function (respuesta) {
            if (respuesta == "correcto") {
                alert("Pregunta modificada correctamente")
                $("#frmProducto").get(0).reset()
                buscarPreguntas()
                conn.send("modificarPregunta") 
            }
        })
        return
    }

    $.post("servicio.php?insertarPregunta", $(this).serialize(), function (respuesta) {
        if (respuesta != "0") {
            alert("Pregunta agregada correctamente")
            $("#frmProducto").get(0).reset()
            buscarPreguntas()
            conn.send("insertarPregunta") 
        }
    })
})