<?php

/**
 * Reglas de validación compartidas por los endpoints de autenticación
 * (registro y restablecimiento de contraseña). Centralizarlas aquí evita
 * duplicar las mismas expresiones regulares y límites de longitud en
 * varios archivos.
 */
class Validador
{
    public const NOMBRE_MIN = 2;
    public const NOMBRE_MAX = 80;
    public const APELLIDOS_MAX = 120;
    public const CORREO_MAX = 150;
    public const CONTRASENA_MIN = 8;
    public const CONTRASENA_MAX = 72;

    public const COMENTARIO_MIN = 5;
    public const COMENTARIO_MAX = 500;

    /**
     * Nombre/apellidos: solo letras (incluye acentos y Ñ), espacios,
     * apóstrofes y guiones. Sin números ni símbolos.
     */
    private const PATRON_NOMBRE = '/^[\p{L}][\p{L}\s\'\-]*$/u';

    /**
     * Caracteres que no aportan a un comentario normal en español y que
     * suelen usarse para inyectar HTML/scripts o código: < > { } * | \ ` ~ ^
     * y el símbolo de "arroba doble" no aplica aquí. Se permiten letras
     * (con acentos y Ñ), números, espacios y la puntuación habitual del
     * español: , . ; : ¡ ! ¿ ? ' " ( ) - _ / % & @ #.
     */
    private const PATRON_COMENTARIO_PERMITIDO = '/^[\p{L}\p{N}\s,.;:¡!¿?\'"()\-_\/%&@#\n\r]*$/u';

    /**
     * Sustituciones tipo "leet speak" más comunes usadas para intentar
     * evadir el filtro (p. ej. "p3nd3j0", "put0", "c4bron"). Se aplican
     * letra por letra al construir el patrón de cada palabra prohibida,
     * no al texto del usuario, para no alterar lo que se guarda.
     */
    private const EQUIVALENCIAS_EVASION = [
        'a' => 'a4@',
        'e' => 'e3',
        'i' => 'i1!',
        'o' => 'o0',
        's' => 's5$',
        't' => 't7',
        'c' => 'c(k',
        'g' => 'g9',
        'b' => 'b8',
        'n' => 'nñ',
    ];

    /**
     * Caracteres que, insertados entre letras, se usan comúnmente para
     * "romper" una palabra prohibida y evadir el filtro (p. ej.
     * "p.u.t.o", "p u t o", "p-u-t-o"). Se permite cualquier cantidad
     * (incluida cero) de estos caracteres entre cada letra de la palabra.
     */
    private const SEPARADOR_EVASION = '[\s\-_.,*+]{0,3}';

    private static ?array $palabrasProhibidas = null;

    /**
     * Diccionario de palabras prohibidas. Vive en un archivo aparte
     * (config/palabras-prohibidas.php) para que ampliarlo en el futuro
     * sea tan simple como agregar una línea, sin tocar esta clase.
     */
    private static function palabrasProhibidas(): array
    {
        if (self::$palabrasProhibidas === null) {
            self::$palabrasProhibidas = require __DIR__ . '/../config/palabras-prohibidas.php';
        }

        return self::$palabrasProhibidas;
    }

    public static function validarNombre(string $valor, int $min, int $max): ?string
    {
        $valor = trim($valor);
        $longitud = mb_strlen($valor);

        if ($valor === '') {
            return 'Este campo es obligatorio.';
        }
        if ($longitud < $min) {
            return "Debe tener al menos {$min} caracteres.";
        }
        if ($longitud > $max) {
            return "No puede superar los {$max} caracteres.";
        }
        if (!preg_match(self::PATRON_NOMBRE, $valor)) {
            return 'Solo se permiten letras, espacios, guiones y apóstrofes (sin números ni símbolos).';
        }

        return null;
    }

    public static function validarCorreo(string $correo): ?string
    {
        $correo = trim($correo);

        if ($correo === '') {
            return 'El correo electrónico es obligatorio.';
        }
        if (mb_strlen($correo) > self::CORREO_MAX) {
            return 'El correo electrónico es demasiado largo.';
        }
        if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
            return 'El formato del correo electrónico no es válido.';
        }

