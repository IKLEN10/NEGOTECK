export const autores = [
  {
    id: 'a1',
    nombre: 'Dra. Camila Reyes',
    rol: 'Investigadora en Ciencias Sociales',
    avatar: 'https://i.pravatar.cc/150?img=32',
    correo: 'camila.reyes@negoteck.mx',
    biografia: 'Doctora en Sociología con más de 12 años estudiando movilidad social urbana en Latinoamérica.',
  },
  {
    id: 'a2',
    nombre: 'Mtro. Diego Fuentes',
    rol: 'Ingeniero de Software e investigador en IA',
    avatar: 'https://i.pravatar.cc/150?img=12',
    correo: 'diego.fuentes@negoteck.mx',
    biografia: 'Especialista en sistemas distribuidos y aprendizaje automático aplicado a la industria.',
  },
  {
    id: 'a3',
    nombre: 'Dra. Valentina Solís',
    rol: 'Médica epidemióloga',
    avatar: 'https://i.pravatar.cc/150?img=45',
    correo: 'valentina.solis@negoteck.mx',
    biografia: 'Enfocada en salud pública y modelos predictivos de enfermedades transmisibles.',
  },
  {
    id: 'a4',
    nombre: 'Mtro. Andrés Villar',
    rol: 'Pedagogo e investigador educativo',
    avatar: 'https://i.pravatar.cc/150?img=68',
    correo: 'andres.villar@negoteck.mx',
    biografia: 'Estudia la incorporación de tecnología en modelos de enseñanza híbrida.',
  },
  {
    id: 'a5',
    nombre: 'Dra. Renata Ibarra',
    rol: 'Bióloga ambiental',
    avatar: 'https://i.pravatar.cc/150?img=47',
    correo: 'renata.ibarra@negoteck.mx',
    biografia: 'Investiga estrategias de conservación de ecosistemas costeros.',
  },
  {
    id: 'a6',
    nombre: 'Mtro. Iker Navarro',
    rol: 'Economista',
    avatar: 'https://i.pravatar.cc/150?img=15',
    correo: 'iker.navarro@negoteck.mx',
    biografia: 'Analiza políticas de desarrollo regional y economía del emprendimiento.',
  },
]

export function obtenerAutorPorId(id) {
  return autores.find((autor) => autor.id === id)
}
