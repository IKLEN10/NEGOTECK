const imagenes = {
  social: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1000&auto=format&fit=crop',
  tecnologia: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1000&auto=format&fit=crop',
  salud: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=1000&auto=format&fit=crop',
  educacion: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop',
  ambiente: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop',
  economia: 'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?q=80&w=1000&auto=format&fit=crop',
  arte: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=1000&auto=format&fit=crop',
  datos: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
}

export const publicaciones = [
  {
    id: 'p1',
    titulo: 'Movilidad social y redes comunitarias en zonas metropolitanas',
    resumen:
      'Un análisis longitudinal sobre cómo las redes de apoyo comunitario inciden en la movilidad social intergeneracional.',
    idArea: 'ciencias-sociales',
    idAutor: 'a1',
    fecha: '2026-06-18',
    imagen: imagenes.social,
    estado: 'Aprobado',
    destacado: true,
    palabrasClave: ['movilidad social', 'redes comunitarias', 'urbanismo'],
  },
  {
    id: 'p2',
    titulo: 'Modelos de lenguaje aplicados a la revisión editorial automatizada',
    resumen:
      'Exploramos el uso de modelos de lenguaje como apoyo —no reemplazo— del proceso de revisión por pares en publicaciones científicas.',
    idArea: 'tecnologia',
    idAutor: 'a2',
    fecha: '2026-06-24',
    imagen: imagenes.tecnologia,
    estado: 'Aprobado',
    destacado: true,
    palabrasClave: ['inteligencia artificial', 'edición', 'automatización'],
  },
  {
    id: 'p3',
    titulo: 'Vigilancia epidemiológica temprana mediante datos abiertos',
    resumen:
      'Un marco metodológico para detectar brotes emergentes utilizando fuentes de datos públicas y modelos predictivos ligeros.',
    idArea: 'salud',
    idAutor: 'a3',
    fecha: '2026-05-30',
    imagen: imagenes.salud,
    estado: 'Aprobado',
    destacado: true,
    palabrasClave: ['epidemiología', 'datos abiertos', 'salud pública'],
  },
  {
    id: 'p4',
    titulo: 'Aulas híbridas: cinco años después de la transición forzada',
    resumen:
      'Revisión de literatura sobre la efectividad sostenida de los modelos híbridos de enseñanza en educación media superior.',
    idArea: 'educacion',
    idAutor: 'a4',
    fecha: '2026-06-02',
    imagen: imagenes.educacion,
    estado: 'Aprobado',
    destacado: true,
    palabrasClave: ['educación híbrida', 'pedagogía', 'tecnología educativa'],
  },
  {
    id: 'p5',
    titulo: 'Restauración de manglares como estrategia costera de bajo costo',
    resumen:
      'Evaluación de proyectos comunitarios de restauración de manglares y su impacto en la protección costera regional.',
    idArea: 'medio-ambiente',
    idAutor: 'a5',
    fecha: '2026-06-10',
    imagen: imagenes.ambiente,
    estado: 'Aprobado',
    destacado: true,
    palabrasClave: ['manglares', 'conservación', 'costas'],
  },
  {
    id: 'p6',
    titulo: 'Microfinanciamiento y crecimiento de negocios locales postpandemia',
    resumen:
      'Estudio de caso sobre el rol del microcrédito en la recuperación de pequeños negocios en zonas semiurbanas.',
    idArea: 'economia',
    idAutor: 'a6',
    fecha: '2026-04-21',
    imagen: imagenes.economia,
    estado: 'Aprobado',
    destacado: false,
    palabrasClave: ['microfinanciamiento', 'pymes', 'desarrollo local'],
  },
  {
    id: 'p7',
    titulo: 'El archivo digital como forma de memoria colectiva',
    resumen:
      'Reflexión sobre la digitalización de archivos culturales y su papel en la construcción de identidad comunitaria.',
    idArea: 'arte-y-cultura',
    idAutor: 'a1',
    fecha: '2026-03-14',
    imagen: imagenes.arte,
    estado: 'Aprobado',
    destacado: false,
    palabrasClave: ['patrimonio', 'archivo digital', 'memoria'],
  },
  {
    id: 'p8',
    titulo: 'Visualización de incertidumbre en modelos climáticos regionales',
    resumen:
      'Propuesta de técnicas gráficas para comunicar la incertidumbre estadística de proyecciones climáticas a públicos no técnicos.',
    idArea: 'ciencia-de-datos',
    idAutor: 'a2',
    fecha: '2026-05-02',
    imagen: imagenes.datos,
    estado: 'Aprobado',
    destacado: false,
    palabrasClave: ['visualización', 'clima', 'estadística'],
  },
  {
    id: 'p9',
    titulo: 'Brechas de acceso a telesalud en comunidades rurales',
    resumen:
      'Diagnóstico sobre los factores estructurales que limitan el acceso a servicios de telesalud fuera de zonas urbanas.',
    idArea: 'salud',
    idAutor: 'a3',
    fecha: '2026-02-27',
    imagen: imagenes.salud,
    estado: 'Pendiente',
    destacado: false,
    palabrasClave: ['telesalud', 'zonas rurales', 'acceso'],
  },
  {
    id: 'p10',
    titulo: 'Ciberseguridad en infraestructuras educativas públicas',
    resumen:
      'Auditoría comparativa de prácticas de ciberseguridad en instituciones educativas públicas de nivel medio.',
    idArea: 'tecnologia',
    idAutor: 'a2',
    fecha: '2026-01-19',
    imagen: imagenes.tecnologia,
    estado: 'Aprobado',
    destacado: false,
    palabrasClave: ['ciberseguridad', 'educación pública', 'infraestructura'],
  },
  {
    id: 'p11',
    titulo: 'Percepción ciudadana sobre movilidad activa en ciudades intermedias',
    resumen:
      'Encuesta y análisis cualitativo sobre la adopción de bicicleta y caminata como medios de transporte cotidiano.',
    idArea: 'ciencias-sociales',
    idAutor: 'a1',
    fecha: '2025-12-11',
    imagen: imagenes.social,
    estado: 'Aprobado',
    destacado: false,
    palabrasClave: ['movilidad activa', 'ciudad', 'transporte'],
  },
  {
    id: 'p12',
    titulo: 'Evaluación docente entre pares: percepciones y resistencias',
    resumen:
      'Estudio cualitativo sobre la aceptación de modelos de evaluación entre pares en instituciones de educación superior.',
    idArea: 'educacion',
    idAutor: 'a4',
    fecha: '2025-11-30',
    imagen: imagenes.educacion,
    estado: 'Rechazado',
    destacado: false,
    palabrasClave: ['evaluación docente', 'educación superior'],
  },
  {
    id: 'p13',
    titulo: 'Economía circular en la industria textil regional',
    resumen:
      'Casos de estudio sobre modelos de economía circular aplicados por pequeñas manufactureras textiles.',
    idArea: 'economia',
    idAutor: 'a6',
    fecha: '2025-10-08',
    imagen: imagenes.economia,
    estado: 'Aprobado',
    destacado: false,
    palabrasClave: ['economía circular', 'textil', 'sostenibilidad'],
  },
  {
    id: 'p14',
    titulo: 'Corredores biológicos urbanos: evidencia de tres capitales',
    resumen:
      'Comparación de estrategias de corredores biológicos implementadas en tres capitales latinoamericanas.',
    idArea: 'medio-ambiente',
    idAutor: 'a5',
    fecha: '2025-09-22',
    imagen: imagenes.ambiente,
    estado: 'Aprobado',
    destacado: false,
    palabrasClave: ['corredores biológicos', 'biodiversidad urbana'],
  },
  {
    id: 'p15',
    titulo: 'Curaduría digital y nuevas audiencias museísticas',
    resumen:
      'Análisis de estrategias de curaduría digital para ampliar el alcance de museos de mediana escala.',
    idArea: 'arte-y-cultura',
    idAutor: 'a1',
    fecha: '2025-08-15',
    imagen: imagenes.arte,
    estado: 'Aprobado',
    destacado: false,
    palabrasClave: ['museos', 'curaduría digital', 'audiencias'],
  },
]