        return null;
    }

    /**
     * Contraseña segura: longitud mínima/máxima, al menos una mayúscula,
     * una minúscula, un número y un carácter especial.
     */
    public static function validarContrasena(string $contrasena): ?string
    {
        $longitud = mb_strlen($contrasena);

        if ($contrasena === '') {
            return 'La contraseña es obligatoria.';
        }
        if ($longitud < self::CONTRASENA_MIN) {
            return 'La contraseña debe tener al menos ' . self::CONTRASENA_MIN . ' caracteres.';
        }
        if ($longitud > self::CONTRASENA_MAX) {
            return 'La contraseña no puede superar los ' . self::CONTRASENA_MAX . ' caracteres.';
        }
        if (!preg_match('/[A-Z]/', $contrasena)) {
            return 'La contraseña debe incluir al menos una letra mayúscula.';
        }
        if (!preg_match('/[a-z]/', $contrasena)) {
            return 'La contraseña debe incluir al menos una letra minúscula.';
        }
        if (!preg_match('/[0-9]/', $contrasena)) {
            return 'La contraseña debe incluir al menos un número.';
        }
        if (!preg_match('/[^A-Za-z0-9]/', $contrasena)) {
            return 'La contraseña debe incluir al menos un carácter especial.';
        }

        return null;
    }

    /**
     * Valida el contenido de un comentario: longitud, espacios, caracteres
     * potencialmente peligrosos y lenguaje ofensivo. Se espera que
     * `$contenido` ya venga con espacios al inicio/fin recortados
     * (trim), pero la función es defensiva por si no es así.
     */
    public static function validarComentario(string $contenido): ?string
    {
        $contenido = trim($contenido);
        $longitud = mb_strlen($contenido);

        if ($contenido === '') {
            return 'El comentario no puede estar vacío.';
        }
        if ($longitud < self::COMENTARIO_MIN) {
            return 'El comentario debe tener al menos ' . self::COMENTARIO_MIN . ' caracteres.';
        }
        if ($longitud > self::COMENTARIO_MAX) {
            return 'El comentario no puede superar los ' . self::COMENTARIO_MAX . ' caracteres.';
        }
        if (!preg_match(self::PATRON_COMENTARIO_PERMITIDO, $contenido)) {
            return 'El comentario contiene caracteres no permitidos.';
        }
        if (self::contieneLenguajeOfensivo($contenido)) {
            return 'Tu comentario contiene lenguaje no permitido.';
        }

        return null;
    }

    /**
     * Detecta lenguaje ofensivo tolerando los intentos de evasión más
     * comunes: mayúsculas/minúsculas, acentos, letras repetidas
     * ("puuuuto"), separadores entre letras ("p.u.t.o", "p u t o") y
     * sustituciones tipo "leet speak" ("p0ndej0", "c4bron").
     *
     * Cada palabra prohibida se convierte en una expresión regular que
     * conserva los límites de palabra (\b) al inicio y al final, por lo
     * que términos legítimos que solo *contienen* una palabra prohibida
     * como subcadena (p. ej. "computadora" o "diputado" contienen
     * "puta"/"puto") no generan falsos positivos: el límite de palabra
     * exige que el carácter justo antes/después de la coincidencia no
     * sea una letra, y en esos ejemplos sí lo es.
     */
    private static function contieneLenguajeOfensivo(string $contenido): bool
    {
        $normalizado = self::quitarAcentos(mb_strtolower($contenido));

        foreach (self::palabrasProhibidas() as $palabra) {
            $patron = self::construirPatronEvasion($palabra);
            if (preg_match($patron, $normalizado)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Construye, para una palabra base (en minúsculas y sin acentos),
     * una expresión regular que acepta letras repetidas, separadores
     * insertados entre letras y sustituciones "leet speak", sin perder
     * los límites de palabra al inicio y al final del término completo.
     */
    private static function construirPatronEvasion(string $palabra): string
    {
        $palabra = self::quitarAcentos(mb_strtolower($palabra));
        $letras = preg_split('//u', $palabra, -1, PREG_SPLIT_NO_EMPTY);

        $segmentos = array_map(function (string $letra): string {
            if ($letra === ' ') {
                // Un espacio literal dentro de la palabra prohibida
                // (p. ej. "hijo de puta") se trata como separador flexible.
                return self::SEPARADOR_EVASION;
            }

            $equivalencias = self::EQUIVALENCIAS_EVASION[$letra] ?? $letra;
            $clase = preg_quote($equivalencias, '/');

            // Clase de caracteres con la letra y sus posibles sustitutos,
            // permitiendo que se repita (p. ej. "puuuuuto").
            return '[' . $clase . ']+';
        }, $letras);

        $patron = implode(self::SEPARADOR_EVASION, $segmentos);

        return '/\b' . $patron . '\b/u';
    }

    private static function quitarAcentos(string $texto): string
    {
        $mapa = [
            'á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u',
            'à' => 'a', 'è' => 'e', 'ì' => 'i', 'ò' => 'o', 'ù' => 'u',
            'ñ' => 'n',
        ];

        return strtr($texto, $mapa);
    }
}
