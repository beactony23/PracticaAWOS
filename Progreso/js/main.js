// Función para cargar los datos en el formulario
function editar(data) {
    document.getElementById('id_edit').value = data.idUsuario; 
    document.getElementById('idU').value = data.idUsuario;
    document.getElementById('idU').readOnly = true; 
    document.getElementById('idP').value = data.idPregunta;
    document.getElementById('idP').readOnly = true;
    
    document.getElementById('comp').value = data.Completado;
    document.getElementById('int').value = data.Intentos;
    document.getElementById('time').value = data.Tiempo_Segundos;
    document.getElementById('fecha').value = data.Fecha;
    
    document.getElementById('btnSubmit').innerText = "Actualizar Cambios";
    document.getElementById('mensajeError').style.display = 'none';
}

document.getElementById('progresoForm').onsubmit = async (e) => {
    e.preventDefault();
    const errorDisplay = document.getElementById('mensajeError');
    errorDisplay.style.display = 'none';

    const formData = new FormData(e.target);
    const res = await fetch('api.php', { method: 'POST', body: formData });
    const result = await res.json();
    
    if(result.status === 'success') {
        e.target.reset();
        document.getElementById('id_edit').value = "";
        document.getElementById('idU').readOnly = false;
        document.getElementById('idP').readOnly = false;
        document.getElementById('btnSubmit').innerText = "Guardar Datos";
        
        await cargarTabla(); 
    } else {
        errorDisplay.innerText = result.message; 
        errorDisplay.style.display = 'block';
    }
};