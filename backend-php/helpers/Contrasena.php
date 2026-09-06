<?php
require_once __DIR__ . '/../config/config.php';

/**
 * Punto único donde se decide cómo se guardan y comparan las contraseñas.
 *
 * CONTRASENA_USAR_HASH (config/config.php) controla cómo se guardan las
 * contraseñas NUEVAS: con `true`, crearHash() siempre aplica
 * password_hash()/BCRYPT.
 *
 * verificar() es compatible hacia atrás por diseño: detecta si el valor
 * guardado ya es un hash BCRYPT (prefijo $2y$/$2a$/$2b$) y en ese caso usa
 * password_verify(); si no lo es (cuentas de prueba sembradas cuando el
 * cifrado estaba apagado, con la contraseña en texto plano), compara tal
 * cual. Así, activar el cifrado no rompe el login de las cuentas de
 * prueba existentes: siguen funcionando con su valor en texto plano hasta
 * que el usuario cambie su contraseña, momento en el que queda cifrada.
 *
 * Todo el resto del backend SIEMPRE llama a
 * Contrasena::crearHash()/verificar(), nunca a
 * password_hash()/password_verify() directamente.
 */
class Contrasena
{
    public static function crearHash(string $contrasenaPlano): string
    {
        if (CONTRASENA_USAR_HASH) {
            return password_hash($contrasenaPlano, PASSWORD_BCRYPT);
        }

        return $contrasenaPlano;
    }

    public static function verificar(string $contrasenaPlano, string $valorGuardado): bool
    {
        if (self::esHashBcrypt($valorGuardado)) {
            return password_verify($contrasenaPlano, $valorGuardado);
        }

        return hash_equals($valorGuardado, $contrasenaPlano);
    }

    private static function esHashBcrypt(string $valor): bool
    {
        return (bool) preg_match('/^\$2[aby]\$/', $valor);
    }
}
