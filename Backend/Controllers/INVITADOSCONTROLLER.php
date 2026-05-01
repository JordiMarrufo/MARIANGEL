<?php
// Establece header PRIMERO, antes de cualquier require
header('Content-Type: application/json');
ob_start(); // Inicia buffering para capturar cualquier output no deseado

try {
    require_once '../Model/invitados.php';
    require_once '../Coneccion/conect.php';

    // Verifica que la conexión exista
    if (!isset($conn) || !$conn) {
        throw new Exception('Error de conexión a base de datos');
    }

    class InvitadosController
    {
        private $invitados;
        private $conn;

        public function __construct($db)
        {
            $this->conn = $db;
            $this->invitados = new Invitados($db);
        }

        // CREATE
        public function crear($id, $nombre, $active)
        {
            $this->invitados->id = $id;
            $this->invitados->nombre = $nombre;
            $this->invitados->active = $active;

            // Sanitizar
            $this->invitados->id = htmlspecialchars(strip_tags($this->invitados->id));
            $this->invitados->nombre = htmlspecialchars(strip_tags($this->invitados->nombre));
            $this->invitados->active = htmlspecialchars(strip_tags($this->invitados->active));

            $query = "INSERT INTO invitados (id, nombre, active) VALUES (?, ?, ?)";
            $stmt = $this->conn->prepare($query);
            if (!$stmt) {
                throw new Exception('Error en prepare: ' . $this->conn->error);
            }
            return $stmt->execute([$this->invitados->id, $this->invitados->nombre, $this->invitados->active]);
        }

        // READ - Obtener todos
        public function obtenerTodos()
        {
            $query = "SELECT * FROM invitados";
            $result = $this->conn->query($query);
            if (!$result) {
                throw new Exception('Error en query: ' . $this->conn->error);
            }
            return $result->fetch_all(MYSQLI_ASSOC);
        }

        // READ - Obtener por ID
        public function obtenerPorId($id)
        {
            $id = htmlspecialchars(strip_tags($id));
            $query = "SELECT * FROM invitados WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            if (!$stmt) {
                throw new Exception('Error en prepare: ' . $this->conn->error);
            }
            $stmt->execute([$id]);
            return $stmt->get_result()->fetch_assoc();
        }

        // UPDATE
        public function actualizar($id, $nombre, $active)
        {
            $this->invitados->id = htmlspecialchars(strip_tags($id));
            $this->invitados->nombre = htmlspecialchars(strip_tags($nombre));
            $this->invitados->active = htmlspecialchars(strip_tags($active));

            $query = "UPDATE invitados SET nombre = ?, active = ? WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            if (!$stmt) {
                throw new Exception('Error en prepare: ' . $this->conn->error);
            }
            return $stmt->execute([$this->invitados->nombre, $this->invitados->active, $this->invitados->id]);
        }

        // DELETE
        public function eliminar($id)
        {
            $id = htmlspecialchars(strip_tags($id));
            $query = "DELETE FROM invitados WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            if (!$stmt) {
                throw new Exception('Error en prepare: ' . $this->conn->error);
            }
            return $stmt->execute([$id]);
        }
    }

    // Manejo de peticiones AJAX
    ob_clean(); // Limpia cualquier output previo
    
    $data = json_decode(file_get_contents('php://input'), true);
    $accion = $data['accion'] ?? '';

    if (empty($accion)) {
        throw new Exception('Acción no especificada');
    }

    $controller = new InvitadosController($conn);

    switch ($accion) {
        case 'crear':
            $resultado = $controller->crear($data['id'], $data['nombre'], $data['active']);
            echo json_encode(['success' => $resultado]);
            break;
        case 'obtenerTodos':
            $resultado = $controller->obtenerTodos();
            echo json_encode($resultado);
            break;
        case 'obtenerPorId':
            $resultado = $controller->obtenerPorId($data['id']);
            echo json_encode($resultado);
            break;
        case 'actualizar':
            $resultado = $controller->actualizar($data['id'], $data['nombre'], $data['active']);
            echo json_encode(['success' => $resultado]);
            break;
        case 'eliminar':
            $resultado = $controller->eliminar($data['id']);
            echo json_encode(['success' => $resultado]);
            break;
        default:
            throw new Exception('Acción no válida: ' . $accion);
    }

} catch (Exception $e) {
    ob_clean();
    echo json_encode(['error' => $e->getMessage()]);
}