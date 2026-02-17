



const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function mapear_ubicacion(lat , long){


     $("#mapa").html(`
     <iframe 
            src="https://www.google.com/maps?q=${lat},${long}&z=15&output=embed"
            class="w-100" 
            height="100" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade">
            </iframe>
    `)

}

function success(pos) {
  const crd = pos.coords;

  const latitud = crd.latitude;
  const longitud = crd.longitude;

  mapear_ubicacion(latitud,longitud)

}

function generar_coordenadas(){
    const latitud = Math.random() * 180 - 90; 
    const longitud = Math.random() * 360 - 180;

    return [latitud.toFixed(2),longitud.toFixed(2)]
}

function error(err) {
  console.log(Math.random() * 10)
  console.warn(`ERROR(${err.code}): ${err.message}`);

  var coordenadas = generar_coordenadas();

  $("#latitud-solucion").val(coordenadas[0])
  $("#longitud-solucion").val(coordenadas[1])

     $("#mapa").html(`
     <iframe 
            src="https://www.google.com/maps?q=${coordenadas[0]},${coordenadas[1]}&z=15&output=embed"
            class="w-100" 
            height="100" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade">
            </iframe>
    `)
}

navigator.geolocation.getCurrentPosition(success, error, options);

document.addEventListener("DOMContentLoaded", (e)=>{

    $("#formGeo").submit(function (e) {
        e.preventDefault();
        
        navigator.geolocation.getCurrentPosition(success, error, options);
        $.post("servicio.php?VerificarCoordenadas",$(this).serialize(), function( respuesta ) {
            
            if (respuesta == "correcto"){
                $("#respuesta-id").html(`
                    <h4 class="alert alert-success">Has respondido correctamente</h1>
                    `)
                
                return
            }
            $("#respuesta-id").html(`
                    <h4 class="alert alert-danger">Respuesta incorrecta</h1>
            `)
            

        })

    });

});







