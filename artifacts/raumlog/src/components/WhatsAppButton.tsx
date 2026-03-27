import { MessageCircle } from "lucide-react";

const WA_NUMBER = "573054162141";
const WA_MESSAGE = encodeURIComponent("Hola RaumLog, necesito ayuda con un espacio de almacenamiento");
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

export default function WhatsAppButton() {
  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      title="Chatea con RaumLog por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-full shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95 group"
      style={{ padding: "14px 18px" }}
    >
      <MessageCircle className="w-5 h-5 fill-white stroke-none" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-sm font-semibold pr-1">
        ¿Necesitas ayuda?
      </span>
    </a>
  );
}
