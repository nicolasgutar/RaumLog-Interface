import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-[#2C5E8D] py-14 px-4 text-center">
          <h1 className="font-heading text-4xl lg:text-5xl text-white mb-3 uppercase tracking-wide">Contacto</h1>
          <p className="text-[#AECBE9] text-lg">Estamos aquí para ayudarte</p>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Info */}
            <div>
              <h2 className="font-heading text-2xl text-[#2C5E8D] mb-8 uppercase tracking-wide">Información de contacto</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#AECBE9]/30 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#2C5E8D]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#2C5E8D]">Email</p>
                    <a href="mailto:contacto@raumlog.com" className="text-[#2C5E8D]/70 hover:text-[#2C5E8D] transition-colors">contacto@raumlog.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#AECBE9]/30 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#2C5E8D]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#2C5E8D]">Teléfono</p>
                    <a href="tel:+573054162141" className="text-[#2C5E8D]/70 hover:text-[#2C5E8D] transition-colors">+57 305 416 2141</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#AECBE9]/30 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#2C5E8D]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#2C5E8D]">Ubicación</p>
                    <p className="text-[#2C5E8D]/70">Medellín, Colombia</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-5">
              <h2 className="font-heading text-2xl text-[#2C5E8D] mb-6 uppercase tracking-wide">Envíanos un mensaje</h2>
              <div>
                <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Nombre</label>
                <input type="text" className="w-full border border-[#AECBE9] rounded-lg px-4 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30" placeholder="Tu nombre" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Email</label>
                <input type="email" className="w-full border border-[#AECBE9] rounded-lg px-4 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30" placeholder="tu@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Asunto</label>
                <input type="text" className="w-full border border-[#AECBE9] rounded-lg px-4 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30" placeholder="¿En qué te podemos ayudar?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Mensaje</label>
                <textarea rows={5} className="w-full border border-[#AECBE9] rounded-lg px-4 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 resize-none" placeholder="Escribe tu mensaje aquí..." />
              </div>
              <button type="submit" className="w-full py-3 bg-[#2C5E8D] hover:bg-[#1a3d5c] text-white font-semibold rounded-lg transition-colors tracking-wide">
                Enviar mensaje
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
