import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "¿Qué es RaumLog?",
    answer:
      "Es una plataforma digital que conecta a personas y empresas que necesitan espacio de almacenamiento, con anfitriones que tienen garajes, cuartos útiles o bodegas disponibles para alquilar de forma segura.",
  },
  {
    question: "¿Es seguro dejar mis pertenencias?",
    answer:
      "Sí. Todos los usuarios pasan por un proceso de verificación. Además, el servicio está respaldado por un contrato que define claramente las responsabilidades y prohíbe el almacenamiento de artículos peligrosos o ilegales. El anfitrión pone las reglas e inspecciona los bienes junto al usuario.",
  },
  {
    question: "¿Cómo se definen los precios?",
    answer:
      'El anfitrión establece la «Tarifa del Espacio» base. RaumLog añade una pequeña «Tarifa de Servicio» por el uso de la plataforma y el procesamiento del pago. Todo se desglosa de manera transparente antes de confirmar tu reserva.',
  },
  {
    question: "¿Qué tipo de espacios puedo encontrar?",
    answer:
      "Desde pequeños cuartos útiles para guardar cajas y maletas, habitaciones vacías, garajes enteros y hasta espacios en bodegas. Cualquier espacio desaprovechado es una oportunidad con RaumLog.",
  },
  {
    question: "¿Cómo puedo ser anfitrión?",
    answer:
      "Solo debes registrarte en la plataforma, crear un anuncio gratuito con fotos, medidas y el precio de tu espacio. Nosotros lo validamos y lo publicamos para que empieces a recibir solicitudes.",
  },
  {
    question: "¿Cómo se si mis cosas o mi espacio están seguros?",
    answer:
      "RaumLog actúa como intermediario gestionando los pagos de forma segura. Además, exigimos declaraciones del inventario y tanto el anfitrión como el usuario tienen la obligación de ejercer un derecho de inspección al momento de entrega y de salida.",
  },
  {
    question: "¿Que pasa si hay abandono de los bienes?",
    answer:
      "Nuestros términos son claros: si un usuario entra en mora y deja de pagar por más de 15 días calendario, el contrato permite a RaumLog o al anfitrión disponer legalmente de los bienes abandonados para liberar el espacio.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white" aria-label="Preguntas frecuentes">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-heading text-4xl lg:text-5xl text-[#2C5E8D] text-center mb-12 uppercase tracking-wide">
          Preguntas Frecuentes
        </h2>

        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="overflow-hidden rounded-lg">
                <button
                  className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${
                    isOpen
                      ? "bg-[#AECBE9] text-[#1a3d5c]"
                      : "bg-white border border-[#AECBE9] text-[#2C5E8D] hover:bg-[#AECBE9]/30"
                  }`}
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-base sm:text-lg flex items-center gap-2">
                    <span className="text-lg">{isOpen ? "–" : "+"}</span>
                    {faq.question}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 py-4 bg-white border border-t-0 border-[#AECBE9] text-[#2C5E8D]/90 text-sm sm:text-base leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
