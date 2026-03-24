// Cargar datos desde datos.php
fetch('datos.php')
    .then(response => response.json())
    .then(data => {
        // Llenar tabla con los cursos
        const tbody = document.getElementById('tablaCursos');
        
        if (data.cursos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center">No hay cursos registrados</td></tr>';
        } else {
            let html = '';
            data.cursos.forEach(curso => {
                html += `
                    <tr>
                        <td>${curso.idCursos}</td>
                        <td>${curso.NombreCursos}</td>
                        <td>
                            <a href="index.php?id_mod=${curso.idCursos}" class="btn btn-warning btn-sm">MODIFICAR</a>
                            <a href="index.php?id=${curso.idCursos}" class="btn btn-danger btn-sm" onclick="return confirm('¿Eliminar?')">ELIMINAR</a>
                        </td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;
        }
        
        // Si hay un curso para editar, llenar el formulario
        if (data.editar) {
            document.getElementById('txtid').value = data.editar.idCursos;
            document.getElementById('txtnombre').value = data.editar.NombreCursos;
            
            const btnGuardar = document.getElementById('btnGuardar');
            btnGuardar.name = 'btnmodificar';
            btnGuardar.textContent = 'Modificar curso';
            btnGuardar.className = 'btn btn-warning';
            
            const cancelarBtn = document.createElement('a');
            cancelarBtn.href = 'index.php';
            cancelarBtn.textContent = 'Cancelar';
            cancelarBtn.className = 'btn btn-secondary ms-2';
            btnGuardar.parentNode.appendChild(cancelarBtn);
        }
    });