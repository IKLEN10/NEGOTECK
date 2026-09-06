<?php

/**
 * Genera y da forma a los tokens usados por el módulo de autenticación
 * (registro, sesión y recuperación de contraseña).
 *
 * Los tokens NUNCA se guardan en texto plano en la base de datos: se
 * guarda su hash SHA-256 (columna `token_hash`) y se compara contra el
 * hash del valor recibido. Así, aunque alguien lea la base de datos, no
 * puede reconstruir el token original.
 */
class Token
{
    /**
     * Token corto legible (8 caracteres hex en mayúsculas), usado para
     * verificación de registro y para recuperación de contraseña, donde
     * un humano puede necesitar copiarlo/escribirlo.
     */
    public static function generarCorto(): string
    {
        return strtoupper(bin2hex(random_bytes(4)));
    }

    /**
     * Token largo (64 caracteres hex) usado como token de acceso/sesión
     * (equivalente al JWT del prototipo original, pero validado contra
     * la tabla `tokens_login` en lugar de firmarse/verificarse por sí solo).
     */
    public static function generarLargo(): string
    {
        return bin2hex(random_bytes(32));
    }

    public static function hash(string $valor): string
    {
        return hash('sha256', $valor);
    }

    /**
     * Devuelve una fecha DATETIME (formato MySQL) `$horas` horas en el futuro.
     */
    public static function expiracionHoras(float $horas): string
    {
        return (new DateTime())
            ->modify('+' . (int) round($horas * 60) . ' minutes')
            ->format('Y-m-d H:i:s');
    }
}
