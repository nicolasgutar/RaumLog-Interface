import { Search, FileCheck, Package } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Encuentra",
    description: "Busca espacios disponibles cerca de ti con nuestro buscador intuitivo.",
  },
  {
    icon: FileCheck,
    title: "Reserva",
    description: "Selecciona el espacio ideal, firma el contrato digital y paga de forma segura.",
  },
  {
    icon: Package,
    title: "Almacena",
    description: "Lleva tus cosas al espacio acordado con el anfitrión y comienza a ahorrar.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#2C5E8D]" aria-label="Cómo funciona">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="font-heading text-4xl lg:text-5xl text-white mb-4 uppercase tracking-wide">
          ¿Cómo funciona?
        </h2>
        <p className="text-[#AECBE9] mb-12 text-lg max-w-xl mx-auto">
          En tres simples pasos puedes empezar a almacenar hoy mismo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex flex-col items-center bg-white/10 rounded-2xl p-8 text-white">
                <div className="w-16 h-16 rounded-full bg-[#AECBE9]/30 flex items-center justify-center mb-5">
                  <Icon className="w-8 h-8 text-[#AECBE9]" />
                </div>
                <div className="text-[#AECBE9] text-4xl font-bold mb-2">{i + 1}</div>
                <h3 className="font-heading text-2xl uppercase mb-3">{step.title}</h3>
                <p className="text-[#AECBE9]/90 text-sm leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
