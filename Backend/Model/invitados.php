<?php
class Invitados
{
    private $conn;
    private $table = 'invitados';

    // Propiedades
    public $id;
    public $nombre;
    public $active;

    public function __construct($db)
    {
        $this->conn = $db;
    }
}
