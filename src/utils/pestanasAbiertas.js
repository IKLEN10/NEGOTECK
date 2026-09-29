// Coordinación entre pestañas del mismo navegador para "usuarios activos".
//
// Como todas las pestañas comparten el mismo id de visitante, solo debe
// mandarse la señal de salida cuando se cierra la ÚLTIMA pestaña del
// sitio. Para saberlo, cada pestaña anota en localStorage que sigue
// abierta (con la hora de su última señal) y se borra al cerrarse.
//
// Una pestaña que se cerró de golpe (navegador colgado, equipo apagado)
// no alcanza a borrarse; por eso se ignoran las anotaciones con más de
// VIGENCIA_MS, la misma ventana de 90 s que usa el servidor.
const CLAVE = "negoteck_pestanas_abiertas";
const VIGENCIA_MS = 90000;

function leer() {
  try {
    const guardado = JSON.parse(window.localStorage.getItem(CLAVE) || "{}");
    const ahora = Date.now();
    const vigentes = {};
    Object.entries(guardado).forEach(([id, momento]) => {
      if (typeof momento === "number" && ahora - momento < VIGENCIA_MS) {
        vigentes[id] = momento;
      }
    });
    return vigentes;
  } catch {
    return {};
  }
}

function guardar(pestanas) {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(pestanas));
  } catch {
    // Sin almacenamiento disponible: cada pestaña se comporta como si
    // fuera la única (en el peor caso, la persona deja de contar unos
    // segundos hasta la siguiente señal de otra pestaña).
  }
}

// Id nuevo en cada carga de página (no se guarda), para que una pestaña
// duplicada o recargada nunca comparta id con otra.
export function crearIdPestana() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `p-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function marcarPestanaAbierta(idPestana) {
  const pestanas = leer();
  pestanas[idPestana] = Date.now();
  guardar(pestanas);
}

// Quita esta pestaña y devuelve true si todavía quedan otras abiertas.
export function quitarPestana(idPestana) {
  const pestanas = leer();
  delete pestanas[idPestana];
  guardar(pestanas);
  return Object.keys(pestanas).length > 0;
}
