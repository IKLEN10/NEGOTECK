export const areas = [
  {
    id: 'administracion',
    nombre: 'Administración',
    resumenBreve: 'Dirección, estrategia y gestión de organizaciones.',
    descripcion:
      'Contenido sobre planeación estratégica, liderazgo, recursos humanos, emprendimiento y administración de organizaciones públicas y privadas.',
    imagen: '/imagenes/administracion.jpg',
    color: 'azulRey',
    cantidad: 0,
  },
  {
    id: 'economia',
    nombre: 'Economía',
    resumenBreve: 'Mercados, desarrollo y análisis económico.',
    descripcion:
      'Investigaciones y análisis sobre economía, políticas públicas, desarrollo regional, mercados y comportamiento económico.',
    imagen: '/imagenes/economia.jpg',
    color: 'naranja',
    cantidad: 0,
  },
  {
    id: 'contabilidad-finanzas',
    nombre: 'Contabilidad y Finanzas',
    resumenBreve: 'Información financiera, costos e inversión.',
    descripcion:
      'Artículos sobre contabilidad, auditoría, impuestos, presupuestos, costos, inversiones y administración financiera.',
    imagen: '/imagenes/contabilidad-finanzas.jpg',
    color: 'verde',
    cantidad: 0,
  },
  {
    id: 'mercadotecnia-logistica-marketing-digital',
    nombre: 'Mercadotecnia y Logística – Marketing digital',
    resumenBreve: 'Mercados, distribución y estrategias digitales.',
    descripcion:
      'Estudios sobre mercadotecnia, comportamiento del consumidor, logística, cadenas de suministro, comercio y marketing digital.',
    imagen: '/imagenes/mercadotecnia-logistica.jpg',
    color: 'naranja',
    cantidad: 0,
  },
  {
    id: 'comercio-internacional-comercio-electronico',
    nombre: 'Comercio Internacional y Comercio electrónico',
    resumenBreve: 'Negocios globales y operaciones digitales.',
    descripcion:
      'Contenido sobre importaciones, exportaciones, tratados comerciales, negocios internacionales, plataformas digitales y comercio electrónico.',
    imagen: '/imagenes/comercio-internacional.jpg',
    color: 'azulRey',
    cantidad: 0,
  },
  {
    id: 'tecnologias-informacion-bi-big-data-data-mining',
    nombre: 'Tecnologías de Información, Business Intelligence, Big Data, Data Mining, etc.',
    resumenBreve: 'Software, datos e inteligencia para los negocios.',
    descripcion:
      'Investigaciones sobre tecnologías de información, desarrollo de software, Business Intelligence, Big Data, minería de datos, inteligencia artificial y transformación digital.',
    imagen: '/imagenes/tecnologias-informacion.jpg',
    color: 'azulRey',
    cantidad: 0,
  },
  {
    id: 'gestion-conocimiento-innovacion',
    nombre: 'Gestión de Conocimiento e Innovación',
    resumenBreve: 'Aprendizaje organizacional y creación de valor.',
    descripcion:
      'Artículos sobre gestión del conocimiento, innovación, creatividad, transferencia tecnológica y aprendizaje organizacional.',
    imagen: '/imagenes/gestion-conocimiento-innovacion.jpg',
    color: 'verde',
    cantidad: 0,
  },
  {
    id: 'ingenieria',
    nombre: 'Ingeniería',
    resumenBreve: 'Diseño, procesos y soluciones tecnológicas.',
    descripcion:
      'Investigaciones y proyectos relacionados con ingeniería, optimización de procesos, automatización, manufactura, energía y desarrollo tecnológico.',
    imagen: '/imagenes/ingenieria.jpg',
    color: 'naranja',
    cantidad: 0,
  },
]

export function obtenerAreaPorId(id) {
  return areas.find((area) => area.id === id)
}