// Datos de ejemplo para la sección de comentarios. Solamente ilustran cómo
// se verá el componente una vez que exista un backend real conectado.
export const comentariosEjemplo = [
  {
    id: 'c1',
    nombreUsuario: 'Fernanda Ortiz',
    avatar: 'https://i.pravatar.cc/100?img=5',
    comentario: 'Excelente artículo, muy claro en la metodología utilizada.',
    fecha: '2026-06-20',
  },
  {
    id: 'c2',
    nombreUsuario: 'Luis Herrera',
    avatar: 'https://i.pravatar.cc/100?img=8',
    comentario: 'Me gustaría ver una segunda parte con datos más recientes.',
    fecha: '2026-06-22',
  },
  {
    id: 'c3',
    nombreUsuario: 'Paola Jiménez',
    avatar: 'https://i.pravatar.cc/100?img=9',
    comentario: 'Muy útil para mi tesis, gracias por compartirlo.',
    fecha: '2026-06-25',
  },
]

export function obtenerPublicacionPorId(id) {
  return publicaciones.find((publicacion) => publicacion.id === id)
}

export function obtenerPublicacionesPorArea(idArea) {
  return publicaciones.filter((publicacion) => publicacion.idArea === idArea)
}

export function obtenerPublicacionesDestacadas() {
  return publicaciones.filter((publicacion) => publicacion.destacado)
}

export function obtenerPublicacionesRecientes(cantidad = 5) {
  return [...publicaciones]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, cantidad)
}
