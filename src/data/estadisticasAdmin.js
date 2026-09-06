// Helpers de solo lectura para el panel del Administrador General.
// Reutilizan los mismos datos de ejemplo (publicaciones, áreas, autores)
// que ya usa el panel del autor; cuando exista backend, estas funciones se
// pueden reemplazar por llamadas a servicioEstadisticas / servicioPublicaciones
// sin tocar las páginas que las consumen.
import { publicaciones } from './publicaciones'
import { areas, obtenerAreaPorId } from './areas'
import { autores, obtenerAutorPorId } from './autores'

export function obtenerPublicacionesConDetalle() {
  return [...publicaciones]
    .map((p) => ({
      ...p,
      area: obtenerAreaPorId(p.idArea),
      autor: obtenerAutorPorId(p.idAutor),
    }))
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
}

export function calcularEstadisticasGenerales() {
  return {
    total: publicaciones.length,
    pendientes: publicaciones.filter((p) => p.estado === 'Pendiente').length,
    aprobadas: publicaciones.filter((p) => p.estado === 'Aprobado').length,
    rechazadas: publicaciones.filter((p) => p.estado === 'Rechazado').length,
    totalAutores: autores.length,
  }
}

export function calcularPublicacionesPorArea() {
  return areas
    .map((area) => ({
      ...area,
      total: publicaciones.filter((p) => p.idArea === area.id).length,
    }))
    .sort((a, b) => b.total - a.total)
}

export function calcularPublicacionesPorAutor() {
  return autores
    .map((autor) => {
      const propias = publicaciones.filter((p) => p.idAutor === autor.id)
      return {
        ...autor,
        total: propias.length,
        pendientes: propias.filter((p) => p.estado === 'Pendiente').length,
        aprobadas: propias.filter((p) => p.estado === 'Aprobado').length,
      }
    })
    .sort((a, b) => b.total - a.total)
}

// Genera una bitácora simulada a partir de las publicaciones más
// recientes; sirve para ilustrar el centro de actividad del dashboard
// mientras no exista un endpoint real de auditoría.
export function obtenerActividadReciente(limite = 6) {
  return obtenerPublicacionesConDetalle()
    .slice(0, limite)
    .map((p) => {
      const acciones = {
        Pendiente: 'envió una nueva publicación para revisión',
        Aprobado: 'tiene una publicación aprobada',
        Rechazado: 'tiene una publicación rechazada',
      }
      return {
        id: p.id,
        texto: `${p.autor?.nombre || 'Un autor'} ${acciones[p.estado] || 'actualizó una publicación'}: "${p.titulo}".`,
        fecha: p.fecha,
        estado: p.estado,
      }
    })
}
