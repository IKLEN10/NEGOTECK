import { ArrowLeft, Calendar, Eye, Bell, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerPublicacionNoValidada } from "../../services/servicioPublicaciones";
import { obtenerUrlEmbedYoutube } from "../../utils/video";
import Insignia from "../../components/common/Insignia";
import Modal from "../../components/common/Modal";
import { TarjetaEsqueleto } from "../../components/common/Esqueleto";

const formateadorFecha = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default function PaginaPublicacionNoValidada() {
  const { id, estado } = useParams();
  const [publicacion, setPublicacion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [modalPdfAbierto, setModalPdfAbierto] = useState(false);

  useEffect(() => {
    let activo = true;

    obtenerPublicacionNoValidada(id)
      .then((datos) => {
        if (activo) {
          setPublicacion({
            id: datos.id_publicacion || datos.id,
            titulo: datos.titulo,
            resumen: datos.resumen,
            fecha: datos.fecha_publicacion || datos.fecha,
            imagen: datos.imagen,
            pdf: datos.pdf,
            urlVideo: datos.urlVideo,
            tipoContenido: datos.tipoContenido,
            estado: estado?.toUpperCase(),
            razonRechazo: datos.razonRechazo,
            area: datos.area,
            autor: datos.autor,
          });
        }
      })
      .catch(() => {
        if (activo) setPublicacion(null);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [id, estado]);

  if (cargando) {
    return (
      <div className="contenedor-pagina py-14">
        <TarjetaEsqueleto />
      </div>
    );
  }

  if (!publicacion) {
    return (
      <div className="contenedor-pagina py-24 text-center">
        <p className="font-display text-2xl text-tinta">
          Publicación no encontrada
        </p>
        <Link
          to="/panel/publicaciones"
          className="btn-primary mt-6 inline-flex"
        >
          Volver
        </Link>
      </div>
    );
  }

  return (
    <article className="contenedor-pagina py-10 sm:py-14">
      <Link
        to="/panel/publicaciones"
        className="inline-flex items-center gap-2 text-sm font-medium text-tinta/60 hover:text-azulRey-600"
      >
        <ArrowLeft size={15} /> Volver a mis publicaciones
      </Link>

      {/* Alerta PENDIENTE */}
      {estado?.toUpperCase() === "PENDIENTE" && (
        <div className="mt-6 rounded-card border border-yellow-300 bg-yellow-50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <Bell size={18} className="mt-0.5 text-yellow-900" />
            <div>
              <p className="text-sm font-medium text-yellow-900">
                Esta publicación está pendiente de revisión
              </p>
              <p className="mt-2 text-xs text-yellow-700">
                Nuestro equipo editorial está evaluando tu contenido. Te
                notificaremos cuando haya cambios.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Alerta RECHAZADO */}
      {estado?.toUpperCase() === "RECHAZADO" && (
        <div className="mt-6 rounded-card border border-red-300 bg-red-50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="mt-0.5 text-red-900" />
            <div>
              <p className="text-sm font-medium text-red-900">
                Publicación rechazada
              </p>
              <p className="mt-2 text-sm text-red-800">
                <strong>Motivo:</strong>{" "}
                {publicacion.razonRechazo || "No especificado"}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_280px]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            {publicacion.area?.nombre && (
              <Insignia tono={publicacion.area.color}>
                {publicacion.area.nombre}
              </Insignia>
            )}
            <Insignia estado={publicacion.estado}>
              {publicacion.estado}
            </Insignia>
          </div>

          <h1 className="mt-4 font-display text-3xl font-medium leading-tight text-tinta sm:text-4xl">
            {publicacion.titulo}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-tinta/55">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {publicacion.fecha
                ? formateadorFecha.format(new Date(publicacion.fecha))
                : "Sin fecha"}
            </span>
            <span>Por {publicacion.autor?.nombre}</span>
          </div>

          {/* Video si urlVideo existe */}
          {publicacion.urlVideo && (
            <div className="mt-8 aspect-video w-full rounded-card overflow-hidden shadow-card">
              <iframe
                width="100%"
                height="100%"
                src={obtenerUrlEmbedYoutube(publicacion.urlVideo)}
                title={publicacion.titulo}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Imagen si NO hay video */}
          {!publicacion.urlVideo && publicacion.imagen && (
            <img
              src={publicacion.imagen}
              alt={publicacion.titulo}
              className="mt-8 aspect-video w-full rounded-card object-cover shadow-card"
            />
          )}

          <div className="prose-sm mt-8 max-w-none text-[15px] leading-relaxed text-tinta/75">
            <p className="font-display text-lg text-tinta/85">
              {publicacion.resumen}
            </p>
          </div>

          {/* PDF solo si NO hay video */}
          {!publicacion.urlVideo && publicacion.pdf && (
            <button
              onClick={() => setModalPdfAbierto(true)}
              className="btn-primary mt-8"
            >
              <Eye size={15} /> Ver PDF
            </button>
          )}
        </div>

        <aside className="h-fit rounded-card border border-tinta/10 bg-papel-suave p-5 shadow-soft lg:sticky lg:top-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-tinta/45">
            Sobre el autor
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-azulRey-100 text-xs font-bold text-azulRey-600">
              {publicacion.autor?.nombre?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-display text-sm font-medium text-tinta">
                {publicacion.autor?.nombre}
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Modal PDF */}
      <Modal
        abierto={modalPdfAbierto && Boolean(publicacion.pdf)}
        alCerrar={() => setModalPdfAbierto(false)}
        titulo={publicacion.titulo}
        ancho="max-w-4xl"
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
  );
}
