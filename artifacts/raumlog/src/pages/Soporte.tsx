import { Link } from "react-router-dom";
import { Mail, Instagram, Facebook, Linkedin, MessageCircle, Phone, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const WA_NUMBER = "573001234567";
const WA_MESSAGE = encodeURIComponent("Hola RaumLog, necesito ayuda con un espacio de almacenamiento");

export default function Soporte() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#2C5E8D]/5 to-[#AECBE9]/10">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#2C5E8D]/60 hover:text-[#2C5E8D] text-sm mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <h1 className="font-heading text-4xl text-[#2C5E8D] uppercase tracking-wide mb-2">Centro de Ayuda</h1>
        <p className="text-[#2C5E8D]/60 text-base mb-10">
          Estamos aquí para ayudarte. Elige el canal de contacto que prefieras.
        </p>

        <div className="grid gap-5">
          {/* WhatsApp */}
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-5 bg-white rounded-2xl p-5 shadow-sm border border-[#AECBE9]/30 hover:border-[#25D366]/40 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-[#25D366]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#25D366]/20 transition-colors">
              <MessageCircle className="w-6 h-6 text-[#25D366]" />
            </div>
            <div>
              <p className="font-semibold text-[#2C5E8D] text-base">WhatsApp</p>
              <p className="text-sm text-[#2C5E8D]/60">Respuesta rápida · Lunes a Sábado</p>
            </div>
            <span className="ml-auto text-xs font-semibold text-[#25D366] bg-[#25D366]/10 px-3 py-1.5 rounded-full">
              Abrir chat
            </span>
          </a>

          {/* Email */}
          <a
            href="mailto:info@coalge.com.co?subject=Ayuda%20RaumLog"
            className="flex items-center gap-5 bg-white rounded-2xl p-5 shadow-sm border border-[#AECBE9]/30 hover:border-[#2C5E8D]/40 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-[#2C5E8D]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#2C5E8D]/20 transition-colors">
              <Mail className="w-6 h-6 text-[#2C5E8D]" />
            </div>
            <div>
              <p className="font-semibold text-[#2C5E8D] text-base">Correo electrónico</p>
              <p className="text-sm text-[#2C5E8D]/60">info@coalge.com.co · COALGE S.A.S.</p>
            </div>
            <span className="ml-auto text-xs font-semibold text-[#2C5E8D] bg-[#2C5E8D]/10 px-3 py-1.5 rounded-full">
              Enviar correo
            </span>
          </a>

          {/* Redes sociales */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#AECBE9]/30">
            <p className="font-semibold text-[#2C5E8D] text-base mb-4">Síguenos en redes</p>
            <div className="flex gap-3 flex-wrap">
              <a
                href="https://instagram.com/raumlog"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#AECBE9]/40 hover:border-pink-400 hover:bg-pink-50 transition-all text-sm font-medium text-[#2C5E8D]"
              >
                <Instagram className="w-4 h-4 text-pink-500" />
                Instagram
              </a>
              <a
                href="https://facebook.com/raumlog"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#AECBE9]/40 hover:border-blue-500 hover:bg-blue-50 transition-all text-sm font-medium text-[#2C5E8D]"
              >
                <Facebook className="w-4 h-4 text-blue-600" />
                Facebook
              </a>
              <a
                href="https://linkedin.com/company/raumlog"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#AECBE9]/40 hover:border-blue-700 hover:bg-blue-50 transition-all text-sm font-medium text-[#2C5E8D]"
              >
                <Linkedin className="w-4 h-4 text-blue-700" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 bg-[#2C5E8D]/5 rounded-2xl p-6 border border-[#AECBE9]/30">
          <p className="text-sm text-[#2C5E8D]/70 leading-relaxed">
            <strong className="text-[#2C5E8D]">COALGE S.A.S.</strong> · NIT 901.234.567-8 · Medellín, Antioquia, Colombia.{" "}
            Horario de atención: Lunes a Viernes 8am–6pm · Sábados 9am–1pm.
          </p>
        </div>

        <div className="mt-6 flex gap-4 text-xs text-[#2C5E8D]/40">
          <Link to="/terminos-y-condiciones" className="hover:text-[#2C5E8D] transition-colors underline">
            Términos y Condiciones
          </Link>
          <Link to="/politica-de-privacidad" className="hover:text-[#2C5E8D] transition-colors underline">
            Política de Privacidad
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
