
    $.ajaxSetup({
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`
        }
    });

    $.get("Login.php?sesion", function(respuesta) {

        if (!respuesta || respuesta.length === 0) {
            window.location.replace("Login.html");
        } else {
            document.body.style.display = "block";
        }

    });

