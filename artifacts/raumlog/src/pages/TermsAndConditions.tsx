import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10">
      <h2 className="text-xl font-bold text-[#1a3d5c] border-b border-[#AECBE9] pb-2 mb-4">{title}</h2>
      <div className="space-y-3 text-gray-700 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <p className="font-semibold text-[#2C5E8D] mb-1">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="ml-5 list-disc text-gray-700">{children}</li>
  );
}

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAFC]">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-[#AECBE9]/30 p-8 md:p-12">
          <div className="mb-10 text-center">
            <img src="/raumlog-logo-main.png" alt="RaumLog" className="h-16 w-auto mx-auto mb-4 object-contain" />
            <h1 className="text-3xl font-bold text-[#1a3d5c]">Términos y Condiciones de Uso</h1>
            <p className="text-sm text-gray-500 mt-2">Plataforma RaumLog · COMPAÑÍA DE ALMACENAMIENTO Y GESTIÓN S.A.S. (COALGE)</p>
            <p className="text-xs text-gray-400 mt-1">Última actualización: Febrero 2026</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-10 text-sm text-yellow-900">
            <strong>AVISO IMPORTANTE:</strong> Al aceptar estos Términos, usted acepta quedar obligado por todas las disposiciones que figuran a continuación, incluidas las relativas al arbitraje. Por favor léalas detenidamente.
          </div>

          <Section id="s1" title="1. Definiciones y Naturaleza Jurídica">
            <Sub title="1.1 Las Partes">
              <ul className="space-y-1">
                <Bullet><strong>COALGE S.A.S.:</strong> Sociedad comercial que actúa exclusivamente como intermediario tecnológico y agente de cobro, facilitando la conexión entre oferta y demanda.</Bullet>
                <Bullet><strong>Anfitrión:</strong> Persona natural o jurídica que publica y ofrece un Espacio para el almacenamiento, dispone legítimamente de ese Espacio y concede su uso temporal sin configurarse un contrato de arrendamiento.</Bullet>
                <Bullet><strong>Usuario:</strong> Persona natural o jurídica que recibe una licencia temporal para usar el Espacio del Anfitrión únicamente para el almacenamiento de Artículos Almacenados.</Bullet>
                <Bullet><strong>RaumLog / La Plataforma:</strong> Plataforma en línea que conecta Anfitriones con Usuarios a través del sitio www.raumlog.com y sus aplicaciones.</Bullet>
                <Bullet><strong>El Espacio:</strong> Área de la propiedad del Anfitrión ofrecida para almacenamiento.</Bullet>
                <Bullet><strong>Artículos Almacenados:</strong> Bienes o propiedad del Usuario que se almacenan en el Espacio del Anfitrión.</Bullet>
                <Bullet><strong>La Reserva:</strong> Transacción confirmada entre Anfitrión y Usuario mediante la cual el Usuario almacena su propiedad.</Bullet>
              </ul>
            </Sub>
            <Sub title="1.2 Naturaleza del Servicio">
              <p>Las partes declaran que la relación entre Anfitrión y Usuario <strong>no constituye un contrato de arrendamiento</strong> de vivienda urbana ni de local comercial. Se trata de un Contrato Atípico de Uso de Espacio para Almacenamiento. El Usuario renuncia expresamente a reclamar derechos de tenencia, prima comercial, renovación automática o desahucio. El Anfitrión retiene en todo momento la posesión del inmueble.</p>
            </Sub>
          </Section>

          <Section id="s2" title="2. El Servicio de RaumLog">
            <Sub title="2.1 Intermediación y exclusión de responsabilidad">
              <p>RaumLog proporciona una plataforma para conectar Anfitriones y Usuarios. <strong>RaumLog no es propietario, operador ni administrador de los espacios</strong>, ni actúa como depositario de los bienes. La responsabilidad de la custodia recae exclusivamente en el Anfitrión; la responsabilidad sobre la naturaleza de los bienes, en el Usuario.</p>
              <p>COALGE S.A.S. no responderá por daños causados por fuerza mayor, caso fortuito, culpa exclusiva de la víctima o de un tercero, ni por ninguna circunstancia diferente a la intermediación.</p>
            </Sub>
            <Sub title="2.2 Verificación de Antecedentes">
              <p>El Miembro de RaumLog autoriza a RaumLog y sus aliados a realizar verificaciones de antecedentes y listas restrictivas (LA/FT/PADM). RaumLog se reserva el derecho de negar el acceso basado en estos resultados.</p>
            </Sub>
          </Section>

          <Section id="s4" title="4. Política de No Discriminación">
            <p>RaumLog prohíbe expresamente rechazar a un Usuario por razones de raza, color, etnia, origen nacional, religión, orientación sexual, identidad de género, estado civil o discapacidad. Queda prohibido publicar anuncios que desanimen a grupos protegidos o aplicar condiciones diferentes por estas razones.</p>
          </Section>

          <Section id="s7" title="7. Impuestos y Facturación">
            <Sub title="7.1 Composición del Servicio">
              <p>El valor final a pagar se compone de: (i) tarifa del Anfitrión, (ii) comisión de intermediación de RaumLog, (iii) IVA calculado sobre el valor total, y (iv) costos transaccionales de la pasarela de pagos.</p>
            </Sub>
            <Sub title="7.2 Retención de IVA">
              <p>RaumLog actúa como agente retenedor de IVA. El Usuario paga el IVA sobre el 100% del servicio. RaumLog lo recauda y remite a la DIAN.</p>
            </Sub>
            <Sub title="7.3 Facturación">
              <p>RaumLog emitirá soporte de pago al Usuario por el valor total de la transacción (servicio + impuesto + costos transaccionales), y factura electrónica al Anfitrión por el valor de la comisión.</p>
            </Sub>
          </Section>

          <Section id="s8" title="8. Pagos">
            <Sub title="8.1 Exclusividad de la Plataforma">
              <p>Todos los pagos derivados del uso de los Servicios deben realizarse obligatoriamente a través de RaumLog, usando la pasarela <strong>Wompi</strong>.</p>
              <ul className="space-y-1 mt-2">
                <Bullet><strong>Prohibición de evasión:</strong> Está prohibido solicitar, ofrecer o aceptar pagos por fuera de la plataforma para evadir comisiones.</Bullet>
                <Bullet><strong>Sanción:</strong> Si RaumLog detecta un acuerdo de almacenamiento por fuera de la plataforma, podrá: (i) cancelar inmediatamente ambas cuentas y (ii) cobrar una <strong>Cláusula Penal equivalente a seis (6) meses</strong> de la Tarifa Total Mensual estimada.</Bullet>
              </ul>
            </Sub>
            <Sub title="8.4 Recepción de dinero del Anfitrión">
              <ul className="space-y-1">
                <Bullet><strong>Corte Semanal:</strong> Los pagos se transfieren semanalmente al Anfitrión el día <strong>viernes</strong> (o el día hábil siguiente).</Bullet>
                <Bullet><strong>Descuentos:</strong> RaumLog descuenta la comisión, los impuestos y los costos de pasarela antes de transferir.</Bullet>
                <Bullet><strong>Garantía:</strong> El pago solo se libera si el servicio ha comenzado sin reporte de problemas graves.</Bullet>
              </ul>
            </Sub>
          </Section>

          <Section id="s11" title="11. Reservas y Términos Financieros">
            <Sub title="11.2 Tarifas">
              <p>Las Tarifas Totales incluyen la Tarifa del Espacio, la Tarifa de Servicio, la Tarifa de Procesamiento y los Complementos aplicables. Las Tarifas de Servicio y Procesamiento <strong>no son reembolsables</strong> una vez perfeccionada la Reserva.</p>
            </Sub>
            <Sub title="11.11 Valor máximo declarado">
              <p>El Usuario se obliga a no almacenar bienes cuyo valor total supere los <strong>$50.000.000 COP</strong>. Si supera este límite, debe contratar una póliza de seguro adicional. En ausencia de seguro, la responsabilidad de COALGE y el Anfitrión está limitada a este tope.</p>
            </Sub>
          </Section>

          <Section id="s14" title="14. Uso del Espacio y Artículos Prohibidos">
            <Sub title="14.2 Artículos prohibidos">
              <p>Está expresamente prohibido el almacenamiento de los siguientes elementos:</p>
              <ul className="space-y-1 mt-2">
                <Bullet>Explosivos, combustibles, materiales peligrosos o inflamables.</Bullet>
                <Bullet>Material biológico: cadáveres, restos humanos o animales, tejidos orgánicos, fluidos corporales, órganos o muestras de laboratorio.</Bullet>
                <Bullet>Pesticidas u otros químicos tóxicos.</Bullet>
                <Bullet>Residuos, basura o desechos de cualquier tipo.</Bullet>
                <Bullet>Armas de fuego o municiones.</Bullet>
                <Bullet>Drogas, estupefacientes o mercancías ilegales.</Bullet>
                <Bullet>Bienes robados o de contrabando.</Bullet>
                <Bullet>Alimentos perecederos, animales (vivos o muertos), artículos con plagas o moho.</Bullet>
                <Bullet>Baterías de litio de gran capacidad que puedan representar riesgo de incendio.</Bullet>
                <Bullet>Artículos que emitan humos u olores intensos.</Bullet>
                <Bullet>Cualquier objeto cuya posesión o transporte vulnere las leyes colombianas.</Bullet>
              </ul>
              <p className="mt-2">Además, está prohibido <strong>fumar en el Espacio</strong>, vivir o trabajar en él, recibir correspondencia o utilizarlo como dirección postal o domicilio legal.</p>
            </Sub>
          </Section>

          <Section id="s18" title="18. Tarifas Adicionales y Cobranzas">
            <Sub title="18.1 Cargos por mora">
              <p>Si el Usuario no realiza un pago dentro de los cinco (5) días calendario posteriores a su vencimiento, estará sujeto a un cargo administrativo por mora equivalente a <strong>$20.000 COP</strong> o el 5% del valor de la tarifa mensual, lo que resulte mayor.</p>
            </Sub>
            <Sub title="18.2 Gastos de cobranza">
              <p>Las notificaciones formales por falta de pago generarán una tarifa de gestión de <strong>$50.000 COP</strong> por cada comunicación enviada.</p>
            </Sub>
            <Sub title="18.3 Intereses moratorios">
              <p>Los saldos impagos generarán intereses de mora a la tasa máxima legal comercial permitida desde la fecha de vencimiento hasta el pago total.</p>
            </Sub>
          </Section>

          <Section id="s22" title="22. Descargos y Limitaciones de Responsabilidad">
            <Sub title="22.2 Límite máximo de daños">
              <p>La responsabilidad total y acumulada de COALGE S.A.S. frente a cualquier Miembro de RaumLog estará limitada al <strong>menor</strong> de los siguientes valores:</p>
              <ul className="space-y-1 mt-2">
                <Bullet>El monto total de las Tarifas de Servicio pagadas a COALGE S.A.S. durante los <strong>doce (12) meses anteriores</strong> al hecho que originó la reclamación.</Bullet>
                <Bullet>La suma de <strong>TRESCIENTOS MIL PESOS ($300.000 COP)</strong> si el Miembro no hubiese pagado tarifas previas.</Bullet>
              </ul>
              <p className="mt-2">Este límite no aplica a la obligación de COALGE S.A.S. de transferir al Anfitrión los fondos efectivamente recaudados y libres de disputa.</p>
            </Sub>
          </Section>

          <Section id="s25" title="25. Resolución de Disputas y Arbitraje">
            <Sub title="25.1 Arreglo directo">
              <p>Antes de cualquier acción legal, las partes buscarán solución amistosa. Si tras <strong>treinta (30) días calendario</strong> no se llega a un acuerdo, se procederá al arbitraje.</p>
            </Sub>
            <Sub title="25.2 Tribunal de Arbitramento">
              <p>Toda controversia será dirimida por un tribunal de arbitramento administrado por el <strong>Centro de Conciliación, Arbitraje y Amigable Composición de la Cámara de Comercio de Medellín para Antioquia</strong>. El tribunal estará conformado por:</p>
              <ul className="space-y-1 mt-2">
                <Bullet>Un (1) árbitro para pretensiones ≤ 400 SMMLV.</Bullet>
                <Bullet>Tres (3) árbitros para pretensiones &gt; 400 SMMLV o cuantía indeterminada.</Bullet>
              </ul>
              <p className="mt-2">Los árbitros serán designados de común acuerdo o por sorteo del Centro. El laudo se decidirá en derecho.</p>
            </Sub>
            <Sub title="25.3 Excepciones al arbitraje">
              <p>Quedan excluidas del arbitraje las acciones por infracción de propiedad intelectual y los procesos ejecutivos para el cobro de deudas, los cuales podrán adelantarse ante la jurisdicción ordinaria colombiana.</p>
            </Sub>
          </Section>

          <Section id="s26" title="26. Cumplimiento y Prevención del Riesgo (LA/FT/PADM)">
            <p>Al aceptar estos Términos, el Miembro de RaumLog declara bajo la gravedad del juramento que sus recursos no provienen ni se destinan a actividades ilícitas, particularmente lavado de activos, financiación del terrorismo o proliferación de armas de destrucción masiva.</p>
            <p className="mt-2">COALGE S.A.S. queda facultada para consultar listas restrictivas (OFAC, ONU, listas de terroristas de EE.UU. y UE) y reportar operaciones sospechosas ante la UIAF, sin que esto genere responsabilidad alguna para la plataforma.</p>
          </Section>

          <Section id="s27" title="27. Miscelánea">
            <p>Estos Términos constituyen la totalidad del acuerdo entre las partes. La intermediación de RaumLog <strong>no genera un contrato de arrendamiento</strong> sujeto a la Ley 820 de 2003 o al Código Civil colombiano. Ante cualquier duda o reclamación, contáctenos en <a href="mailto:contacto@raumlog.com" className="text-[#2C5E8D] underline">contacto@raumlog.com</a>.</p>
          </Section>

          <div className="border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
            <p>© {new Date().getFullYear()} COALGE S.A.S. · NIT 902.029.993 · Medellín, Colombia</p>
            <p className="mt-1">
              <Link to="/politica-de-privacidad" className="text-[#2C5E8D] hover:underline">Política de Privacidad</Link>
              {" · "}
              <Link to="/" className="text-[#2C5E8D] hover:underline">Volver al inicio</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
