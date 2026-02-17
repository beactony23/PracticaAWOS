
const cabecera_tabla =  document.getElementById("cabecera-tabla");

$("#btn-left").on("click",function(event){

    document.getElementById("cuerpo-tabla").innerHTML = ``
    
    $.get("servicio.php?PreguntasSinCurso", function ( Cursos_sin_preguntas ){
        

        cabecera_tabla.innerHTML = `<th class = 'text-center'>Cursos sin preguntas</th>`

        Cursos_sin_preguntas.forEach(curso => {
                    $("#cuerpo-tabla").append(`
            <tr>
                <td>
                    ${curso['NombreCursos']}
                </td>
            </tr>
            `
        )

            
        });
    })
})


$("#btn-valores").on("click",function ( event ){

    document.getElementById("cuerpo-tabla").innerHTML = ``

    cabecera_tabla.innerHTML = `<th class = 'text-center'>Total de valores por curso</th>`


    $.get("servicio.php?ValorPorCurso", function ( Cursos_valores ){

        Cursos_valores.forEach( suma_valor =>{

            $("#cuerpo-tabla").append(
            `
            <tr>
                <td>
                    ${suma_valor["curso_suma"]}
                </td>
            </tr>
            `
        )
        })


     

    })




})

$("#btn-promedio").on("click", function (event){

    
    document.getElementById("cuerpo-tabla").innerHTML = ``

    cabecera_tabla.innerHTML = `
    <th class = 'text-center'>ID</th>
    <th class = 'text-center'>Pregunta</th>
    <th class = 'text-center'>Valor</th>
    <th class = 'text-center'>IdCurso</th>
    `


    $.get("servicio.php?PreguntasMayorPromedio", function ( preguntas_mayor_promedio ){

        preguntas_mayor_promedio.forEach( pregunta =>{

            $("#cuerpo-tabla").append(
            `
            <tr>
                <td>
                    ${pregunta["idPregunta"]}
                </td>
                 <td>
                    ${pregunta["Pregunta"]}
                </td>
                <td>
                    ${pregunta["Valor"]}
                </td>
                <td>
                    ${pregunta["idCursos"]}
                </td>
            </tr>
            `
        )
        })


     

    })




})


$("#btn-fecha").on("click", function (event){

    
    document.getElementById("cuerpo-tabla").innerHTML = ``

    cabecera_tabla.innerHTML = `
    <th class = 'text-center'>ID</th>
    <th class = 'text-center'>Pregunta</th>
    <th class = 'text-center'>Valor</th>
    <th class = 'text-center'>IdCurso</th>
    <th class = 'text-center'>Fecha registro</th>
    `


    $.get("servicio.php?PreguntasHoy", function ( preguntas_mayor_promedio ){

        preguntas_mayor_promedio.forEach( pregunta =>{

            $("#cuerpo-tabla").append(
            `
            <tr>
                <td>
                    ${pregunta["idPregunta"]}
                </td>
                 <td>
                    ${pregunta["Pregunta"]}
                </td>
                <td>
                    ${pregunta["Valor"]}
                </td>
                <td>
                    ${pregunta["idCursos"]}
                </td>
                <td>
                    ${pregunta["HoraRegistro"]}
                </td>
            </tr>
            `
        )
        })


     

    })




})