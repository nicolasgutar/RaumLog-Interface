import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10">
      <h2 className="font-heading text-xl tracking-wide text-[#2C5E8D] border-b-2 border-[#AECBE9] pb-2 mb-4">
        {title}
      </h2>
      <div className="space-y-4 text-gray-700 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="font-semibold text-[#1a3d5c] mb-2">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="space-y-1.5 ml-1">{children}</ul>;
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="mt-0.5 text-[#2C5E8D] flex-shrink-0">•</span>
      <span>{children}</span>
    </li>
  );
}

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="bg-[#2C5E8D] py-14 px-4 text-center">
        <h1 className="font-heading text-4xl lg:text-5xl text-white mb-3 uppercase tracking-wide">
          Términos y Condiciones
        </h1>
        <p className="text-[#AECBE9] text-base lg:text-lg">
          COMPAÑÍA DE ALMACENAMIENTO Y GESTIÓN S.A.S. (COALGE)
        </p>
      </section>

      <main className="flex-1 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-10 text-sm text-yellow-900">
            <strong>AVISO IMPORTANTE:</strong> AL ACEPTAR ESTOS TÉRMINOS, USTED ACEPTA QUEDAR OBLIGADO POR TODAS LAS DISPOSICIONES QUE FIGURAN A CONTINUACIÓN, INCLUIDAS, SIN LIMITACIÓN, LAS DISPOSICIONES RELATIVAS AL ARBITRAJE. POR FAVOR LÉALAS DETENIDAMENTE.
          </div>

          {/* SECTION 1 */}
          <Section id="s1" title="1. Definiciones y naturaleza jurídica">
            <Sub title="1.1 Las Partes">
              <Ul>
                <Li><strong>COALGE S.A.S.</strong> (en adelante "COALGE"): Sociedad comercial que actúa exclusivamente como intermediario tecnológico y agente de cobro, facilitando la conexión entre oferta y demanda.</Li>
                <Li><strong>Anfitrión:</strong> Persona natural o jurídica que publica y ofrece un Espacio para el almacenamiento de Artículos Almacenados, dispone legítimamente de ese Espacio y concede su uso temporal para almacenamiento sin configurarse un contrato de arrendamiento.</Li>
                <Li><strong>Usuario:</strong> Persona natural o jurídica que recibe una licencia temporal en virtud de estos Términos para usar el Espacio del Anfitrión únicamente para el almacenamiento de Artículos Almacenados.</Li>
                <Li><strong>La Plataforma o RaumLog:</strong> Marca operada por COALGE S.A.S. Plataforma en línea que conecta Anfitriones con Usuarios, incluyendo todas las aplicaciones web, móviles y demás software, servicios de atención al cliente y el sitio www.raumlog.com.</Li>
                <Li><strong>Los Servicios:</strong> La intermediación por parte de RaumLog entre Anfitriones y Usuarios, y cualquier servicio que ofrezcamos a través de la plataforma.</Li>
                <Li><strong>El Espacio:</strong> Área de la propiedad del Anfitrión ofrecida para almacenamiento.</Li>
                <Li><strong>El o los Anuncio(s):</strong> Descripción que se puede buscar y que promociona el Espacio del Anfitrión tal como aparece en el Sitio o en los Servicios.</Li>
                <Li><strong>El o los Complemento(s):</strong> Artículos y servicios adicionales identificados en un Anuncio, ofrecidos y prestados por el Anfitrión en relación con el Espacio.</Li>
                <Li><strong>Los Artículos Almacenados:</strong> Bienes o propiedad del Usuario que se almacenan en el Espacio del Anfitrión.</Li>
                <Li><strong>La Reserva:</strong> Transacción confirmada entre Anfitrión y Usuario mediante la cual el Usuario almacena su propiedad en el Espacio del Anfitrión.</Li>
                <Li><strong>Miembro de RaumLog:</strong> Persona que crea una cuenta en RaumLog mediante el proceso de registro, incluyendo Anfitriones y Usuarios.</Li>
                <Li><strong>Contenido de RaumLog:</strong> Todo el Contenido que RaumLog o COALGE ponen a disposición a través del Sitio, incluyendo contenido licenciado de terceros.</Li>
                <Li><strong>Contenido de Miembros de RaumLog:</strong> Todo el Contenido que un Miembro publique, cargue, difunda o transmita a través del Sitio, sujeto a la Política de Tratamiento de Datos.</Li>
                <Li><strong>El Contenido Colectivo:</strong> Conjunto de todo el Contenido de Miembros y el Contenido de RaumLog.</Li>
                <Li><strong>El Contenido:</strong> Texto, gráficos, imágenes, software, audio, video, información u otros materiales.</Li>
              </Ul>
            </Sub>
            <Sub title="1.2 Naturaleza del Servicio">
              <p>Las partes declaran y aceptan expresamente que la relación entre Anfitrión y Usuario <strong>no constituye un contrato de arrendamiento</strong> de vivienda urbana ni de local comercial.</p>
              <p>Se trata de un <strong>Contrato Atípico de Uso de Espacio para Almacenamiento</strong>, por lo cual el Usuario renuncia expresamente a reclamar derechos de tenencia, prima comercial, renovación automática o desahucio. El Anfitrión retiene en todo momento la posesión del inmueble, cediendo únicamente la tenencia precaria de un área delimitada para el depósito de bienes.</p>
            </Sub>
          </Section>

          {/* SECTION 2 */}
          <Section id="s2" title="2. El Servicio de RaumLog">
            <Sub title="2.1 Intermediación y exclusión de responsabilidad">
              <p>RaumLog proporciona una plataforma en línea para conectar Anfitriones y Usuarios. <strong>RaumLog no es propietario, operador ni administrador de los espacios</strong>, ni actúa como depositario de los bienes. La responsabilidad de la custodia recae exclusivamente en el Anfitrión y la responsabilidad sobre la naturaleza de los bienes en el Usuario.</p>
              <p>COALGE S.A.S. no responderá de ninguna manera por daños causados por fuerza mayor, caso fortuito, culpa exclusiva de la víctima o de un tercero, culpa o dolo de cualquier grado por parte de alguna de las partes, ni por ninguna otra circunstancia diferente a la intermediación entre Anfitriones y Usuarios.</p>
            </Sub>
            <Sub title="2.2 Verificación de antecedentes">
              <p>El Miembro de RaumLog autoriza a RaumLog y sus aliados a realizar verificaciones de antecedentes y listas restrictivas (LA/FT/PADM). RaumLog se reserva el derecho de negar el acceso a la plataforma basado en estos resultados.</p>
            </Sub>
            <Sub title="2.3 Responsabilidades de RaumLog">
              <p>RaumLog pone a disposición una plataforma con tecnología para que Usuarios y Anfitriones se encuentren en línea y acuerden Reservas de almacenamiento. RaumLog no es propietario ni operador de Anuncios/Espacios, ni es corredor de bienes raíces, agente inmobiliario, asegurador o agente de depósito en garantía. Las responsabilidades de RaumLog se limitan a facilitar la disponibilidad del Sitio, los Servicios y su plataforma. RaumLog no actúa como agente de ningún Miembro excepto para el propósito limitado de aceptar pagos de Usuarios en nombre del Anfitrión.</p>
            </Sub>
          </Section>

          {/* SECTION 3 */}
          <Section id="s3" title="3. Términos relacionados al Servicio">
            <Sub title="3.1 Aceptación de los Términos">
              <p>Al utilizar el Sitio o los Servicios, usted acepta cumplir y quedar legalmente obligado por los presentes Términos. Si usted no está de acuerdo con estos Términos, no tiene derecho a obtener información de los Servicios ni a seguir utilizándolos. El uso no autorizado puede resultar en que se le prohíba el acceso y puede someterlo a responsabilidad civil y/o sanciones penales.</p>
            </Sub>
            <Sub title="3.2 Acuerdos entre Anfitriones y Usuarios">
              <p>Usted entiende y acepta que RaumLog no es parte de ningún acuerdo celebrado entre Anfitriones y Usuarios. Todos los pagos relacionados con la Reserva deben procesarse <strong>exclusivamente a través de la Plataforma RaumLog</strong>.</p>
            </Sub>
            <Sub title="3.3 Obligaciones de cumplimiento normativo">
              <p>Usted acepta que es el único responsable de familiarizarse y cumplir con cualquier ley u otra regulación relacionada con el arriendo y/o uso del espacio. RaumLog no asesora sobre asuntos legales.</p>
            </Sub>
            <Sub title="3.4 Contenido de los Anuncios e idoneidad del Espacio">
              <p>RaumLog no puede controlar el Contenido de ningún Anuncio, ni la condición, legalidad o idoneidad de ningún Espacio o Complemento. Los Usuarios son los únicos responsables de determinar la idoneidad y legalidad de cualquier Espacio. En consecuencia, todas las Reservas se realizarán bajo el riesgo exclusivo del Anfitrión y del Usuario.</p>
            </Sub>
            <Sub title="3.5 Autoridad y capacidad jurídica">
              <p>Al acceder o utilizar el Sitio, usted indica que ha leído, comprende y acepta quedar obligado por estos Términos. El Sitio está destinado exclusivamente a personas mayores de dieciocho (18) años de edad con plena capacidad jurídica conforme a las leyes de la República de Colombia. Queda expresamente prohibido el registro y uso de la Plataforma por parte de menores de dieciocho (18) años. Si RaumLog detecta que un Miembro es menor de edad, procederá a cancelar su cuenta de manera inmediata.</p>
            </Sub>
            <Sub title="3.6 Derecho de Retracto">
              <p>De conformidad con el artículo 47 de la Ley 1480 de 2011 (Estatuto del Consumidor de Colombia), el Usuario que haya celebrado la Reserva de manera remota o no presencial tendrá derecho a retractarse de la misma dentro de los cinco (5) días hábiles siguientes a la fecha de celebración del contrato, siempre y cuando el servicio no haya iniciado, es decir, siempre que el Anfitrión no haya recibido aún los Artículos Almacenados.</p>
              <p>Una vez el Anfitrión haya recibido físicamente los Artículos Almacenados y el servicio haya dado inicio formal, el derecho de retracto quedará extinguido de pleno derecho, de conformidad con el literal b) del artículo 47 de la Ley 1480 de 2011.</p>
              <p>Para ejercer este derecho, el Usuario deberá notificar su decisión mediante correo electrónico a <a href="mailto:contacto@raumlog.com" className="text-[#2C5E8D] underline">contacto@raumlog.com</a>, con el asunto "Retracto – [número de Reserva]", antes de que el servicio inicie y antes del vencimiento del plazo legal. RaumLog procederá al reembolso total de los valores pagados dentro de los treinta (30) días calendario siguientes a la recepción de la notificación de retracto válida.</p>
            </Sub>
            <Sub title="3.7 Aviso de gravamen">
              <p className="uppercase font-semibold text-gray-600 text-xs">AL ACCEDER AL SITIO Y COMPLETAR CUALQUIER RESERVA, USTED CONSIENTE LA CREACIÓN DE UN GRAVAMEN Y LA FACULTAD DE RAUMLOG DE VENDER LOS ARTÍCULOS ALMACENADOS PARA SATISFACER DICHO GRAVAMEN.</p>
            </Sub>
          </Section>

          {/* SECTION 4 */}
          <Section id="s4" title="4. Política de no discriminación">
            <Sub title="4.1 Cumplimiento con la ley aplicable">
              <p>Para seguir siendo Miembro de RaumLog se requiere que usted cumpla todas las normas jurídicas aplicables. Usted no puede:</p>
              <Ul>
                <Li>Rechazar a un Usuario con base en su raza, color, etnia, origen nacional, religión, orientación sexual, identidad de género o estado civil.</Li>
                <Li>Imponer términos o condiciones diferentes basados en cualquiera de las características protegidas anteriores.</Li>
                <Li>Publicar Anuncios que desanimen o indiquen preferencia por razones discriminatorias.</Li>
                <Li>Rechazar a un Usuario por alguna discapacidad real o percibida.</Li>
                <Li>Cobrar más en tarifas a Usuarios con discapacidad.</Li>
                <Li>Negarse a comunicarse a través de medios accesibles disponibles.</Li>
              </Ul>
            </Sub>
            <Sub title="4.2 Rechazo de Anfitriones o Usuarios">
              <p>Los Anfitriones o Usuarios que demuestren un patrón de rechazo a Miembros de una clase protegida debilitan la fortaleza de nuestra comunidad. RaumLog se reserva la facultad de eliminar Miembros de la plataforma, para velar por un buen uso de la comunidad de RaumLog.</p>
            </Sub>
          </Section>

          {/* SECTION 5 */}
          <Section id="s5" title="5. Cuentas">
            <Sub title="5.1 Información de la cuenta">
              <p>Su Cuenta RaumLog será creada con base en la información personal que usted proporcione. Usted no puede tener más de una (1) Cuenta RaumLog activa. Usted acepta proporcionar información precisa, actual y completa y actualizarla oportunamente. RaumLog se reserva el derecho de suspender o terminar su Cuenta sin causa o aviso.</p>
            </Sub>
            <Sub title="5.2 Contraseña">
              <p>Usted es responsable de salvaguardar su contraseña y acepta la responsabilidad exclusiva por cualquier actividad realizada bajo su Cuenta. Notifique de inmediato a RaumLog cualquier uso no autorizado escribiendo a <a href="mailto:contacto@raumlog.com" className="text-[#2C5E8D] underline">contacto@raumlog.com</a>.</p>
            </Sub>
            <Sub title="5.3 Comunicaciones y avisos">
              <p>USTED ACEPTA QUE TODOS LOS AVISOS REQUERIDOS POR ESTOS TÉRMINOS O POR LEY PODRÁN SER ENVIADOS POR RAUMLOG A LA DIRECCIÓN DE CORREO ELECTRÓNICO QUE USTED HAYA PROPORCIONADO. USTED OTORGA CONSENTIMIENTO EXPRESO PARA SER CONTACTADO POR MEDIOS ESCRITOS, ELECTRÓNICOS O VERBALES, INCLUYENDO CORREO, MENSAJES DE TEXTO Y CORREOS ELECTRÓNICOS.</p>
            </Sub>
          </Section>

          {/* SECTION 6 */}
          <Section id="s6" title="6. Anuncios y Espacios">
            <Sub title="6.1 Creación de Anuncios">
              <p>Como Miembro de RaumLog, usted puede crear Anuncios respondiendo preguntas sobre el Espacio (ubicación, capacidad, tamaño, características, disponibilidad, precios, normas y términos financieros). Para ser incluido en Anuncios, el Espacio debe contar con una dirección física válida.</p>
            </Sub>
            <Sub title="6.2 Responsabilidad del Anfitrión por Anuncios">
              <p>Usted es responsable de todos y cada uno de los Anuncios que publique. Declara y garantiza que cualquier Anuncio: (i) no vulnerará ningún acuerdo con terceros; (ii) cumplirá con todas las leyes, requisitos tributarios y normas aplicables; y (iii) no entrará en conflicto con los derechos de terceros.</p>
            </Sub>
            <Sub title="6.3 Derecho de RaumLog a eliminar Anuncios">
              <p>RaumLog se reserva el derecho, en cualquier momento y sin previo aviso, de eliminar o inhabilitar el acceso a cualquier Anuncio que se considere objetable, contravenga estos Términos o la Ley Aplicable, o resulte perjudicial para su comunidad o el Sitio.</p>
            </Sub>
            <Sub title="6.4 Descripción del Espacio">
              <p>Cada Anfitrión debe proporcionar una descripción veraz y precisa del Espacio. Si un Anfitrión tergiversa un Espacio, RaumLog puede retener o recuperar pagos al Anfitrión. Si el Usuario mueve Artículos Almacenados al Espacio, confirma que la descripción del Anuncio es precisa.</p>
            </Sub>
          </Section>

          {/* SECTION 7 */}
          <Section id="s7" title="7. Impuestos y facturación">
            <Sub title="7.1 Composición del Servicio">
              <p>El valor final a pagar se compone de: (i) la tarifa establecida por el Anfitrión, (ii) la comisión por intermediación de RaumLog, (iii) el Impuesto sobre las Ventas (IVA) calculado sobre el valor total del servicio, y (iv) los costos transaccionales de la pasarela de pagos.</p>
            </Sub>
            <Sub title="7.2 Retención de IVA">
              <p>En cumplimiento de la normativa tributaria vigente, RaumLog actuará como agente retenedor de IVA. RaumLog recaudará dicho impuesto y será el responsable de su reporte y remisión ante la Dirección de Impuestos y Aduanas Nacionales (DIAN).</p>
            </Sub>
            <Sub title="7.3 Facturación y soportes">
              <Ul>
                <Li>RaumLog emitirá al Usuario un soporte de pago por el valor total de la transacción.</Li>
                <Li>RaumLog emitirá al Anfitrión una factura electrónica por el valor de la comisión de intermediación tecnológica.</Li>
                <Li>Toda factura será emitida a nombre de la persona natural o jurídica cuyos datos hayan sido registrados en la Cuenta al momento de realizar la Reserva.</Li>
              </Ul>
            </Sub>
          </Section>

          {/* SECTION 8 */}
          <Section id="s8" title="8. Pagos">
            <Sub title="8.1 Exclusividad de la Plataforma">
              <p>Todos los pagos derivados del uso de los Servicios deben realizarse obligatoriamente a través de RaumLog utilizando la pasarela <strong>Wompi</strong>.</p>
              <Ul>
                <Li><strong>Prohibición de evasión:</strong> Está prohibido solicitar, ofrecer o aceptar pagos totales o parciales por fuera de la plataforma.</Li>
                <Li><strong>Sanción por incumplimiento:</strong> Si RaumLog detecta un acuerdo por fuera de la plataforma, podrá cancelar inmediatamente ambas cuentas y cobrar una <strong>Cláusula Penal equivalente a seis (6) meses</strong> de la Tarifa Total Mensual estimada.</Li>
                <Li><strong>Exención de responsabilidad:</strong> RaumLog no asumirá ningún tipo de soporte técnico, mediación o responsabilidad por disputas derivadas de acuerdos pactados por fuera de la plataforma.</Li>
              </Ul>
            </Sub>
            <Sub title="8.2 Pasarela de pagos (Wompi)">
              <p>El procesamiento de los pagos estará a cargo de Wompi S.A.S. Al realizar una Reserva, el Usuario acepta los términos y condiciones de dicha pasarela. RaumLog no se hace responsable por comisiones adicionales, intereses o cargos que el banco emisor pueda aplicar.</p>
            </Sub>
            <Sub title="8.3 Recepción de dinero del Anfitrión">
              <Ul>
                <Li><strong>Corte semanal:</strong> Los pagos recibidos y servicios iniciados durante la semana serán liquidados y enviados a la cuenta bancaria del Anfitrión el día <strong>viernes</strong> de cada semana.</Li>
                <Li><strong>Descuentos:</strong> Antes de enviar el dinero, RaumLog descontará automáticamente la comisión, los impuestos y los costos de la pasarela de pagos.</Li>
                <Li><strong>Garantía de satisfacción:</strong> El pago solo se enviará si el servicio ha comenzado con normalidad.</Li>
                <Li><strong>Abandono de fondos:</strong> Si el Anfitrión no facilita una cuenta válida por un periodo de seis (6) meses, perderá el derecho a recibir dichos fondos.</Li>
              </Ul>
            </Sub>
            <Sub title="8.4 Depósito de garantía">
              <p>Al momento de confirmar la Reserva, el Usuario deberá depositar una suma equivalente a un (1) mes de la Tarifa Total como depósito de garantía. Este depósito será administrado por COALGE S.A.S. en nombre del Anfitrión y podrá ser aplicado, total o parcialmente, al pago de: (i) daños causados al Espacio o a la propiedad del Anfitrión, (ii) saldos insolutos del Usuario, (iii) costos de limpieza o desalojo, o (iv) cualquier otro incumplimiento del Usuario previsto en estos Términos.</p>
              <p>Al finalizar la Reserva sin incidentes, el depósito de garantía será devuelto al Usuario dentro de los siete (7) días hábiles siguientes a la verificación del estado del Espacio por parte del Anfitrión y la confirmación de que no existen saldos pendientes. En caso de disputa sobre la aplicación total o parcial del depósito, se seguirá el procedimiento establecido en la Sección 25. El depósito de garantía no genera intereses a favor del Usuario.</p>
            </Sub>
          </Section>

          {/* SECTION 9 */}
          <Section id="s9" title="9. Seguro">
            <p>RaumLog <strong>no proporciona seguro</strong> a Anfitriones ni Usuarios. Los Anfitriones y Usuarios son responsables de proporcionar su propio seguro para cubrir daños que puedan ocurrir. RaumLog recomienda que los Usuarios adquieran seguro para sus artículos almacenados, el cual está disponible a través de la mayoría de las aseguradoras.</p>
          </Section>

          {/* SECTION 10 */}
          <Section id="s10" title="10. Verificaciones e inspecciones">
            <Sub title="10.1 Verificaciones de seguridad">
              <p>Los Anfitriones y Usuarios tienen el derecho de realizar verificaciones de identidad, antecedentes penales y antecedentes crediticios de la otra parte. RaumLog se reserva el derecho, pero no la obligación, de realizar estas mismas verificaciones.</p>
            </Sub>
            <Sub title="10.2 Obligación del derecho de inspección">
              <p>Para garantizar la seguridad de la red, el Anfitrión tiene la <strong>obligación</strong> de ejercer el Derecho de Inspección al momento de recibir los artículos y al momento de su retiro final. El Anfitrión deberá verificar, en presencia del Usuario, que los Artículos Almacenados no forman parte de la lista de Bienes Prohibidos. El Anfitrión que omita realizar la inspección inicial asume bajo su propio riesgo la responsabilidad civil o penal derivada de cualquier daño o sanción legal.</p>
            </Sub>
            <Sub title="10.3 Verificación de la propiedad">
              <p>El Anfitrión declara, bajo la gravedad de juramento, que es el propietario, arrendatario autorizado o poseedor legítimo del espacio que ofrece en RaumLog, y que cuenta con las facultades legales para permitir el almacenamiento de bienes de terceros.</p>
            </Sub>
          </Section>

          {/* SECTION 11 */}
          <Section id="s11" title="11. Reservas y términos financieros">
            <Sub title="11.1 Aceptación y rechazo de Reservas">
              <p>Si usted es Anfitrión y se solicita una Reserva para su Espacio, deberá aprobar o rechazar la Reserva dentro de las <strong>24 horas</strong> siguientes a la solicitud; de lo contrario, se rechazará automáticamente. Un Miembro de RaumLog no puede ser simultáneamente Usuario y Anfitrión para la misma Reserva.</p>
            </Sub>
            <Sub title="11.2 Tarifas">
              <p>Las <strong>Tarifas de Servicio y de Procesamiento no son reembolsables</strong> una vez perfeccionada la Reserva.</p>
            </Sub>
            <Sub title="11.3 Pago del Usuario">
              <p>Cada Usuario acepta pagar las Tarifas Totales una vez el Anfitrión confirme la Reserva. Si un Usuario disputa un cargo ante su banco pero el cobro era debido según estos Términos, el Usuario reconoce que aún adeuda dicho monto a COALGE.</p>
            </Sub>
            <Sub title="11.4 Pagos recurrentes">
              <p>Para reservas de larga duración, el Usuario autoriza cobros automáticos en cada Fecha de Renovación, conforme a los términos acordados al momento de la Reserva.</p>
            </Sub>
            <Sub title="11.5 Divulgaciones y propiedad protegida">
              <p>Al solicitar la Reserva, el Usuario debe declarar la naturaleza de los Artículos Almacenados. Queda estrictamente prohibido guardar armas, drogas, sustancias peligrosas o documentos con datos sensibles de terceros. El Usuario es el único responsable por cualquier daño causado por artículos no declarados o prohibidos.</p>
            </Sub>
            <Sub title="11.6 Acceso al Espacio">
              <p>El Usuario debe contactar al Anfitrión con al menos <strong>24 horas de anticipación</strong> para solicitar acceso, a menos que se indique lo contrario en el Anuncio.</p>
            </Sub>
            <Sub title="11.7 Transporte de Artículos Almacenados">
              <p>El Anfitrión no está obligado a transportar ni manipular los Artículos Almacenados. Si un Anfitrión los transporta o manipula, lo hace bajo su propio riesgo.</p>
            </Sub>
            <Sub title="11.8 Desocupación del Espacio">
              <p>El Usuario debe retirar todos los Artículos Almacenados y dejar el Espacio limpio ("limpieza con escoba") al finalizar el Periodo de Reserva. El incumplimiento generará cargos adicionales por limpieza o días extra de ocupación.</p>
            </Sub>
            <Sub title="11.9 Bienes abandonados">
              <p>Se consideran Artículos Almacenados en situación de abandono legal aquellos que permanezcan en el Espacio después de <strong>quince (15) días calendario</strong> contados a partir de: (i) la terminación del Periodo de Reserva, (ii) el incumplimiento en el pago de las Tarifas Totales, o (iii) la cancelación de la cuenta del Usuario.</p>
              <p>Al aceptar estos Términos, el Usuario autoriza la siguiente jerarquía de disposición:</p>
              <Ul>
                <Li><strong>Derecho de Retención Contractual:</strong> COALGE y el Anfitrión podrán impedir el retiro de los bienes hasta que se satisfaga cualquier deuda pendiente.</Li>
                <Li><strong>Opción de Adjudicación al Anfitrión:</strong> COALGE podrá ofrecer al Anfitrión la propiedad de los Artículos Almacenados como compensación por dación en pago.</Li>
                <Li><strong>Adjudicación a favor de COALGE:</strong> Si el Anfitrión no manifiesta interés, la propiedad se transferirá de pleno derecho a COALGE S.A.S.</Li>
                <Li><strong>Facultad de Destrucción o Venta:</strong> El nuevo titular queda plenamente facultado para vender, donar, desechar o destruir los bienes sin necesidad de aviso previo ni autorización judicial.</Li>
                <Li><strong>Exoneración Total:</strong> El Usuario renuncia a cualquier acción de reivindicación o indemnización por la pérdida de la propiedad.</Li>
                <Li><strong>Entrega a las Autoridades:</strong> Los Bienes Prohibidos considerados ilegales serán entregados a la autoridad competente.</Li>
              </Ul>
            </Sub>
            <Sub title="11.10 Cancelaciones y reembolsos">
              <Ul>
                <Li><strong>Por el Usuario:</strong> Reembolso del 100% si cancela con más de 7 días de antelación. Si cancela con menos de 7 días, se retienen las comisiones. Una vez iniciada la Reserva, no hay reembolsos por días no utilizados.</Li>
                <Li><strong>Por el Anfitrión:</strong> Si cancela una reserva activa debe dar un preaviso de 30 días. Sin preaviso, se cobrará una penalidad equivalente al valor de la Tarifa de la Reserva.</Li>
              </Ul>
            </Sub>
            <Sub title="11.11 Valor máximo permitido">
              <p>El Usuario se obliga a no almacenar bienes cuyo valor total supere los <strong>$50.000.000 COP</strong>. Si el Usuario almacena bienes que superen este valor, estará obligado a contratar una póliza de seguro adicional. La responsabilidad de COALGE y el Anfitrión estará limitada estrictamente a dicho tope.</p>
              <p>Para garantizar el cumplimiento de este límite, el Usuario deberá diligenciar y firmar, bajo la gravedad de juramento, una Declaración de Valor de los Artículos Almacenados al momento de confirmar la Reserva. COALGE y/o el Anfitrión podrán exigir en cualquier momento documentación soporte del valor declarado (facturas, avalúos, certificados de seguro u otros medios probatorios).</p>
              <p>Si el Usuario almacena bienes cuyo valor real supere el límite declarado o el tope de $50.000.000 COP sin haber contratado la póliza de seguro requerida, COALGE y el Anfitrión quedarán total e irrevocablemente exonerados de cualquier responsabilidad por pérdida, daño, deterioro o sustracción de la totalidad de los Artículos Almacenados, incluidos aquellos cuyo valor individual esté dentro del límite permitido. La omisión o falsedad en la Declaración de Valor facultará a RaumLog para terminar la Reserva de manera inmediata y retener el depósito de garantía.</p>
            </Sub>
            <Sub title="11.12 Descuento del primer mes">
              <p>Cuando se ofrezca, el descuento del primer mes solo estará disponible para Reservas de más de un mes de duración. Si el Usuario recibe un descuento y la Reserva se cancela antes de que se cobre el segundo mes, se le cobrará al Usuario el monto del descuento del primer mes.</p>
            </Sub>
          </Section>

          {/* SECTION 12 */}
          <Section id="s12" title="12. Daños, lesiones personales y robo">
            <Sub title="12.1 Daños a los Artículos Almacenados">
              <p>Los Anfitriones son responsables por los daños directos que causen a los Artículos Almacenados del Usuario por su negligencia. Los Anfitriones y Usuarios reconocen que RaumLog no es responsable por ningún daño, deterioro o pérdida de los Artículos Almacenados.</p>
            </Sub>
            <Sub title="12.2 Riesgos ambientales y de seguridad">
              <p>El Anfitrión no será responsable, y el Usuario asume el riesgo, por daños derivados de: humedad, moho, plagas, cambios de temperatura, olores, incendio o explosión (salvo negligencia grave probada del Anfitrión), y residuos de terceros.</p>
            </Sub>
            <Sub title="12.3 Lesiones corporales">
              <p>El Usuario acepta que el acceso al Espacio es bajo su propio riesgo. El Anfitrión no tendrá responsabilidad alguna por lesiones personales, salvo en caso de negligencia grave o conducta dolosa. Ambas partes aceptan que RaumLog no es responsable por lesiones corporales.</p>
            </Sub>
            <Sub title="12.4 Robo de Artículos Almacenados">
              <p>El Anfitrión no será responsable por artículos robados siempre que: (i) exista evidencia de entrada forzada o ilegal al Espacio, y (ii) la conducta negligente del Anfitrión no haya contribuido al robo. RaumLog no es responsable por pérdida o robo bajo ninguna circunstancia.</p>
            </Sub>
            <Sub title="12.5 Reporte obligatorio de siniestros">
              <p>Tanto el Anfitrión como el Usuario deberán notificar a RaumLog cualquier daño, robo, incidente de seguridad, accidente o evento que afecte los Artículos Almacenados o el Espacio dentro de las veinticuatro (24) horas siguientes a su conocimiento o descubrimiento, mediante correo electrónico a <a href="mailto:contacto@raumlog.com" className="text-[#2C5E8D] underline">contacto@raumlog.com</a> con el asunto "Reporte de Siniestro – [número de Reserva]".</p>
              <p>La omisión del reporte dentro del plazo establecido limitará significativamente la capacidad de RaumLog para mediar en la disputa y podrá ser considerada como aceptación tácita del estado de los Artículos Almacenados o del Espacio al momento del siniestro. La parte que omita reportar oportunamente asumirá las consecuencias probatorias adversas derivadas de dicha omisión y no podrá exigir a RaumLog gestión retroactiva del evento.</p>
            </Sub>
          </Section>

          {/* SECTION 13 */}
          <Section id="s13" title="13. Responsabilidad del Usuario por daños al Espacio">
            <p>Los Usuarios son responsables por los daños que ellos o sus Artículos Almacenados causen a la propiedad o al Espacio del Anfitrión.</p>
            <p>Con el fin de prevenir disputas sobre el estado del Espacio, el Anfitrión estará <strong>obligado</strong> a registrar fotográficamente el estado inicial del Espacio inmediatamente antes de recibir los Artículos Almacenados del Usuario, y el Usuario deberá confirmar dicho registro al momento de la entrega. RaumLog podrá habilitar una funcionalidad en la Plataforma para cargar y custodiar estas fotografías como medio de prueba. La ausencia de registro fotográfico por parte del Anfitrión creará una presunción legal de que el Espacio se encontraba en buen estado al inicio de la Reserva, sin perjuicio de la prueba en contrario que pueda aportar el Anfitrión. Igualmente, al finalizar la Reserva, el Anfitrión deberá registrar fotográficamente el estado del Espacio antes de que el Usuario retire los Artículos Almacenados.</p>
            <p>RaumLog no es responsable por los daños causados por el Usuario al Espacio del Anfitrión.</p>
          </Section>

          {/* SECTION 14 */}
          <Section id="s14" title="14. Uso del Espacio y Artículos Prohibidos">
            <Sub title="14.1 Uso del Espacio">
              <p>El Espacio debe ser utilizado únicamente para el almacenamiento de propiedad personal bajo una licencia temporal de uso. Salvo acuerdo escrito contrario, el Usuario no puede modificar la propiedad del Anfitrión ni instalar sistemas de monitoreo, cámaras o alarmas.</p>
            </Sub>
            <Sub title="14.2 Artículos prohibidos">
              <p>Está expresamente prohibido el almacenamiento de los siguientes elementos:</p>
              <Ul>
                <Li>Explosivos, combustibles, materiales peligrosos o inflamables.</Li>
                <Li>Material biológico: cadáveres, restos humanos o animales, tejidos orgánicos, fluidos corporales o muestras de laboratorio de origen biológico.</Li>
                <Li>Pesticidas u otros químicos tóxicos.</Li>
                <Li>Residuos, basura o desechos de cualquier tipo.</Li>
                <Li>Armas de fuego o municiones.</Li>
                <Li>Drogas, estupefacientes o mercancías ilegales.</Li>
                <Li>Bienes robados o de contrabando.</Li>
                <Li>Alimentos perecederos, animales (vivos o muertos), artículos infestados por plagas o con moho.</Li>
                <Li>Baterías de litio de gran capacidad que representen riesgo de ignición espontánea, a discreción del Anfitrión.</Li>
                <Li>Cualquier artículo que emita humos o un olor intenso.</Li>
                <Li>Cualquier objeto cuya posesión o transporte vulnere las leyes colombianas.</Li>
              </Ul>
              <p className="mt-2">Además, se prohíbe <strong>fumar en el Espacio</strong>, vivir o trabajar en él, y utilizarlo como dirección postal o domicilio legal.</p>
            </Sub>
            <Sub title="14.3 Incumplimiento">
              <p>En caso de incumplimiento, el Anfitrión tiene derecho a terminar inmediatamente la Reserva y exigir el retiro de los Artículos Almacenados, debiendo reportar a las autoridades y a RaumLog. El Usuario pierde todas las Tarifas Totales pagadas hasta la fecha de terminación.</p>
            </Sub>
          </Section>

          {/* SECTION 15 */}
          <Section id="s15" title="15. Incumplimiento">
            <Sub title="15.1 Incumplimiento del Anfitrión">
              <p>Si RaumLog determina que un Anfitrión ha violado estos Términos o la ley aplicable, RaumLog podrá: (i) terminar todas las Reservas activas; (ii) recuperar, retener o suspender pagos; y (iii) abstenerse de asistir al Anfitrión en procesos de retiro.</p>
            </Sub>
            <Sub title="15.2 Incumplimiento del Usuario">
              <p>El Usuario incurrirá en "Incumplimiento" si: no paga cualquier suma a su vencimiento, no notifica cambios en sus datos de contacto, proporciona información falsa, no retira los Artículos Almacenados al finalizar la Reserva, o viola leyes de salud, seguridad o penales en la propiedad del Anfitrión.</p>
            </Sub>
          </Section>

          {/* SECTION 16 */}
          <Section id="s16" title="16. Remedios y ejecución">
            <Sub title="16.1 Remedios">
              <p>Si el Usuario incurre en incumplimiento, RaumLog podrá:</p>
              <Ul>
                <Li>Negar el acceso al Espacio o a los Artículos Almacenados hasta que se subsane el incumplimiento.</Li>
                <Li>Terminar la Reserva dando un aviso de tres (3) días calendario para desocupar el Espacio.</Li>
                <Li>Hacer efectivo el derecho de retención y la facultad de disposición si las tarifas no se han pagado por <strong>treinta (30) días calendario</strong>.</Li>
                <Li><strong>Vehículos:</strong> El Usuario autoriza a RaumLog para venderlo según el procedimiento de disposición, o remolcarlo a costo del Usuario.</Li>
                <Li>Cargar al Usuario todos los gastos derivados del incumplimiento, incluyendo honorarios de abogados y costos de logística.</Li>
              </Ul>
            </Sub>
            <Sub title="16.2 Cooperación del Anfitrión">
              <p>En caso de incumplimiento del Usuario, el Anfitrión debe cooperar con RaumLog en los procedimientos de desalojo, venta o remoción. Si el Anfitrión no coopera oportunamente, asumirá la responsabilidad total del desalojo y RaumLog podrá suspender su cuenta.</p>
            </Sub>
          </Section>

          {/* SECTION 17 */}
          <Section id="s17" title="17. Reseñas y calificaciones">
            <Sub title="17.1 Reseñas">
              <p>Los usuarios pueden reseñar a otros usuarios. Su reseña debe ser precisa y no puede contener lenguaje discriminatorio, ofensivo, difamatorio ni otro que viole nuestras políticas. RaumLog no verifica la exactitud de las reseñas.</p>
            </Sub>
            <Sub title="17.2 No respaldo">
              <p>RaumLog no respalda a ningún Miembro, Complemento ni Espacio. Usted es responsable de determinar la idoneidad de las personas con las que transa. RaumLog no será responsable por daños resultantes de sus interacciones con otros Miembros.</p>
            </Sub>
          </Section>

          {/* SECTION 18 */}
          <Section id="s18" title="18. Tarifas adicionales y cobranzas">
            <Sub title="18.1 Cargos por mora">
              <p>Si el Usuario no realiza un pago dentro de los cinco (5) días calendario posteriores a su vencimiento, estará sujeto a un cargo administrativo por mora equivalente a <strong>$20.000 COP</strong> o el 5% del valor de la tarifa mensual, lo que resulte mayor.</p>
            </Sub>
            <Sub title="18.2 Gastos de cobranza">
              <p>Si RaumLog debe enviar notificaciones formales por falta de pago, el Usuario deberá pagar una tarifa de gestión de <strong>$50.000 COP</strong> por cada comunicación enviada.</p>
            </Sub>
            <Sub title="18.3 Intereses moratorios">
              <p>Los saldos impagos generarán intereses de mora a la tasa máxima legal comercial permitida, liquidada desde la fecha de vencimiento hasta el pago total. El Usuario asume los costos de cobranza prejudicial y judicial.</p>
            </Sub>
          </Section>

          {/* SECTION 19 */}
          <Section id="s19" title="19. Responsabilidad del Usuario y conducta inadmisible">
            <p>En relación con el Sitio y los Servicios, usted no puede:</p>
            <Ul>
              <Li>Violar ninguna Ley de la República de Colombia.</Li>
              <Li>Utilizar bots, scripts o scrapers para extraer datos de RaumLog.</Li>
              <Li>Utilizar el Sitio para fines comerciales no permitidos o para enviar spam.</Li>
              <Li>Infringir derechos de propiedad intelectual o privacidad de terceros.</Li>
              <Li>Ofrecer como Anfitrión un Espacio para el cual no tenga autorización legal expresa.</Li>
              <Li>Contactar a otros Miembros para eludir la plataforma y realizar la Reserva por fuera, evitando el pago de las Tarifas de Servicio.</Li>
              <Li>Publicar contenido falso, difamatorio, obsceno, discriminatorio o que promueva actividades ilícitas.</Li>
            </Ul>
          </Section>

          {/* SECTION 20 */}
          <Section id="s20" title="20. Reporte de conducta indebida">
            <p>Si interactúa con alguien que incurre en conducta ofensiva, violenta, sospechosa de robo o ilícita, debe informarlo de inmediato a las autoridades competentes y a RaumLog en <a href="mailto:contacto@raumlog.com" className="text-[#2C5E8D] underline">contacto@raumlog.com</a>.</p>
          </Section>

          {/* SECTION 21 */}
          <Section id="s21" title="21. Terminación y cancelación de cuenta">
            <p>RaumLog puede, a su discreción y sin responsabilidad, con o sin previo aviso: (a) terminar estos Términos o su acceso al Sitio; y (b) cancelar su cuenta. En caso de cancelación, el Usuario seguirá siendo responsable de todos los montos adeudados.</p>
          </Section>

          {/* SECTION 22 */}
          <Section id="s22" title="22. Descargos y limitaciones de responsabilidad">
            <Sub title="22.1 Servicio en el estado en que se encuentra">
              <p>El Sitio, los Servicios y el Contenido se proporcionan estrictamente "en el estado en que se encuentran" y según su disponibilidad técnica. COALGE S.A.S. no otorga garantías expresas o implícitas de comerciabilidad, funcionamiento ininterrumpido o idoneidad para un fin determinado.</p>
            </Sub>
            <Sub title="22.2 Límite máximo de daños">
              <p>Salvo por la obligación de transferir fondos recaudados al Anfitrión, la responsabilidad total y acumulada de COALGE S.A.S. estará limitada al <strong>menor</strong> de los siguientes valores:</p>
              <Ul>
                <Li>El monto total de las Tarifas de Servicio pagadas durante los <strong>doce (12) meses</strong> anteriores al hecho que originó la reclamación.</Li>
                <Li>La suma de <strong>TRESCIENTOS MIL PESOS ($300.000 COP)</strong> si el Miembro no hubiese pagado tarifas previas.</Li>
              </Ul>
            </Sub>
          </Section>

          {/* SECTION 23 */}
          <Section id="s23" title="23. Indemnización">
            <p>Usted acepta defender, indemnizar y mantener indemne a COALGE S.A.S., sus directivos y empleados frente a cualquier reclamación, daño o gasto (incluyendo honorarios de abogados) derivado de su uso de la plataforma, violación de estos Términos, o disputas directas con otro Miembro de RaumLog.</p>
          </Section>

          {/* SECTION 24 */}
          <Section id="s24" title="24. Licencia de Contenido y enlaces">
            <Sub title="24.1 Licencia de Contenido de Miembros">
              <p>Al subir fotografías, reseñas o textos, usted otorga a RaumLog una <strong>licencia mundial, perpetua y gratuita</strong> para usar, modificar y publicitar dicho contenido. Usted garantiza que es dueño de los derechos de lo que publica.</p>
            </Sub>
            <Sub title="24.2 Terceros">
              <p>El uso de mapas integrados está sujeto a los Términos de Servicio de Google. RaumLog no se hace responsable por enlaces o servicios de terceros.</p>
            </Sub>
          </Section>

          {/* SECTION 25 */}
          <Section id="s25" title="25. Resolución de disputas y arbitraje">
            <Sub title="25.1 Arreglo directo">
              <p>Antes de iniciar cualquier acción legal, las partes se comprometen a buscar una solución amistosa dentro de los <strong>treinta (30) días calendario</strong> siguientes al envío de una notificación escrita.</p>
            </Sub>
            <Sub title="25.2 Tribunal de arbitramento">
              <p>Toda controversia entre un Miembro y COALGE S.A.S. será dirimida por un tribunal de arbitramento administrado por el <strong>Centro de Conciliación, Arbitraje y Amigable Composición de la Cámara de Comercio de Medellín para Antioquia</strong>, conformado por:</p>
              <Ul>
                <Li>Un (1) árbitro para asuntos con pretensiones ≤ 400 SMMLV.</Li>
                <Li>Tres (3) árbitros para asuntos superiores o cuando la cuantía sea indeterminada.</Li>
              </Ul>
              <p>El tribunal decidirá en derecho.</p>
            </Sub>
            <Sub title="25.3 Excepciones al arbitraje">
              <p>Quedan excluidas las acciones por infracción de propiedad intelectual y los procesos ejecutivos de cobro de deudas, los cuales podrán adelantarse ante la <strong>jurisdicción ordinaria colombiana</strong>.</p>
            </Sub>
            <Sub title="25.4 Disputas entre Anfitrión y Usuario">
              <p>Cuando la disputa sea directamente entre un Anfitrión y un Usuario, sin involucrar directamente a COALGE S.A.S., las partes en conflicto se someterán igualmente al mecanismo de arreglo directo descrito en la Sección 25.1. De no lograrse acuerdo, la disputa entre Anfitrión y Usuario se resolverá mediante tribunal de arbitramento ante la Cámara de Comercio de Medellín para Antioquia, conforme a los mismos parámetros de la Sección 25.2.</p>
              <p>COALGE S.A.S. podrá actuar como facilitador neutral del proceso, suministrando la información disponible en la Plataforma que resulte relevante para la disputa, sin que ello implique su vinculación como parte en la controversia ni genere responsabilidad alguna para COALGE. RaumLog podrá suspender temporalmente las cuentas de las partes en conflicto hasta la resolución de la disputa, cuando a su juicio exista riesgo para alguna de las partes o para la integridad de la Plataforma.</p>
            </Sub>
          </Section>

          {/* SECTION 26 */}
          <Section id="s26" title="26. Cumplimiento y prevención del riesgo (LA/FT/FPADM)">
            <Sub title="26.1 Declaración de legalidad de fondos">
              <p>Al aceptar estos Términos, el Miembro de RaumLog declara bajo la gravedad del juramento que sus negocios y los recursos que utiliza para el pago de las Tarifas Totales no provienen ni se destinan al ejercicio de ninguna actividad ilícita, particularmente lavado de activos, financiación del terrorismo o de la proliferación de armas de destrucción masiva (LA/FT/FPADM).</p>
            </Sub>
            <Sub title="26.2 Conocimiento y cumplimiento de políticas">
              <p>El Miembro de RaumLog declara que: (i) conoce y se obliga a cumplir la política de prevención de LA/FT/FPADM de COALGE S.A.S.; (ii) entregará toda la información y documentación solicitada para debida diligencia; y (iii) asegurará que sus empleados y contrapartes no estén relacionados con actividades ilícitas.</p>
            </Sub>
            <Sub title="26.3 Consulta en listas restrictivas">
              <p>El Miembro autoriza expresamente a COALGE S.A.S. para consultar antecedentes en listas restrictivas tales como: <strong>OFAC, ONU, listas de terroristas de los EE.UU. y de la Unión Europea</strong>, y demás bases de datos vinculantes para Colombia.</p>
            </Sub>
            <Sub title="26.4 Terminación unilateral por riesgo de cumplimiento">
              <p>COALGE S.A.S. tendrá derecho a terminar de manera inmediata y unilateral la Reserva si el Miembro: (i) resulta involucrado en una investigación relacionada con LA/FT/FPADM; (ii) es incluido en listas restrictivas; o (iii) se niega a suministrar la información de debida diligencia.</p>
            </Sub>
            <Sub title="26.5 Reporte de operaciones sospechosas">
              <p>COALGE S.A.S., en cumplimiento de la normativa vigente, podrá reportar ante la <strong>Unidad de Información y Análisis Financiero (UIAF)</strong> cualquier operación considerada sospechosa, sin que esto genere responsabilidad alguna para la plataforma.</p>
            </Sub>
          </Section>

          {/* SECTION 27 */}
          <Section id="s27" title="27. Miscelánea">
            <Sub title="27.1 Naturaleza del acuerdo">
              <p>Estos Términos constituyen la totalidad del acuerdo entre las partes. Bajo ninguna circunstancia se entenderá que la intermediación de RaumLog genera un contrato de arrendamiento. Lo que se otorga es una <strong>Licencia Temporal de Uso de Espacio</strong>.</p>
            </Sub>
            <Sub title="27.2 Modificaciones">
              <p>RaumLog se reserva el derecho de modificar estos Términos en cualquier momento. El uso continuado de la plataforma tras la actualización implica la aceptación de los nuevos Términos.</p>
            </Sub>
            <Sub title="27.3 Propiedad de los comentarios">
              <p>Cualquier sugerencia o mejora enviada a RaumLog será de propiedad exclusiva de COALGE S.A.S., sin derecho a compensación para el emisor.</p>
            </Sub>
            <Sub title="27.4 Ley aplicable">
              <p>Este contrato se rige íntegramente por las leyes de la <strong>República de Colombia</strong>.</p>
            </Sub>
            <Sub title="27.5 Divisibilidad y nulidad parcial">
              <p>Si cualquier disposición de estos Términos fuera declarada nula o inejecutable, dicha nulidad se limitará exclusivamente a esa disposición específica. Las demás disposiciones conservarán plena vigencia y efecto.</p>
            </Sub>
            <Sub title="27.6 Cesión">
              <p>COALGE S.A.S. podrá ceder, transferir, subcontratar o de cualquier otra manera enajenar sus derechos y obligaciones derivados de estos Términos a cualquier persona natural o jurídica, en cualquier momento y sin previo aviso al Miembro. Lo anterior incluye, sin limitación, las cesiones realizadas en el marco de una fusión, adquisición, escisión, reorganización corporativa, alianza estratégica o cualquier otra operación societaria o comercial.</p>
              <p>El Miembro no podrá ceder, transferir ni subcontratar ninguno de sus derechos u obligaciones derivados de estos Términos, ya sea total o parcialmente, sin el consentimiento previo y escrito de COALGE S.A.S. Cualquier cesión realizada por el Miembro en contravención de esta disposición será nula de pleno derecho.</p>
            </Sub>
          </Section>

          {/* SECTION 28 */}
          <Section id="s28" title="28. Propiedad intelectual de RaumLog">
            <Sub title="28.1 Titularidad">
              <p>Todo el software, código fuente, algoritmos, arquitectura de sistemas, bases de datos, diseños, interfaces gráficas, logotipos, marcas, nombres comerciales, lemas, modelos de negocio y cualquier otro elemento que componga o integre la Plataforma RaumLog son de propiedad exclusiva de COALGE S.A.S. o de sus licenciantes, y se encuentran protegidos por las normas de propiedad intelectual vigentes en la República de Colombia, incluyendo la Ley 23 de 1982, la Ley 44 de 1993, la Decisión Andina 351 de 1993 y los tratados internacionales aplicables ratificados por Colombia.</p>
            </Sub>
            <Sub title="28.2 Restricciones de uso">
              <p>Queda estrictamente prohibido al Miembro, sin el consentimiento previo y escrito de COALGE S.A.S.:</p>
              <Ul>
                <Li>Copiar, reproducir, distribuir, modificar, adaptar o crear obras derivadas de cualquier elemento de la Plataforma o de sus contenidos.</Li>
                <Li>Realizar ingeniería inversa, descompilar, desensamblar o intentar extraer el código fuente de cualquier componente de la Plataforma.</Li>
                <Li>Utilizar la marca RaumLog, el logotipo o cualquier denominación similar en productos, servicios o comunicaciones propias sin autorización escrita previa de COALGE.</Li>
                <Li>Acceder, extraer o sistematizar datos de la Plataforma mediante procesos automatizados no autorizados, incluyendo scrapers, bots, crawlers o similares.</Li>
                <Li>Registrar como marca propia o nombre de dominio cualquier término idéntico o confusamente similar a "RaumLog" o "COALGE" en cualquier país del mundo.</Li>
              </Ul>
            </Sub>
            <Sub title="28.3 Licencia de uso de la Plataforma">
              <p>COALGE S.A.S. otorga al Miembro, durante la vigencia de su cuenta activa, una licencia personal, limitada, no exclusiva, intransferible y revocable para acceder y usar la Plataforma exclusivamente para los fines contemplados en estos Términos. Esta licencia no confiere ningún derecho de propiedad sobre la Plataforma, sus componentes, su código o sus activos de propiedad intelectual. Cualquier uso de la Plataforma por fuera de los límites de esta licencia constituirá una infracción a los derechos de propiedad intelectual de COALGE S.A.S. y podrá dar lugar a acciones civiles y penales.</p>
            </Sub>
            <Sub title="28.4 Reporte de infracciones">
              <p>Si usted tiene conocimiento de un uso no autorizado de los activos de propiedad intelectual de RaumLog, le rogamos notificarlo de inmediato a <a href="mailto:contacto@raumlog.com" className="text-[#2C5E8D] underline">contacto@raumlog.com</a> para que COALGE S.A.S. pueda tomar las medidas legales pertinentes.</p>
            </Sub>
          </Section>

          <div className="bg-[#2C5E8D]/5 border border-[#AECBE9]/40 rounded-xl p-4 mb-8 text-sm text-[#1a3d5c] text-center leading-relaxed">
            Al usar la Plataforma RaumLog usted confirma haber leído, entendido y aceptado la totalidad de estos Términos y Condiciones.<br />
            <strong>COALGE S.A.S. · Medellín, Colombia · <a href="mailto:contacto@raumlog.com" className="underline">contacto@raumlog.com</a></strong>
          </div>

          {/* Bottom nav */}
          <div className="border-t border-[#AECBE9]/50 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} COALGE S.A.S. · NIT 902.029.993-7 · Medellín, Colombia · <a href="mailto:contacto@raumlog.com" className="text-[#2C5E8D] hover:underline">contacto@raumlog.com</a></p>
            <div className="flex gap-4">
              <Link to="/politica-de-privacidad" className="text-[#2C5E8D] hover:underline">Política de Privacidad</Link>
              <Link to="/" className="text-[#2C5E8D] hover:underline">Volver al inicio</Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
