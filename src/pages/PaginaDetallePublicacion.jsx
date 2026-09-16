import {
  ArrowLeft,
  Calendar,
  Download,
  Eye,
  LogIn,
  Mail,
  MessageCircle,
  Send,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  obtenerPublicacionPorId,
  obtenerPublicacionesRecientes,
} from "../services/servicioPublicaciones";
import {
  obtenerComentarios,
  publicarComentario,
} from "../services/servicioComentarios";
import {
  estaAutenticado,
  obtenerUsuario,
} from "../services/servicioAutenticacion";
import Insignia from "../components/common/Insignia";
import Modal from "../components/common/Modal";
import TarjetaPublicacion from "../components/common/TarjetaPublicacion";
import { TarjetaEsqueleto } from "../components/common/Esqueleto";
import BarraNavegacion from "../components/layout/BarraNavegacion";
import { useNotificacion } from "../hooks/useNotificacion";
import { obtenerUrlEmbedYoutube } from "../utils/video";
import { yaSeRegistroVista, marcarVistaRegistrada } from "../utils/vistas";

const formateadorFecha = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const COMENTARIO_MIN = 5;
const COMENTARIO_MAX = 500;
// Caracteres que no aportan a un comentario normal en español y que se
// bloquean para evitar inyecciones de HTML/scripts o código. Se
// mantienen letras (con acentos y Ñ), números, espacios y la puntuación
// habitual del español.
const PATRON_COMENTARIO_PERMITIDO = /^[\p{L}\p{N}\s,.;:¡!¿?'"()\-_/%&@#]*$/u;

function validarComentarioCliente(valor) {
  const limpio = valor.trim();
  if (!limpio) {
    return "Escribe algo antes de publicar tu comentario.";
  }
  if (limpio.length < COMENTARIO_MIN) {
    return `El comentario debe tener al menos ${COMENTARIO_MIN} caracteres.`;
  }
  if (limpio.length > COMENTARIO_MAX) {
    return `El comentario no puede superar los ${COMENTARIO_MAX} caracteres.`;
  }
  if (!PATRON_COMENTARIO_PERMITIDO.test(limpio)) {
    return "El comentario contiene caracteres no permitidos.";
  }
  return null;
}

// Adapta la forma que regresa el backend (publicacion-detalle.php) a la
// forma que usa esta vista.
function normalizarPublicacionBackend(pub) {
  return {
    id: pub.id,
    titulo: pub.titulo,
    resumen: pub.resumen,
    imagen: pub.imagen,
    pdf: pub.pdf,
    fecha: pub.fecha,
    estado: "Aprobado",
    tipoContenido: pub.tipoContenido,
    urlVideo: pub.urlVideo,
    area: pub.area,
    autor: pub.autor,
    visitas: pub.visitas,
  };
}

export default function PaginaDetallePublicacion() {
  const { id } = useParams();
  const { mostrarNotificacion } = useNotificacion();
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const [comentario, setComentario] = useState("");
  const [comentarios, setComentarios] = useState([]);
  const [cargandoComentarios, setCargandoComentarios] = useState(true);
  const [publicandoComentario, setPublicandoComentario] = useState(false);
  const [modalPdfAbierto, setModalPdfAbierto] = useState(false);
  const usuarioActual = obtenerUsuario();

  const [publicacion, setPublicacion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [noEncontrada, setNoEncontrada] = useState(false);
  const [relacionadas, setRelacionadas] = useState([]);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setNoEncontrada(false);

    // Si esta publicación ya sumó una vista en la sesión actual del
    // navegador (por ejemplo, el usuario recargó la página), se le pide
    // al backend que no vuelva a incrementar el contador.
    const contarComoVisitaNueva = !yaSeRegistroVista(id);

    obtenerPublicacionPorId(id, { registrarVista: contarComoVisitaNueva })
      .then((datos) => {
        if (!activo) return;
        setPublicacion(normalizarPublicacionBackend(datos));
        marcarVistaRegistrada(id);
      })
      .catch(() => {
        if (activo) setNoEncontrada(true);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [id]);

  useEffect(() => {
    if (!publicacion?.id) {
      setCargandoComentarios(false);
      return;
    }
    let activo = true;
    setCargandoComentarios(true);

    obtenerComentarios(publicacion.id)
      .then((datos) => {
        if (activo) setComentarios(datos);
      })
      .catch(() => {
        if (activo) setComentarios([]);
      })
      .finally(() => {
        if (activo) setCargandoComentarios(false);
      });

    return () => {
      activo = false;
    };
  }, [publicacion?.id]);

  useEffect(() => {
    if (!publicacion?.area?.id) {
      setRelacionadas([]);
      return;
    }
    let activo = true;
    obtenerPublicacionesRecientes(20)
      .then((datos) => {
        if (!activo) return;
        setRelacionadas(
          datos
            .filter(
              (p) =>
                p.area?.id === publicacion.area.id &&
                String(p.id) !== String(publicacion.id),
            )
            .slice(0, 3),
        );
      })
      .catch(() => {
        if (activo) setRelacionadas([]);
      });
    return () => {
      activo = false;
    };
  }, [publicacion]);

  if (cargando) {
    return (
      <div>
        <BarraNavegacion />
        <div className="contenedor-pagina py-14">
          <TarjetaEsqueleto />
        </div>
      </div>
    );
  }

  if (!publicacion || noEncontrada) {
    return (
      <div>
        <BarraNavegacion />
        <div className="contenedor-pagina py-24 text-center">
          <p className="font-display text-2xl text-tinta">
            Publicación no encontrada
          </p>
          <Link to="/" className="btn-primary mt-6 inline-flex">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const area = publicacion.area;
  const autor = publicacion.autor;
  const esVideo = publicacion.tipoContenido === "video";
  const urlEmbed = esVideo ? obtenerUrlEmbedYoutube(publicacion.urlVideo) : null;

  // El usuario quiere comentar pero no tiene sesión: lo mandamos a /login
  // recordando esta publicación como "desde", para que al autenticarse
  // regrese aquí mismo en vez de terminar en el panel del administrador.
  const manejarIniciarSesionParaComentar = () => {
    navegar("/login", { state: { desde: ubicacion } });
  };

  const manejarAbrirPdf = () => {
    if (!publicacion.pdf) {
      mostrarNotificacion(
        "Esta publicación todavía no tiene un PDF disponible.",
        "info",
      );
      return;
    }
    setModalPdfAbierto(true);
  };

  const manejarPublicarComentario = async (e) => {
    e.preventDefault();

    if (!estaAutenticado()) {
      mostrarNotificacion("Inicia sesión para poder comentar.", "advertencia");
      return;
    }

    const contenido = comentario.trim().replace(/[ \t]{2,}/g, " ");
    const errorValidacion = validarComentarioCliente(contenido);
    if (errorValidacion) {
      mostrarNotificacion(errorValidacion, "advertencia");
      return;
    }

    setPublicandoComentario(true);
    try {
      const nuevoComentario = await publicarComentario({
        idPublicacion: publicacion.id,
        contenido,
      });
      setComentarios((anteriores) => [...anteriores, nuevoComentario]);
      setComentario("");
      mostrarNotificacion("Tu comentario fue publicado.", "exito");
    } catch (error) {
      mostrarNotificacion(
        error.message || "No se pudo publicar tu comentario. Intenta de nuevo.",
        "advertencia",
      );
    } finally {
      setPublicandoComentario(false);
    }
  };

  return (
    <div>
      <BarraNavegacion />
      <article className="contenedor-pagina py-10 sm:py-14">
      <Link
        to={area ? `/areas/${area.id}` : "/"}
        className="inline-flex items-center gap-2 text-sm font-medium text-tinta/60 hover:text-azulRey-600"
      >
        <ArrowLeft size={15} /> Volver a {area?.nombre}
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_280px]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            {area && <Insignia tono={area.color}>{area.nombre}</Insignia>}
            <Insignia estado={publicacion.estado}>
              {publicacion.estado}
            </Insignia>
          </div>
          <h1 className="mt-4 font-display text-3xl font-medium leading-tight text-tinta sm:text-4xl">
            {publicacion.titulo}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-tinta/55">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />{" "}
              {formateadorFecha.format(new Date(publicacion.fecha))}
            </span>
            <span>Por {autor?.nombre}</span>
            {typeof publicacion.visitas === "number" && (
              <span className="flex items-center gap-1.5">
                <Eye size={14} /> {publicacion.visitas.toLocaleString("es-MX")} vistas
              </span>
            )}
          </div>

          {esVideo ? (
            urlEmbed ? (
              <iframe
                src={urlEmbed}
                title={publicacion.titulo}
                allowFullScreen
                className="mt-8 aspect-video w-full rounded-card border-0 shadow-card"
              />
            ) : (
              <div className="mt-8 flex aspect-video w-full items-center justify-center rounded-card border border-tinta/10 bg-papel-suave text-sm text-tinta/40 shadow-card">
                Video no disponible.
              </div>
            )
          ) : (
            publicacion.imagen && (
              <img
                src={publicacion.imagen}
                alt=""
                className="mt-8 aspect-video w-full rounded-card object-cover shadow-card"
              />
            )
          )}

          <div className="prose-sm mt-8 max-w-none text-[15px] leading-relaxed text-tinta/75">
            <p className="font-display text-lg text-tinta/85">
              {publicacion.resumen}
            </p>
          </div>

          {!esVideo && (
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={manejarAbrirPdf} className="btn-primary">
                <Eye size={15} /> Visualizar PDF
              </button>
            </div>
          )}

          {/* Sección de comentarios: una sola implementación para cualquier
              publicación, sin importar desde qué vista se llegó aquí. */}
          <div className="mt-14 border-t border-tinta/10 pt-10">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} className="text-azulRey-600" />
              <h2 className="font-display text-xl font-medium text-tinta">
                Comentarios{" "}
                <span className="text-tinta/40">({comentarios.length})</span>
              </h2>
            </div>

            <div className="mt-6 flex flex-col gap-5">
              {cargandoComentarios ? (
                <p className="text-sm text-tinta/50">Cargando comentarios…</p>
              ) : comentarios.length === 0 ? (
                <p className="text-sm text-tinta/50">
                  Sé el primero en comentar esta publicación.
                </p>
              ) : (
                comentarios.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-azulRey-50 font-display text-sm font-medium text-azulRey-600">
                      {item.usuario.nombre.charAt(0).toUpperCase()}
                    </span>
                    <div className="flex-1 rounded-card border border-tinta/10 bg-papel-suave p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-tinta">
                          {item.usuario.nombre}
                        </p>
                        <span className="font-mono text-[11px] text-tinta/40">
                          {formateadorFecha.format(new Date(item.fecha))}
                        </span>
                      </div>
                      <p className="mt-1.5 whitespace-pre-line text-sm text-tinta/70">
                        {item.contenido}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {!estaAutenticado() ? (
              <div className="mt-7 flex flex-col items-start gap-3 rounded-card border border-tinta/10 bg-papel-suave p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <p className="text-sm text-tinta/65">
                  Inicia sesión para poder dejar un comentario.
                </p>
                <button
                  onClick={manejarIniciarSesionParaComentar}
                  className="btn-primary shrink-0"
                >
                  <LogIn size={15} /> Iniciar sesión
                </button>
              </div>
            ) : (
              <form
                onSubmit={manejarPublicarComentario}
                className="mt-7 rounded-card border border-tinta/10 bg-papel-suave p-4 sm:p-5"
              >
                <label className="etiqueta-campo" htmlFor="nuevo-comentario">
                  {usuarioActual
                    ? `Comentando como ${usuarioActual.nombre}`
                    : "Deja tu comentario"}
                </label>
                <textarea
                  id="nuevo-comentario"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  rows={3}
                  maxLength={COMENTARIO_MAX}
                  placeholder="Escribe un comentario…"
                  className="campo-entrada resize-none"
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="font-mono text-[11px] text-tinta/40">
                    {comentario.trim().length}/{COMENTARIO_MAX}
                  </span>
                  <button
                    type="submit"
                    disabled={publicandoComentario}
                    className="btn-primary"
                  >
                    {publicandoComentario ? (
                      "Publicando…"
                    ) : (
                      <>
                        <Send size={15} /> Publicar comentario
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-card border border-tinta/10 bg-papel-suave p-5 shadow-soft lg:sticky lg:top-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-tinta/45">
            Sobre el autor
          </p>
          <div className="mt-3 flex items-center gap-3">
            {autor?.avatar && (
              <img
                src={autor.avatar}
                alt=""
                className="h-12 w-12 rounded-full object-cover"
              />
            )}
            <div>
              <p className="font-display text-sm font-medium text-tinta">
                {autor?.nombre}
              </p>
              {autor?.rol && (
                <p className="text-xs text-tinta/50">{autor.rol}</p>
              )}
            </div>
          </div>
          {autor?.biografia && (
            <p className="mt-3 text-sm text-tinta/60">{autor.biografia}</p>
          )}
          {autor?.correo && (
            <a
              href={`mailto:${autor.correo}`}
              className="mt-4 flex items-center gap-2 text-sm font-medium text-azulRey-600 hover:text-azulRey-700"
            >
              <Mail size={15} /> {autor.correo}
            </a>
          )}
        </aside>
      </div>

      {relacionadas.length > 0 && (
        <div className="mt-16 border-t border-tinta/10 pt-10">
          <p className="antetitulo">También en {area?.nombre}</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relacionadas.map((p) => (
              <TarjetaPublicacion key={p.id} publicacion={p} />
            ))}
          </div>
        </div>
      )}

      <Modal
        abierto={modalPdfAbierto && Boolean(publicacion.pdf)}
        alCerrar={() => setModalPdfAbierto(false)}
        titulo={publicacion.titulo}
        ancho="max-w-4xl"
        pie={
          <a
            href={publicacion.pdf}
            download
            target="_blank"
            rel="noreferrer"
            className="btn-secondary !px-3 !py-2 text-xs"
          >
            <Download size={14} /> Descargar
          </a>
        }
      >
        {publicacion.pdf && (
          <iframe
            src={publicacion.pdf}
            title={`PDF de ${publicacion.titulo}`}
            className="h-[70vh] w-full rounded-[4px] bg-white"
          />
        )}
      </Modal>
      </article>
    </div>
  );
}
