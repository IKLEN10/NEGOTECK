<?php
require_once __DIR__ . '/../config/config.php';

/**
 * Envío real de correos para el módulo de autenticación (verificación de
 * cuenta y recuperación de contraseña). Ya NO se regresa el token en la
 * respuesta JSON del endpoint: el usuario solo puede avanzar recibiendo
 * el correo y dando clic en el enlace.
 *
 * Estrategia de envío (en este orden):
 *   1. Si MAIL_HOST tiene un valor y existe PHPMailer instalado vía Composer
 *      (backend-php/vendor/autoload.php), se envía por SMTP real con
 *      autenticación. Este es el modo recomendado para producción.
 *   2. Si no hay PHPMailer o MAIL_HOST está vacío, se usa la función mail()
 *      nativa de PHP (requiere un MTA configurado en el servidor, p. ej.
 *      sendmail en Linux o un relay SMTP configurado en php.ini en Windows).
 *   3. Si además MAIL_MODO_DESARROLLO está en true, en lugar de los pasos
 *      anteriores el correo completo se escribe en
 *      backend-php/logs/correos.log. Esto NO es una simulación del flujo de
 *      autenticación (el token real se sigue generando, guardando con hash
 *      y validando en la base de datos); es únicamente un canal de entrega
 *      alterno para poder probar en XAMPP sin un servidor SMTP a la mano.
 *      Pon MAIL_MODO_DESARROLLO en false en cuanto configures credenciales
 *      SMTP reales en config.php.
 */
class Correo
{
    public static function enviarVerificacion(string $correoDestino, string $nombre, string $token): bool
    {
        $enlace = rtrim(URL_BASE_FRONTEND, '/') . '/verificar?correo=' . rawurlencode($correoDestino) . '&token=' . rawurlencode($token);

        $asunto = 'Verifica tu cuenta - NEGOTECK';
        $cuerpoHtml = self::plantilla(
            "Hola {$nombre},",
            'Gracias por registrarte en NEGOTECK. Confirma tu correo electrónico para poder iniciar sesión y publicar tus artículos.',
            $enlace,
            'Verificar mi cuenta',
            'Este enlace y el token asociado expiran en 24 horas. Si tú no creaste esta cuenta, puedes ignorar este mensaje.'
        );

        return self::enviar($correoDestino, $asunto, $cuerpoHtml);
    }

    public static function enviarRecuperacion(string $correoDestino, string $nombre, string $token): bool
    {
        $enlace = rtrim(URL_BASE_FRONTEND, '/') . '/recuperar?correo=' . rawurlencode($correoDestino) . '&token=' . rawurlencode($token);

        $asunto = 'Recupera tu contraseña - NEGOTECK';
        $cuerpoHtml = self::plantilla(
            "Hola {$nombre},",
            'Recibimos una solicitud para restablecer tu contraseña. Si fuiste tú, da clic en el siguiente botón para elegir una nueva contraseña.',
            $enlace,
            'Restablecer mi contraseña',
            'Este enlace y el token asociado expiran en 1 hora. Si tú no solicitaste este cambio, puedes ignorar este mensaje: tu contraseña actual seguirá funcionando.'
        );

        return self::enviar($correoDestino, $asunto, $cuerpoHtml);
    }

    /**
     * Reenvía a CORREO_EMPRESA el mensaje escrito en el formulario de
     * contacto de la página principal. Usa `Reply-To` con el correo de
     * quien escribió, para que el equipo editorial pueda responder
     * directamente desde su cliente de correo.
     */
    public static function enviarContacto(string $nombre, string $correoRemitente, string $asunto, string $mensaje): bool
    {
        $asuntoCorreo = 'Nuevo mensaje de contacto: ' . $asunto;
        $cuerpoHtml = self::plantillaContacto($nombre, $correoRemitente, $asunto, $mensaje);

        return self::enviar(CORREO_EMPRESA, $asuntoCorreo, $cuerpoHtml, $correoRemitente, $nombre);
    }

    private static function plantillaContacto(string $nombre, string $correoRemitente, string $asunto, string $mensaje): string
    {
        $nombre = htmlspecialchars($nombre, ENT_QUOTES, 'UTF-8');
        $correoRemitente = htmlspecialchars($correoRemitente, ENT_QUOTES, 'UTF-8');
        $asunto = htmlspecialchars($asunto, ENT_QUOTES, 'UTF-8');
        $mensajeHtml = nl2br(htmlspecialchars($mensaje, ENT_QUOTES, 'UTF-8'));

        return <<<HTML
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color:#1f2937;">
                <p>Nuevo mensaje desde el formulario de contacto del sitio.</p>
                <p><strong>Nombre:</strong> {$nombre}<br>
                   <strong>Correo:</strong> {$correoRemitente}<br>
                   <strong>Asunto:</strong> {$asunto}</p>
                <p style="white-space:pre-line;border-left:3px solid #1d4ed8;padding-left:12px;margin-top:16px;">{$mensajeHtml}</p>
            </div>
        HTML;
    }

