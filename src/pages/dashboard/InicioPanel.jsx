import { CheckCircle2, Clock, FileText, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { obtenerDashboard } from "../../services/servicioEstadisticas";
import TarjetaEstadistica from "../../components/dashboard/TarjetaEstadistica";
import Insignia from "../../components/common/Insignia";

export default function InicioPanel() {
  const [usuario, setUsuario] = useState(null);
  const [misPublicaciones, setMisPublicaciones] = useState([]);
  const [totales, setTotales] = useState({
    total: 0,
    aprobadas: 0,
    pendientes: 0,
    rechazadas: 0,
  });
  const [actividad, setActividad] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const { usuario, estadisticas, publicaciones, actividad } =
        await obtenerDashboard();
      setUsuario(usuario);
      setTotales(estadisticas);
      setMisPublicaciones(publicaciones);
      setActividad(actividad);
      setError(null);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-tinta/55">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-naranja-200 bg-naranja-50 p-4">
        <p className="text-naranja-900">Error: {error}</p>
        <button
          onClick={cargarDatos}
          className="mt-2 text-sm text-naranja-600 hover:text-naranja-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="antetitulo">Panel del autor</p>
      <h1 className="mt-3 font-display text-2xl font-medium text-tinta sm:text-3xl">
        Hola, {usuario?.nombre} 👋
      </h1>
      <p className="mt-2 text-sm text-tinta/55">
        Este es el resumen de tu actividad editorial.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <TarjetaEstadistica
          icono={FileText}
          etiqueta="Total de publicaciones"
          valor={totales.total}
          tono="neutro"
        />
        <TarjetaEstadistica
          icono={CheckCircle2}
          etiqueta="Aprobadas"
          valor={totales.aprobadas}
          tono="azulRey"
        />
        <TarjetaEstadistica
          icono={Clock}
          etiqueta="Pendientes"
          valor={totales.pendientes}
          tono="verde"
        />
        <TarjetaEstadistica
          icono={XCircle}
          etiqueta="Rechazadas"
          valor={totales.rechazadas}
          tono="naranja"
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-card border border-tinta/10 bg-papel-suave p-5 shadow-soft">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-tinta/45">
            Publicaciones recientes
          </p>
          <div className="mt-4 flex flex-col divide-y divide-tinta/10">
            {misPublicaciones.length > 0 ? (
              misPublicaciones.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-tinta">
                      {p.titulo}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-tinta/45">
                      {p.area?.nombre} · {p.fecha}
                    </p>
                  </div>
                  <Insignia estado={p.estado}>{p.estado}</Insignia>
                </div>
              ))
            ) : (
              <p className="py-4 text-sm text-tinta/55">No hay publicaciones</p>
            )}
          </div>
        </div>

        <div className="rounded-card border border-tinta/10 bg-papel-suave p-5 shadow-soft">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-tinta/45">
            Actividad reciente
          </p>
          <div className="mt-4 flex flex-col gap-4">
            {actividad.length > 0 ? (
              actividad.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-azulRey-500" />
                  <div>
                    <p className="text-sm text-tinta/75">{a.texto}</p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-tinta/40">
                      {a.tiempo}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-tinta/55">No hay actividad reciente</p>
            )}
          </div>

          <div className="mt-6 border-t border-tinta/10 pt-5">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-tinta/45">
              Publicaciones por mes
            </p>
            <div className="flex h-24 items-end gap-2">
              {[40, 65, 30, 80, 55, 90, 45].map((altura, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-[3px] bg-azulRey-300"
                  style={{ height: `${altura}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
