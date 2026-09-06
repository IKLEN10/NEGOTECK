import { FileUp, ImageUp, Send, Video } from "lucide-react";
import { useEffect, useState } from "react";
import CampoArchivo from "./CampoArchivo";
import ContadorPalabras from "./ContadorPalabras";
import { obtenerAreasSelect } from "../../services/servicioAreas";
import { ModalPantallCompleta } from "../common/Modal";

export default function FormularioPublicacion({
  publicacion,
  onEnviar,
  enviando,
  buttonText = "Enviar publicación",
  mostrarMotivo = false,
  modoLimitado = false,
}) {
  const [tipoContenido, setTipoContenido] = useState("archivo");
  const [archivoPdf, setArchivoPdf] = useState(null);
  const [archivoImagen, setArchivoImagen] = useState(null);
  const [urlVideo, setUrlVideo] = useState("");
  const [titulo, setTitulo] = useState("");
  const [resumen, setResumen] = useState("");
  const [area, setArea] = useState("");
  const [areas, setAreas] = useState([]);
  const [modalPdf, setModalPdf] = useState(false);
  const [modalImagen, setModalImagen] = useState(false);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    const cargarAreas = async () => {
      try {
        const datos = await obtenerAreasSelect();
        setAreas(datos);
      } catch (error) {
        console.error(error);
      }
    };
    cargarAreas();
  }, []);

  useEffect(() => {
    if (publicacion) {
      setTitulo(publicacion.titulo || "");
      setResumen(publicacion.resumen || "");
      setArea(publicacion.id_area || "");
      setTipoContenido(publicacion.tipo_contenido || "archivo");
      setUrlVideo(publicacion.url_video || "");
    }
  }, [publicacion]);

  const manejarEnvio = (e) => {
    e.preventDefault();
    setErrores({});

    const datos = new FormData();
    datos.append("titulo", titulo);
    datos.append("resumen", resumen);

    // En modo limitado, no enviamos estos datos
    if (!modoLimitado) {
      datos.append("area", area);
      datos.append("tipo_contenido", tipoContenido);
    }

    if (publicacion?.id) {
      datos.append("id", publicacion.id);
    }

    if (!modoLimitado) {
      if (tipoContenido === "archivo") {
        if (archivoPdf) datos.append("file", archivoPdf);
        if (archivoImagen) datos.append("imagen", archivoImagen);
      } else {
        datos.append("url_video", urlVideo);
      }
    }

    onEnviar(datos, setErrores);
  };

  return (
    <>
      <form
        onSubmit={manejarEnvio}
        className={`${modoLimitado ? "" : "mt-8"} flex flex-col gap-5`}
      >
        {/* Motivo rechazo */}
        {mostrarMotivo && publicacion?.motivo_rechazo && (
          <div className="rounded-card border border-naranja-200 bg-naranja-50 p-4">
            <p className="text-sm font-medium text-naranja-700">
              ⚠️ Motivo del rechazo:
            </p>
            <p className="mt-1 text-sm text-naranja-700">
              {publicacion.motivo_rechazo}
            </p>
          </div>
        )}

        {/* Título */}
        <div>
          <div className="flex items-center justify-between">
            <label className="etiqueta-campo" htmlFor="titulo">
              Título
            </label>
            <ContadorPalabras texto={titulo} maximo={20} />
          </div>
          <input
            id="titulo"
            value={titulo}
            onChange={(e) => {
              setTitulo(e.target.value);
              setErrores({ ...errores, titulo: "" });
            }}
            className={`campo-entrada ${errores.titulo ? "border-red-500 bg-red-50" : ""}`}
            placeholder="Título de tu publicación"
            disabled={enviando}
          />
          {errores.titulo && (
            <p className="mt-1 text-xs text-red-600">{errores.titulo}</p>
          )}
        </div>

        {/* Resumen */}
        <div>
          <div className="flex items-center justify-between">
            <label className="etiqueta-campo" htmlFor="resumen">
              Resumen
            </label>
            <ContadorPalabras texto={resumen} maximo={100} />
          </div>
          <textarea
            id="resumen"
            rows={3}
            value={resumen}
            onChange={(e) => {
              setResumen(e.target.value);
              setErrores({ ...errores, resumen: "" });
            }}
            className={`campo-entrada resize-none ${errores.resumen ? "border-red-500 bg-red-50" : ""}`}
            placeholder="Resumen breve del artículo"
            disabled={enviando}
          />
          {errores.resumen && (
            <p className="mt-1 text-xs text-red-600">{errores.resumen}</p>
          )}
        </div>

        {/* Área - Solo si no es modoLimitado */}
        {!modoLimitado && (
          <div>
            <label className="etiqueta-campo" htmlFor="area">
              Área
            </label>
            <select
              id="area"
              value={area}
              onChange={(e) => {
                setArea(e.target.value);
                setErrores({ ...errores, area: "" });
              }}
              className={`campo-entrada ${errores.area ? "border-red-500 bg-red-50" : ""}`}
              disabled={enviando}
            >
              <option value="" disabled>
                Selecciona un área
              </option>
              {areas.map((a) => (
                <option key={a.id_area} value={a.id_area}>
                  {a.nombre}
                </option>
              ))}
            </select>
            {errores.area && (
              <p className="mt-1 text-xs text-red-600">{errores.area}</p>
            )}
          </div>
        )}

        {/* Tipo de contenido - Solo si no es modoLimitado */}
        {!modoLimitado && (
          <div>
            <label className="etiqueta-campo mb-2 block">
              Tipo de contenido
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTipoContenido("archivo")}
                disabled={enviando || !!publicacion}
                className={`flex items-center justify-center gap-2 rounded-card border-2 px-3 py-3 transition-all ${
                  tipoContenido === "archivo"
                    ? "border-azulRey-500 bg-azulRey-50/60"
                    : "border-tinta/10 bg-papel hover:border-tinta/20"
                } ${publicacion ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div
                  className={`rounded-full p-2 ${
                    tipoContenido === "archivo"
                      ? "bg-azulRey-100"
                      : "bg-tinta/5"
                  }`}
                >
                  <FileUp
                    size={16}
                    className={
                      tipoContenido === "archivo"
                        ? "text-azulRey-600"
                        : "text-tinta/40"
                    }
                  />
                </div>
                <p className="text-xs font-semibold text-tinta">PDF + Imagen</p>
              </button>

              <button
                type="button"
                onClick={() => setTipoContenido("video")}
                disabled={enviando || !!publicacion}
                className={`flex items-center justify-center gap-2 rounded-card border-2 px-3 py-3 transition-all ${
                  tipoContenido === "video"
                    ? "border-azulRey-500 bg-azulRey-50/60"
                    : "border-tinta/10 bg-papel hover:border-tinta/20"
                } ${publicacion ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div
                  className={`rounded-full p-2 ${
                    tipoContenido === "video" ? "bg-azulRey-100" : "bg-tinta/5"
                  }`}
                >
                  <Video
                    size={16}
                    className={
                      tipoContenido === "video"
                        ? "text-azulRey-600"
                        : "text-tinta/40"
                    }
                  />
                </div>
                <p className="text-xs font-semibold text-tinta">URL Video</p>
              </button>
            </div>
          </div>
        )}

        {/* Archivos - Solo si no es modoLimitado */}
        {!modoLimitado && tipoContenido === "archivo" && (
          <div className="grid gap-5 sm:grid-cols-2 pt-1">
            <div>
              <CampoArchivo
                etiqueta={
                  publicacion ? "Cambiar PDF (opcional)" : "Archivo PDF"
                }
                ejemplo="tu documento"
                icono={FileUp}
                aceptar="application/pdf"
                nombreArchivo={archivoPdf?.name}
                alSeleccionar={setArchivoPdf}
                disabled={enviando}
              />

              {publicacion?.archivo_pdf && (
                <button
                  type="button"
                  onClick={() => setModalPdf(true)}
                  className="mt-2 text-sm text-azulRey-600 hover:underline"
                >
                  Ver PDF actual
                </button>
              )}

              {errores.archivo_pdf && (
                <p className="mt-1 text-xs text-red-600">
                  {errores.archivo_pdf}
                </p>
              )}
            </div>

            <div>
              <CampoArchivo
                etiqueta={
                  publicacion
                    ? "Cambiar Imagen (opcional)"
                    : "Imagen de portada"
                }
                ejemplo="una imagen"
                icono={ImageUp}
                aceptar="image/*"
                nombreArchivo={archivoImagen?.name}
                alSeleccionar={setArchivoImagen}
                disabled={enviando}
              />

              {publicacion?.imagen_portada && (
                <button
                  type="button"
                  onClick={() => setModalImagen(true)}
                  className="mt-2 text-sm text-azulRey-600 hover:underline"
                >
                  Ver imagen actual
                </button>
              )}

              {errores.imagen_portada && (
                <p className="mt-1 text-xs text-red-600">
                  {errores.imagen_portada}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Video - Solo si no es modoLimitado */}
        {!modoLimitado && tipoContenido === "video" && (
          <div className="pt-1">
            <label className="etiqueta-campo" htmlFor="url-video">
              URL del Video
            </label>
            <input
              id="url-video"
              type="url"
              value={urlVideo}
              onChange={(e) => {
                setUrlVideo(e.target.value);
                setErrores({ ...errores, url_video: "" });
              }}
              className={`campo-entrada ${errores.url_video ? "border-red-500 bg-red-50" : ""}`}
              placeholder="https://youtube.com/watch?v=..."
              disabled={enviando}
            />
            {errores.url_video && (
              <p className="mt-1 text-xs text-red-600">{errores.url_video}</p>
            )}
          </div>
        )}

        {/* Nota en modo limitado */}
        {modoLimitado && (
          <div className="rounded-[4px] bg-azulRey-50 border border-azulRey-200 p-3">
            <p className="text-xs text-azulRey-700">
              <span className="font-medium">Nota:</span> El área y archivos de
              tu publicación no pueden ser modificados desde aquí.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="btn-primary mt-2 w-full sm:w-fit"
        >
          {enviando ? (
            "Enviando…"
          ) : (
            <>
              <Send size={16} /> {buttonText}
            </>
          )}
        </button>
      </form>

      {/* MODAL PDF */}
      {modalPdf && publicacion?.archivo_pdf && (
        <ModalPantallCompleta titulo="PDF" alCerrar={() => setModalPdf(false)}>
          {publicacion.archivo_pdf.toLowerCase().endsWith(".pdf") ? (
            <iframe
              src={publicacion.archivo_pdf}
              className="w-full h-full"
              title="Vista previa PDF"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-tinta/60">
              <p className="mb-4">No se puede previsualizar el PDF</p>

              <a
                href={publicacion.archivo_pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="text-azulRey-600 hover:underline font-medium"
              >
                Descargar PDF
              </a>
            </div>
          )}
        </ModalPantallCompleta>
      )}

      {/* MODAL IMAGEN */}
      {modalImagen && publicacion?.imagen_portada && (
        <ModalPantallCompleta
          titulo="Imagen de portada"
          alCerrar={() => setModalImagen(false)}
        >
          <div className="w-full h-full flex items-center justify-center bg-papel-suave p-4">
            <img
              src={publicacion.imagen_portada}
              alt="Portada"
              className="max-w-full max-h-full object-contain rounded-[4px]"
            />
          </div>
        </ModalPantallCompleta>
      )}
    </>
  );
}
