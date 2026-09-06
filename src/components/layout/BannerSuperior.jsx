import { Link } from 'react-router-dom'

export default function BannerSuperior() {
  return (
    <div className="relative bg-papel-suave text-tinta shadow-[0_6px_12px_-8px_rgba(15,23,42,0.35)]">
      {/* Fondo con imagen (banner1) */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/banner1.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        {/* Capa clara opcional para que el logo y el texto resalten */}
        <div className="absolute inset-0 bg-papel-suave/60" />
      </div>

      {/* Contenedor un poco más ancho para que el texto tenga más espacio
          y no se vea apretado con el justificado. */}
      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-5 py-14 sm:px-8 sm:py-16 lg:flex-row lg:justify-center lg:gap-14 lg:py-20">
        {/* Logotipo — sin placa: el fondo claro ya permite que se vea bien */}
        <Link to="/" className="flex-shrink-0">
          <img
            src="/logo-negoteck-horizontal.png"
            alt="NEGOTECK — Fomentando la innovación en los negocios"
            className="h-auto w-56 object-contain sm:w-64 lg:w-72"
          />
        </Link>

        {/* Información — ancha, con el tamaño de letra de antes */}
        <p className="max-w-xl text-justify font-body text-sm leading-relaxed text-tinta/75 sm:text-base">
          Un espacio virtual para divulgar conocimiento y experiencias que permitan el desarrollo y la innovación en el ámbito empresarial y de negocios.
        </p>
      </div>
    </div>
  )
}