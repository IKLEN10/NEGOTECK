<?php

/**
 * Estandariza la salida de todos los endpoints de la API en formato JSON.
 */
class Respuesta
{
    public static function json(array $datos, int $codigo = 200): void
    {
        http_response_code($codigo);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($datos, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function error(string $mensaje, int $codigo = 400): void
    {
        self::json(['exito' => false, 'error' => $mensaje], $codigo);
    }
}
