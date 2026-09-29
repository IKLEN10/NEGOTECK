<?php
require_once __DIR__ . '/../config/Database.php';

/**
 * Contador general de visitas al sitio ("Vistas totales" del menú).
 *
 * Sigue la misma lógica del contador de visitas del otro proyecto:
 * una columna `vistas` que se incrementa con UPDATE +1 y se vuelve a
 * leer para mostrar el valor real. La diferencia es que aquí solo se
 * incrementa cuando models/Vista.php confirma que la visita es nueva
 * (misma persona en menos de 2 horas no suma).
 */
class ContadorSitio
{
    private const ID_CONTADOR = 1;

    private PDO $conexion;

    public function __construct()
    {
        $this->conexion = Database::obtenerConexion();
    }

    public function incrementar(): void
    {
        // Si por alguna razón la fila no existe, se crea con 1.
        $sentencia = $this->conexion->prepare('
            INSERT INTO contador_sitio (id_contador, vistas) VALUES (:id, 1)
            ON DUPLICATE KEY UPDATE vistas = vistas + 1
        ');
        $sentencia->execute(['id' => self::ID_CONTADOR]);
    }

    public function obtener(): int
    {
        $sentencia = $this->conexion->prepare(
            'SELECT vistas FROM contador_sitio WHERE id_contador = :id'
        );
        $sentencia->execute(['id' => self::ID_CONTADOR]);
        return (int) $sentencia->fetchColumn();
    }
}
