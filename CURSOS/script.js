// Si hay un curso para editar, llenar el formulario
if (cursoEditar) {
    document.getElementById('txtid').value = cursoEditar.idCursos;
    document.getElementById('txtnombre').value = cursoEditar.NombreCursos;
    
   
    const btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.name = 'btnmodificar';
    btnGuardar.textContent = 'Modificar curso';
    
    
    const cancelarBtn = document.createElement('a');
    cancelarBtn.href = 'index.php';
    cancelarBtn.textContent = 'Cancelar';
    cancelarBtn.style.marginLeft = '10px';
    btnGuardar.parentNode.appendChild(cancelarBtn);
}