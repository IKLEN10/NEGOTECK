<?php

/**
 * Diccionario de palabras prohibidas para el filtro de comentarios.
 *
 * Este archivo existe por separado de Validador.php para que agregar,
 * quitar o ajustar palabras sea una operación de una sola línea que no
 * requiere tocar la lógica de validación. Validador::contieneLenguajeOfensivo
 * resuelve mayúsculas/minúsculas, acentos, espacios/símbolos insertados
 * entre letras y sustituciones tipo "leet speak" (p. ej. "p0ndej0");
 * aquí las palabras se listan en minúsculas y sin acentos.
 *
 * IMPORTANTE: a diferencia de lo que decía una versión anterior de este
 * comentario, SÍ hace falta listar las variantes de género y número
 * (puto/puta/putos/putas, etc.). El emparejamiento usa límites de
 * palabra (\b) alrededor de la palabra exacta que se liste, así que una
 * "s" de plural al final ya no calza dentro de ese límite y NO se
 * detecta si solo está la forma singular. Por eso este diccionario
 * incluye las variantes más comunes de cada palabra por separado.
 *
 * Se evitaron a propósito palabras cortas o de uso cotidiano ambiguo
 * (p. ej. términos médicos, de negocios o estadísticos) para reducir
 * falsos positivos en una revista de divulgación académica.
 */
return [
    // Groserías generales
    'puto', 'puta', 'putos', 'putas', 'putita', 'putito', 'putitas', 'putitos', 'putota', 'putote', 'putazo',
    'pendejo', 'pendeja', 'pendejos', 'pendejas', 'pendejito', 'pendejita', 'pendejitos', 'pendejitas',
    'mierda', 'mierdas', 'mierdita', 'comemierda', 'comemierdas',
    'cabron', 'cabrones', 'cabrona', 'cabronas', 'cabroncito', 'cabroncita', 'cabroncitos', 'cabroncitas',
    'chinga', 'chingada', 'chingado', 'chingar', 'chingas', 'chingon', 'chingados', 'chingaderas',
    'chingatumadre', 'chinga tu madre', 'chingar a su madre',
    'verga', 'vergas', 'vergota', 'vergotas', 'verguita', 'verguilla', 'envergado',
    'joder', 'jodido', 'jodida', 'jodidos', 'jodidas', 'jodete',
    'carajo', 'carajos', 'carajito',
    'pinche', 'pinches',
    'culero', 'culera', 'culeros', 'culeras', 'culo', 'culos', 'culito', 'culazo', 'culote',
    'culiado', 'culiada',
    'hostia', 'hostias', 'hostia puta',
    'coño', 'coños', 'coñito', 'coñazo',
    'cagar', 'cagado', 'cagada', 'cagon', 'cagona', 'me cago en', 'mecagoen',
    'la puta', 'puta madre', 'cabron de mierda', 'puta de mierda', 'mierda de persona',
    'andate a la mierda', 'vete a la mierda',

    // Insultos de inteligencia / carácter
    'idiota', 'idiotas', 'idiotita', 'idiotito',
    'imbecil', 'imbeciles', 'imbecilito',
    'estupido', 'estupida', 'estupidos', 'estupidas', 'estupidito',
    'bobo', 'boba', 'bobos', 'bobas', 'bobito', 'bobita',
    'tarado', 'tarada', 'tarados', 'taradas', 'taradito',
    'baboso', 'babosa', 'babosos', 'babosas', 'babosito',
    'menso', 'mensa', 'mensos',
    'zonzo', 'zonza', 'zonzos',
    'tonto', 'tonta', 'tontos', 'tontas', 'tontito', 'tontita', 'tontolculo',
    'payaso', 'payasa', 'payasos', 'payasas',
    'gil', 'giles', 'gilito',
    'lerdo', 'lerda', 'lerdos',
    'cretino', 'cretina',
    'inutil', 'retrasado', 'retrasada', 'subnormal', 'subnormales',
    'pelotudo', 'pelotuda', 'pelotudos', 'pelotudas',
    'boludo', 'boluda', 'boludos', 'boludas', 'boludito',
    'gilipollas', 'gilipolla', 'gilipollita',
    'capullo', 'capullos', 'capullito', 'capulla',
    'weon', 'weona', 'weones',
    'guevon', 'guevona', 'guevones',
    'huevon', 'huevona', 'huevones', 'huevonada',
    'naco', 'naca', 'nacos', 'nacas',
    'malparido', 'malparida', 'malparidos',
    'maldito', 'maldita', 'malditos', 'malditas',
    'bastardo', 'bastarda', 'bastardos', 'bastardas',
    'cerdo', 'cerda', 'cerdos', 'cerdas', 'cerdito',
    'burro', 'burra', 'burros', 'burras', 'burrito',
    'rata', 'ratas', 'ratita',
    'pavito', 'pavita',

    // Insultos homófobos y de identidad
    'maricon', 'maricones', 'marica', 'mariconada', 'mariconcito', 'joto', 'jotos', 'jotito',

    // Vulgarismos sexuales
    'follar', 'pajero', 'pajera', 'cojones', 'cojonudo',
    'mamon', 'mamona', 'mamones', 'mamonas', 'mamada', 'mamadas', 'mamadita',
    'polla', 'pollas', 'pollita', 'pollon',
    'concha', 'conchas', 'conchita', 'conchuda', 'conchudo',
    'huevos', 'huevo', 'huevito',
    'picha', 'pichas', 'pichita',
    'chocho', 'chochos', 'chochito',
    'papo', 'papito', 'chirla', 'chumino', 'nabo', 'nabos', 'rabo', 'rabos',
    'pito', 'pitos', 'pitote', 'pitillo', 'pitito',
    'traga pitos', 'tragapitos', 'traga pito', 'tragapito', 'traga vergas', 'tragavergas',
    'chupa pitos', 'chupapitos', 'chupa verga', 'chupaverga', 'chupapollas',
    'lameculos', 'chupamedias', 'mamavergas',

    // Insultos sobre la madre / filiación
    'hijo de puta', 'hija de puta', 'hijos de puta', 'hijo de perra', 'hijo de su madre',
    'hijoputa', 'hijaputa', 'hijueputa',
    'hijo de la chingada', 'hija de la chingada', 'la madre que te parió',
    'imbecil de mierda', 'estupido de mierda',

    // Otros insultos comunes
    'zorra', 'zorras', 'zorrita', 'zorritas', 'zorrilla',
    'perra', 'perras', 'perrita', 'perritas', 'perrota',
    'ramera', 'rameras', 'ramerita', 'rameritas',
];
