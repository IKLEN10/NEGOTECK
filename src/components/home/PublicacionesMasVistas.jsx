import { useEffect, useState } from "react";
import { Calendar, Loader2, RefreshCw } from "lucide-react";
import { obtenerPublicacionesCuatrimestres } from "../../services/servicioPublicaciones";
import TarjetaPublicacion from "../common/TarjetaPublicacion";
import { TarjetaEsqueleto } from "../common/Esqueleto";
import { useRevelado } from "../../hooks/useRevelado";

export default function DirectorioPublicaciones() {
  const referencia = useRevelado();

  const [publicaciones, setPublicaciones] = useState([]);
  const [cuatrimestresDisponibles, setCuatrimestresDisponibles] = useState([]);

  const [cuatrimestreSeleccionado, setCuatrimestreSeleccionado] = useState("");
  const [anioSeleccionado, setAnioSeleccionado] = useState("");
  const [pagina, setPagina] = useState(1);

  const [cargando, setCargando] = useState(true);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [tieneMas, setTieneMas] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = async (
    numPagina = 1,
    cuatrimestre = "",
    anio = "",
    esCargarMas = false,
  ) => {
    if (esCargarMas) {
      setCargandoMas(true);
    } else {
      setCargando(true);
      setPublicaciones([]);
    }
    setError(null);

    try {
      const resultado = await obtenerPublicacionesCuatrimestres({
        pagina: numPagina,
        cuatrimestre: cuatrimestre || undefined,
        anio: anio || undefined,
      });

      const nuevasPublicaciones = resultado.data || [];

      if (resultado.filtros_disponibles) {
        setCuatrimestresDisponibles(resultado.filtros_disponibles);
      }

      if (esCargarMas) {
        setPublicaciones((prev) => [...prev, ...nuevasPublicaciones]);
      } else {
        setPublicaciones(nuevasPublicaciones);
      }

      if (nuevasPublicaciones.length < 9) {
        setTieneMas(false);
      } else {
        setTieneMas(true);
      }

      setPagina(numPagina);
    } catch (err) {
      setError(err.message || "Ocurrió un error al cargar las publicaciones");
    } finally {
      setCargando(false);
      setCargandoMas(false);
    }
  };

  useEffect(() => {
    cargarDatos(1, "", "");
  }, []);

  const handleFiltroChange = (e) => {
    const valor = e.target.value;
    if (!valor) {
      setCuatrimestreSeleccionado("");
      setAnioSeleccionado("");
      cargarDatos(1, "", "");
      return;
    }

    const [cuatri, anio] = valor.split("|");
    setCuatrimestreSeleccionado(cuatri);
    setAnioSeleccionado(anio);
    cargarDatos(1, cuatri, anio);
  };

  const handleCargarMas = () => {
    const siguientePagina = pagina + 1;
    cargarDatos(
      siguientePagina,
      cuatrimestreSeleccionado,
      anioSeleccionado,
      true,
    );
  };

  const obtenerEtiquetaCuatrimestre = (pub) => {
    const fechaStr =
      pub.fecha_publicacion ||
      pub.fecha_registro ||
      pub.fecha ||
      pub.created_at;

    if (!fechaStr) {
      return "Proyectos Recientes";
    }

    const fecha = new Date(fechaStr);
    if (isNaN(fecha.getTime())) return "Proyectos Recientes";

    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();

    let nombre = "";
    if (mes >= 1 && mes <= 4) nombre = "Enero - Abril";
    else if (mes >= 5 && mes <= 8) nombre = "Mayo - Agosto";
    else nombre = "Septiembre - Diciembre";

    return `${nombre} ${anio}`;
  };

  const publicacionesAgrupadas = publicaciones.reduce((grupos, pub) => {
    const etiqueta = obtenerEtiquetaCuatrimestre(pub);

    if (!grupos[etiqueta]) {
      grupos[etiqueta] = [];
    }
    grupos[etiqueta].push(pub);
    return grupos;
  }, {});

  return (
    <section
      id="directorio-publicaciones"
      className="scroll-mt-20 py-16 sm:py-20"
    >
      <div ref={referencia} className="revelar contenedor-pagina">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="antetitulo">Directorio Académico</p>
            <h2 className="mt-3 font-display text-2xl font-medium text-tinta sm:text-3xl">
              Proyectos y artículos de investigación
            </h2>
          </div>

          {cuatrimestresDisponibles.length > 0 && (
            <div className="flex items-center gap-2 rounded-[4px] border border-tinta/15 bg-papel px-3 py-2.5 w-full md:w-64 shadow-soft">
              <Calendar size={15} className="text-tinta/40 shrink-0" />
              <select
                onChange={handleFiltroChange}
                aria-label="Filtrar por cuatrimestre"
                className="w-full bg-transparent text-sm text-tinta focus:outline-none"
              >
                <option value="">Todos los cuatrimestres</option>
                {cuatrimestresDisponibles.map((f, index) => (
                  <option key={index} value={`${f.cuatrimestre}|${f.anio}`}>
                    {f.etiqueta}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-6 text-sm text-red-500">
            No se pudieron cargar las publicaciones: {error}
          </p>
        )}

        {cargando && (
          <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, indice) => (
              <TarjetaEsqueleto key={indice} />
            ))}
          </div>
        )}

        {!cargando &&
          Object.keys(publicacionesAgrupadas).map((cuatrimestreLabel) => (
            <div key={cuatrimestreLabel} className="mt-12">
              <div className="flex items-center gap-4 mb-6">
                <h3 className="font-display text-xl font-medium text-tinta whitespace-nowrap">
                  {cuatrimestreLabel}
                </h3>
                <div className="h-[1px] w-full bg-tinta/15"></div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {publicacionesAgrupadas[cuatrimestreLabel].map(
                  (publicacion) => (
                    <TarjetaPublicacion
                      key={publicacion.id_publicacion || publicacion.id}
                      publicacion={publicacion}
                    />
                  ),
                )}
              </div>
            </div>
          ))}

        {!cargando && publicaciones.length === 0 && !error && (
          <div className="mt-12 text-center py-12 bg-white rounded-2xl border border-tinta/10">
            <p className="text-tinta/60 text-sm">
              No se encontraron publicaciones aprobadas para este período.
            </p>
          </div>
        )}

        {!cargando && tieneMas && publicaciones.length > 0 && (
          <div className="mt-12 text-center">
            <button
              onClick={handleCargarMas}
              disabled={cargandoMas}
              className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm disabled:opacity-50"
            >
              {cargandoMas ? (
                <>
                  <Loader2 size={16} className="animate-spin shrink-0" />
                  Cargando...
                </>
              ) : (
                <>
                  <RefreshCw size={16} className="shrink-0" />
                  Cargar más proyectos
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
