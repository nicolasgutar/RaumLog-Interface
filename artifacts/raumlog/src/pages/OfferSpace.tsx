import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Camera, DollarSign, Shield, Star } from "lucide-react";

const benefits = [
  {
    icon: DollarSign,
    title: "Genera ingresos extra",
    description: "Tú fijas el precio. Recibe pagos mensuales directamente en tu cuenta.",
  },
  {
    icon: Shield,
    title: "Contrato digital",
    description: "Toda operación está respaldada por un contrato que protege tus intereses.",
  },
  {
    icon: Star,
    title: "Tú decides",
    description: "Elige a quién aceptar, cuándo y en qué condiciones. Tienes el control total.",
  },
  {
    icon: Camera,
    title: "Anuncio gratuito",
    description: "Crea tu anuncio con fotos y descripción sin costo alguno. Nosotros lo validamos.",
  },
];

export default function OfferSpace() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#2C5E8D] py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-4xl lg:text-5xl text-white mb-4 uppercase tracking-wide">
              Ofrece tu espacio
            </h1>
            <p className="text-[#AECBE9] text-lg max-w-2xl mx-auto">
              Convierte el espacio que no usas en ingresos mensuales. Sin burocracia,
              sin riesgos, sin complicaciones.
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading text-3xl text-[#2C5E8D] text-center mb-12 uppercase tracking-wide">
              ¿Por qué ser anfitrión en RaumLog?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl border border-[#AECBE9]/40 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-full bg-[#AECBE9]/30 flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7 text-[#2C5E8D]" />
                    </div>
                    <h3 className="font-semibold text-[#2C5E8D] text-lg mb-2">{b.title}</h3>
                    <p className="text-[#2C5E8D]/70 text-sm leading-relaxed">{b.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Form */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#D8CFC3]/30">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl text-[#2C5E8D] text-center mb-8 uppercase tracking-wide">
              Registra tu espacio hoy
            </h2>
            <form className="bg-white rounded-2xl p-8 shadow space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Nombre completo</label>
                <input type="text" className="w-full border border-[#AECBE9] rounded-lg px-4 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30" placeholder="Tu nombre" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Correo electrónico</label>
                <input type="email" className="w-full border border-[#AECBE9] rounded-lg px-4 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30" placeholder="tu@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Tipo de espacio</label>
                <select className="w-full border border-[#AECBE9] rounded-lg px-4 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 bg-white">
                  <option>Garaje</option>
                  <option>Cuarto útil</option>
                  <option>Bodega</option>
                  <option>Habitación vacía</option>
                  <option>Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Ciudad</label>
                <input type="text" className="w-full border border-[#AECBE9] rounded-lg px-4 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30" placeholder="Ciudad donde está el espacio" />
              </div>
              <button type="submit" className="w-full py-3 bg-[#2C5E8D] hover:bg-[#1a3d5c] text-white font-semibold rounded-lg transition-colors tracking-wide">
                Registrar mi espacio
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
