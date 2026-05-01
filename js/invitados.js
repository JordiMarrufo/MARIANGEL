// URL base del controlador
const baseURL = '../Controllers/INVITADOSCONTROLLER.php';

// Instancia del controlador (simulada con llamadas AJAX)
class InvitadosAPI {
    async crear(id, nombre, active) {
        return this.enviarPeticion('crear', { id, nombre, active });
    }

    async obtenerTodos() {
        return this.enviarPeticion('obtenerTodos');
    }

    async obtenerPorId(id) {
        return this.enviarPeticion('obtenerPorId', { id });
    }

    async actualizar(id, nombre, active) {
        return this.enviarPeticion('actualizar', { id, nombre, active });
    }

    async eliminar(id) {
        return this.enviarPeticion('eliminar', { id });
    }

    async enviarPeticion(accion, datos = {}) {
        try {
            const response = await fetch(baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ accion, ...datos })
            });
            return await response.json();
        } catch (error) {
            console.error('Error en petición:', error);
            return { error: error.message };
        }
    }
}

const api = new InvitadosAPI();
let invitadoEnEdicion = null;

// Cargar invitados al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarInvitados();
    
    // Eventos del formulario
    document.getElementById('formularioInvitado').addEventListener('submit', handleSubmitFormulario);
    document.getElementById('btnLimpiar').addEventListener('click', limpiarFormulario);
});

// Cargar todos los invitados
async function cargarInvitados() {
    try {
        const resultado = await api.obtenerTodos();
        const tbody = document.getElementById('tbody-invitados');
        tbody.innerHTML = '';

        if (resultado.error) {
            tbody.innerHTML = '<tr><td colspan="4">Error al cargar invitados</td></tr>';
            return;
        }

        resultado.forEach(invitado => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${invitado.id}</td>
                <td>${invitado.nombre}</td>
                <td>${invitado.active == 1 ? '✓ Activo' : '✗ Inactivo'}</td>
                <td class="actions">
                    <button onclick="editarInvitado('${invitado.id}', '${invitado.nombre}', ${invitado.active})" class="btn-secondary">Editar</button>
                    <button onclick="eliminarInvitado('${invitado.id}')" class="btn-danger">Eliminar</button>
                </td>
            `;
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Manejar envío del formulario (crear o actualizar)
async function handleSubmitFormulario(e) {
    e.preventDefault();

    const id = document.getElementById('id').value;
    const nombre = document.getElementById('nombre').value;
    const active = document.getElementById('active').checked ? 1 : 0;

    try {
        let resultado;

        if (invitadoEnEdicion) {
            // Actualizar
            resultado = await api.actualizar(id, nombre, active);
            if (!resultado.error) {
                alert('Invitado actualizado correctamente');
            }
        } else {
            // Crear
            resultado = await api.crear(id, nombre, active);
            if (!resultado.error) {
                alert('Invitado creado correctamente');
            }
        }

        if (resultado.error) {
            alert('Error: ' + resultado.error);
        } else {
            limpiarFormulario();
            cargarInvitados();
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Editar invitado
async function editarInvitado(id, nombre, active) {
    document.getElementById('id').value = id;
    document.getElementById('nombre').value = nombre;
    document.getElementById('active').checked = active == 1;
    document.getElementById('btnSubmit').textContent = 'Actualizar Invitado';
    invitadoEnEdicion = id;
    document.getElementById('id').disabled = true;
}

// Eliminar invitado
async function eliminarInvitado(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este invitado?')) {
        try {
            const resultado = await api.eliminar(id);
            if (!resultado.error) {
                alert('Invitado eliminado correctamente');
                cargarInvitados();
            } else {
                alert('Error: ' + resultado.error);
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('formularioInvitado').reset();
    document.getElementById('btnSubmit').textContent = 'Crear Invitado';
    document.getElementById('id').disabled = false;
    invitadoEnEdicion = null;
}