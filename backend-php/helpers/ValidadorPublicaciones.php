<?php

class ValidadorPublicacion
{
     public static function validarCantidadPalabras(string $texto, int $min = 30, int $max = 300): bool
    {
        $texto = trim($texto);
        if ($texto === '') {
            return false;
        }

        $palabras = preg_split('/\s+/', $texto);
        $cantidad = count(array_filter($palabras));

        return ($cantidad >= $min && $cantidad <= $max);
    }

    // 2. Evalúa únicamente que los caracteres sean válidos
    public static function validarCaracteresPermitidos(string $texto): bool
    {
        return preg_match('/^[\p{L}\p{N}\s.,;:()\-_"¿?¡!@#\$\/\+%&=]+$/u', $texto) === 1;
    }

    public static function validarArea(int $area): bool
    {
        return $area > 0;
    }

    public static function validarUrlVideo(string $url): bool
    {
        // Validar que sea una URL válida
        if (filter_var($url, FILTER_VALIDATE_URL) === false) {
            return false;
        }

        // Patrón para YouTube válido (con cualquier parámetro)
        // - https://www.youtube.com/watch?v=XXXXXXXXXXX
        // - https://www.youtube.com/watch?v=XXXXXXXXXXX&t=8547
        // - https://youtu.be/XXXXXXXXXXX?si=xxxx
        // - https://youtu.be/XXXXXXXXXXX?t=8547

        $patron = '/^(https?:\/\/)?(www\.|m\.)?youtube\.com\/watch\?v=[\w-]{11}.*$|^(https?:\/\/)?(www\.)?youtu\.be\/[\w-]{11}.*$/i';

        return preg_match($patron, $url) === 1;
    }
}
