// URL base del controlador
const baseURL = "../Controllers/INVITADOSCONTROLLER.php";

// Instancia del controlador (simulada con llamadas AJAX)
class InvitadosAPI {
  async crear(nombre) {
    return this.enviarPeticion("crear", { nombre });
  }

  async obtenerTodos() {
    return this.enviarPeticion("obtenerTodos");
  }

  async obtenerPorId(id) {
    return this.enviarPeticion("obtenerPorId", { id });
  }

  async actualizar(id, nombre) {
    return this.enviarPeticion("actualizar", { id, nombre });
  }

  async eliminar(id) {
    return this.enviarPeticion("eliminar", { id });
  }

  async enviarPeticion(accion, datos = {}) {
    try {
      const response = await fetch(baseURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accion, ...datos }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error en petición:", error);
      return { error: error.message };
    }
  }
}

const api = new InvitadosAPI();
let invitadoEnEdicion = null;

// Cargar invitados al iniciar
document.addEventListener("DOMContentLoaded", () => {
  cargarInvitados();

  // Eventos del formulario
  document
    .getElementById("formularioInvitado")
    .addEventListener("submit", handleSubmitFormulario);
  document
    .getElementById("btnLimpiar")
    .addEventListener("click", limpiarFormulario);
});

// Cargar todos los invitados
async function cargarInvitados() {
  try {
    const resultado = await api.obtenerTodos();
    const tbody = document.getElementById("tbody-invitados");
    tbody.innerHTML = "";

    if (resultado.error) {
      tbody.innerHTML =
        '<tr><td colspan="3">Error al cargar invitados</td></tr>';
      return;
    }

    resultado.forEach((invitado) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
                <td data-label="ID">${invitado.id}</td>
                <td data-label="Nombre">${invitado.nombre}</td>
                <td data-label="Acciones" class="actions">
                    <button onclick="abrirInvitacion('${invitado.id}')" class="btn-secondary">Ver Invitación</button>
                    <button onclick="compartirInvitacion('${invitado.id}')" class="btn-secondary">Compartir</button>
                    <button onclick="editarInvitado('${invitado.id}', '${invitado.nombre}')" class="btn-secondary">Editar</button>
                    <button onclick="eliminarInvitado('${invitado.id}')" class="btn-danger">Eliminar</button>
                </td>
            `;
      tbody.appendChild(fila);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

// Función para abrir la invitación en una ventana nueva
function abrirInvitacion(id) {
  window.open(`../../Invitacion.html?id=${id}`, "_blank");
}

// Función para compartir la invitación
function compartirInvitacion(id) {
  const enlace = `${window.location.origin}/Invitacion.html?id=${id}`;

  // Si el dispositivo soporta Web Share API (móviles)
  if (navigator.share) {
    navigator
      .share({
        title: "Invitación XV Años de Mariangel",
        text: "Te invito a mis XV años",
        url: enlace,
      })
      .catch((error) => console.log("Error al compartir:", error));
  } else {
    // Copiar al portapapeles
    navigator.clipboard
      .writeText(enlace)
      .then(() => {
        alert("Enlace copiado al portapapeles");
      })
      .catch((err) => {
        alert("No se pudo copiar el enlace");
      });
  }
}

// Manejar envío del formulario (crear o actualizar)
async function handleSubmitFormulario(e) {
  e.preventDefault();

  const inputNombre = document.getElementById("nombre");

  if (!inputNombre) {
    console.error("No existe el input #nombre");
    return;
  }

  const nombre = inputNombre.value;

  try {
    let resultado;

    if (invitadoEnEdicion) {
      // Actualizar
      resultado = await api.actualizar(invitadoEnEdicion, nombre);
      if (!resultado.error) {
        alert("Invitado actualizado correctamente");
      }
    } else {
      // Crear - el ID se genera automáticamente en el backend
      resultado = await api.crear(nombre);
      if (!resultado.error) {
        alert("Invitado creado correctamente con ID: " + resultado.id);
      }
    }

    if (resultado.error) {
      alert("Error: " + resultado.error);
    } else {
      limpiarFormulario();
      cargarInvitados();
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Editar invitado
async function editarInvitado(id, nombre) {
  document.getElementById("nombre").value = nombre;
  document.getElementById("btnSubmit").textContent = "Actualizar Invitado";
  invitadoEnEdicion = id;
}

// Eliminar invitado
async function eliminarInvitado(id) {
  if (confirm("¿Estás seguro de que deseas eliminar este invitado?")) {
    try {
      const resultado = await api.eliminar(id);
      if (!resultado.error) {
        alert("Invitado eliminado correctamente");
        cargarInvitados();
      } else {
        alert("Error: " + resultado.error);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  }
}

// Limpiar formulario
function limpiarFormulario() {
  document.getElementById("formularioInvitado").reset();
  document.getElementById("btnSubmit").textContent = "Crear Invitado";
  invitadoEnEdicion = null;
}
