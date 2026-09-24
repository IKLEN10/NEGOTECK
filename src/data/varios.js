// Valores de respaldo mientras carga la petición real a /estadisticas.php
// (o si esta falla). Los ids deben coincidir con los que devuelve
// backend-php/models/Estadistica.php y con el mapeo de
// src/components/home/BandaEstadisticas.jsx (s1-s3) y
// src/hooks/useContadoresNavbar.js (s4-s5).
export const estadisticasRevista = [
  { id: "s1", etiqueta: "Publicaciones publicadas", valor: "—" },
  { id: "s2", etiqueta: "Autores registrados", valor: "—" },
  { id: "s3", etiqueta: "Áreas de conocimiento", valor: "—" },
  { id: "s4", etiqueta: "Vistas totales", valor: "—" },
  { id: "s5", etiqueta: "Usuarios activos ahora", valor: "—" },
];

export const preguntasFrecuentes = [
  {
    id: "f1",
    pregunta: "¿Quién puede enviar una publicación?",
    respuesta:
      "Cualquier investigador, docente o estudiante de posgrado con una cuenta de autor verificada puede enviar publicaciones para su revisión editorial.",
  },
  {
    id: "f2",
    pregunta: "¿Cuánto tarda el proceso de revisión?",
    respuesta:
      "El proceso editorial simulado en esta plataforma contempla entre 4 y 6 semanas, desde el envío hasta la resolución final.",
  },
  {
    id: "f3",
    pregunta: "¿Hay costo por publicar?",
    respuesta:
      "No. NEGOTECK opera bajo un modelo de acceso abierto, sin costos de procesamiento para autores.",
  },
  {
    id: "f4",
    pregunta: "¿Puedo enviar publicaciones en coautoría?",
    respuesta:
      "Por el momento cada publicación se registra bajo un único autor responsable, asociado a la cuenta que la sube.",
  },
  {
    id: "f5",
    pregunta: "¿En qué formatos se aceptan los archivos?",
    respuesta:
      "Se aceptan documentos en formato PDF para el cuerpo del artículo y una imagen de portada en JPG o PNG.",
  },
];
