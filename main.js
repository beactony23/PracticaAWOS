function buscarRespuestas() {
    $.get("servicio.php?respuestas", function (datos) {
        $("#tbodyRespuestas").html("");

        for (let x in datos) {
            let r = datos[x];

            $("#tbodyRespuestas").append(`
                <tr>
                    <td>${r.Pregunta}</td>
                    <td>${r.Respuesta}</td>
                    <td>
                        <button class="btn btn-info btn-editar" data-id="${r.idRespuesta}">Editar</button>
                        <button class="btn btn-danger btn-eliminar" data-id="${r.idRespuesta}">Eliminar</button>
                    </td>
                </tr>
            `);
        }
    }, "json");
}

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
        if (res) {
            alert("Operación correcta");
            $("#frmRespuesta")[0].reset();
            buscarRespuestas();
        }
    });
});

$(document).on("click", ".btn-editar", function () {
    let id = $(this).data("id");

    $.get("servicio.php?editarRespuesta", { id }, function (data) {
        let r = data[0];
        $("#txtId").val(r.idRespuesta);
        $("#txtRespuesta").val(r.Respuesta);
        $("#cboPregunta").val(r.idPregunta);
    });
});

$(document).on("click", ".btn-eliminar", function () {
    if (!confirm("¿Eliminar respuesta?")) return;

    $.post("servicio.php?eliminarRespuesta",
        { txtId: $(this).data("id") },
        function (res) {
            if (res === "correcto") {
                buscarRespuestas();
            }
        }
    );
});

