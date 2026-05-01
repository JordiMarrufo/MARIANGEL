<?php
// Configuración de la base de datos
$servername = "localhost";  // Tu servidor
$username = "root";         // Tu usuario de BD
$password = "";             // Tu contraseña
$dbname = "mariangel";      // Nombre de tu BD

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Configurar el charset a utf-8
$conn->set_charset("utf8mb4");

// Si todo está bien, la conexión está lista
echo "Conexión exitosa a la base de datos";

// Para cerrar la conexión (cuando ya no la necesites):
// $conn->close();
?>