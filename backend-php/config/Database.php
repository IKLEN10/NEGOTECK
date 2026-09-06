<?php
require_once __DIR__ . '/config.php';

/**
 * Conexión única a la base de datos mediante PDO.
 * Toda la capa de modelos reutiliza esta misma conexión.
 */
class Database
{
    private static ?PDO $instancia = null;

    public static function obtenerConexion(): PDO
    {
        if (self::$instancia === null) {
            $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;

            try {
                self::$instancia = new PDO($dsn, DB_USER, DB_PASS, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]);
            } catch (PDOException $excepcion) {
                http_response_code(500);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'exito' => false,
                    'error' => 'No fue posible conectar con la base de datos.',
                ]);
                exit;
            }
        }

        return self::$instancia;
    }
}