    private static function plantilla(string $saludo, string $texto, string $enlace, string $textoBoton, string $nota): string
    {
        $saludo = htmlspecialchars($saludo, ENT_QUOTES, 'UTF-8');
        $texto = htmlspecialchars($texto, ENT_QUOTES, 'UTF-8');
        $textoBoton = htmlspecialchars($textoBoton, ENT_QUOTES, 'UTF-8');
        $nota = htmlspecialchars($nota, ENT_QUOTES, 'UTF-8');
        $enlaceSeguro = htmlspecialchars($enlace, ENT_QUOTES, 'UTF-8');

        return <<<HTML
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color:#1f2937;">
                <p>{$saludo}</p>
                <p>{$texto}</p>
                <p style="text-align:center; margin: 28px 0;">
                    <a href="{$enlaceSeguro}" style="background:#1d4ed8;color:#ffffff;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:bold;">
                        {$textoBoton}
                    </a>
                </p>
                <p style="font-size:13px;color:#6b7280;">{$nota}</p>
                <p style="font-size:12px;color:#9ca3af;">Si el botón no funciona, copia y pega este enlace en tu navegador:<br>{$enlaceSeguro}</p>
            </div>
        HTML;
    }

    private static function enviar(
        string $destino,
        string $asunto,
        string $cuerpoHtml,
        ?string $responderA = null,
        ?string $responderANombre = null
    ): bool {
        if (MAIL_MODO_DESARROLLO) {
            return self::registrarEnLog($destino, $asunto, $cuerpoHtml);
        }

        $rutaAutoload = __DIR__ . '/../vendor/autoload.php';
        if (MAIL_HOST !== '' && file_exists($rutaAutoload)) {
            require_once $rutaAutoload;
            if (class_exists('PHPMailer\\PHPMailer\\PHPMailer')) {
                return self::enviarConPhpMailer($destino, $asunto, $cuerpoHtml, $responderA, $responderANombre);
            }
        }

        return self::enviarConMailNativo($destino, $asunto, $cuerpoHtml, $responderA);
    }

    private static function enviarConPhpMailer(
        string $destino,
        string $asunto,
        string $cuerpoHtml,
        ?string $responderA = null,
        ?string $responderANombre = null
    ): bool {
        $mail = new \PHPMailer\PHPMailer\PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host = MAIL_HOST;
            $mail->SMTPAuth = true;
            $mail->Username = MAIL_USUARIO;
            $mail->Password = MAIL_CONTRASENA;
            $mail->SMTPSecure = MAIL_CIFRADO;
            $mail->Port = MAIL_PUERTO;
            $mail->CharSet = 'UTF-8';
            // Si el servidor SMTP está lento o inalcanzable, sin este límite
            // PHPMailer puede dejar la petición colgada varios minutos (su
            // valor por defecto) antes de fallar, aunque la cuenta o el
            // token ya se hayan guardado correctamente en la base de datos.
            $mail->Timeout = 10;
            $mail->SMTPKeepAlive = false;

            $mail->setFrom(MAIL_REMITENTE, MAIL_REMITENTE_NOMBRE);
            $mail->addAddress($destino);
            if ($responderA !== null && $responderA !== '') {
                $mail->addReplyTo($responderA, $responderANombre ?? '');
            }
            $mail->isHTML(true);
            $mail->Subject = $asunto;
            $mail->Body = $cuerpoHtml;
            $mail->AltBody = strip_tags($cuerpoHtml);

            $mail->send();
            return true;
        } catch (\Throwable $excepcion) {
            error_log('Correo::enviarConPhpMailer -> ' . $excepcion->getMessage());
            return false;
        }
    }

    private static function enviarConMailNativo(string $destino, string $asunto, string $cuerpoHtml, ?string $responderA = null): bool
    {
        $cabeceras = "MIME-Version: 1.0\r\n";
        $cabeceras .= "Content-Type: text/html; charset=UTF-8\r\n";
        $cabeceras .= 'From: ' . MAIL_REMITENTE_NOMBRE . ' <' . MAIL_REMITENTE . ">\r\n";
        if ($responderA !== null && $responderA !== '') {
            $cabeceras .= 'Reply-To: ' . $responderA . "\r\n";
        }

        return @mail($destino, '=?UTF-8?B?' . base64_encode($asunto) . '?=', $cuerpoHtml, $cabeceras);
    }

    private static function registrarEnLog(string $destino, string $asunto, string $cuerpoHtml): bool
    {
        $directorio = __DIR__ . '/../logs';
        if (!is_dir($directorio)) {
            mkdir($directorio, 0775, true);
        }

        $entrada = sprintf(
            "[%s] PARA: %s | ASUNTO: %s\n%s\n%s\n",
            date('Y-m-d H:i:s'),
            $destino,
            $asunto,
            $cuerpoHtml,
            str_repeat('-', 80)
        );

        return file_put_contents($directorio . '/correos.log', $entrada, FILE_APPEND | LOCK_EX) !== false;
    }
}
