document.addEventListener("DOMContentLoaded", function () {

    if (location.search == "?reload") {
        window.location = "login.html"
    }

    $.ajaxSetup({
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`
        }
    })

    $.get(`login.php?sesion`, function (sesion) {
        if (sesion.length) {
            return
        }
    })

    document.getElementById("frmlogin").addEventListener("submit", function (event) {
    event.preventDefault();
    
    // Limpiamos errores previos y ocultamos el cuadro
    $("#mensaje-error").hide().text("");

    $.ajax({
        url: `login.php?iniciarSesion`,
        type: 'POST',
        data: $(this).serialize(),
        success: function (respuesta) {
            if (!respuesta || respuesta.includes("<")) {
                $("#mensaje-error").text("Correo o contraseña incorrectos/faltantes").fadeIn();
                return;
            }
            localStorage.setItem("jwt", respuesta);
            window.location = "index.html";
        },
        error: function (xhr) {
            // xhr.responseText contiene el texto que enviamos desde PHP ("Correo o contraseña incorrectos")
            let mensaje = xhr.responseText || "Error al iniciar sesión (Conexión)";
            $("#mensaje-error").text(mensaje).fadeIn();
        }
    });
});

})

$(document).ready(function() {
    $('#frmlogin').on('submit', function(e) {
        e.preventDefault(); // Evita que la página se recargue

        $.ajax({
            url: 'login.php?iniciarSesion',
            type: 'POST',
            data: $(this).serialize(),
            success: function(response) {
                // Si la respuesta es el token (texto plano) o un objeto con éxito
                if (typeof response === 'string' && response.length > 50) {
                    // Guardar token y redireccionar
                    localStorage.setItem('token', response);
                    window.location.href = 'dashboard.php';
                } else if (response.error) {
                    // Mostrar el texto de la variable $error de PHP
                    $('#mensaje-error').text(response.error).fadeIn();
                }
            },
            error: function() {
                $('#mensaje-error').text("Error de conexión con el servidor").fadeIn();
            }
        });
    });
});