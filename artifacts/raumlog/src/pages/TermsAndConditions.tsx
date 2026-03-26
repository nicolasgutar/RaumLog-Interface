import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10">
      <h2 className="text-xl font-bold text-[#1a3d5c] border-b-2 border-[#AECBE9] pb-2 mb-4">{title}</h2>
      <div className="space-y-4 text-gray-700 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="font-semibold text-[#2C5E8D] mb-2">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="space-y-1.5 ml-1">{children}</ul>;
}

function Li({ children }: { children: React.ReactNode }) {
  return <li className="flex gap-2"><span className="mt-0.5 text-[#2C5E8D] flex-shrink-0">•</span><span>{children}</span></li>;
}

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAFC]">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-[#AECBE9]/30 p-8 md:p-12">

          {/* Header */}
          <div className="mb-10 text-center">
            <img src="/raumlog-logo-main.png" alt="RaumLog" className="h-16 w-auto mx-auto mb-4 object-contain" />
            <h1 className="text-3xl font-bold text-[#1a3d5c]">Términos y Condiciones de Uso de la Plataforma RaumLog</h1>
            <p className="text-sm text-gray-500 mt-2">COMPAÑÍA DE ALMACENAMIENTO Y GESTIÓN S.A.S. (COALGE)</p>
            <p className="text-xs text-gray-400 mt-1">Última actualización: Febrero 2026</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-10 text-sm text-yellow-900">
            <strong>AVISO IMPORTANTE:</strong> AL ACEPTAR ESTOS TÉRMINOS, USTED ACEPTA QUEDAR OBLIGADO POR TODAS LAS DISPOSICIONES QUE FIGURAN A CONTINUACIÓN, INCLUIDAS, SIN LIMITACIÓN, LAS DISPOSICIONES RELATIVAS AL ARBITRAJE. POR FAVOR LÉALAS DETENIDAMENTE.
          </div>

          {/* SECTION 1 */}
          <Section id="s1" title="1. Definiciones y Naturaleza Jurídica">
            <Sub title="1.1 Las Partes">
              <Ul>
                <Li><strong>COALGE S.A.S.</strong> (en adelante "COALGE"): Sociedad comercial que actúa exclusivamente como intermediario tecnológico y agente de cobro, facilitando la conexión entre oferta y demanda.</Li>
                <Li><strong>Anfitrión:</strong> Persona natural o jurídica que publica y ofrece un Espacio para el almacenamiento de Artículos Almacenados, dispone legítimamente de ese Espacio y concede su uso temporal para almacenamiento sin configurarse un contrato de arrendamiento.</Li>
                <Li><strong>Usuario:</strong> Persona natural o jurídica que recibe una licencia temporal en virtud de estos Términos para usar el Espacio del Anfitrión únicamente para el almacenamiento de Artículos Almacenados.</Li>
                <Li><strong>La Plataforma o RaumLog:</strong> Plataforma en línea que conecta Anfitriones con Usuarios, incluyendo todas las aplicaciones web, móviles y demás software, servicios de atención al cliente y el sitio www.raumlog.com.</Li>
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
            <Sub title="2.2 Verificación de Antecedentes">
              <p>El Miembro de RaumLog autoriza a RaumLog y sus aliados a realizar verificaciones de antecedentes y listas restrictivas (LA/FT/PADM). RaumLog se reserva el derecho de negar el acceso a la plataforma basado en estos resultados.</p>
            </Sub>
            <Sub title="2.3 Responsabilidades de RaumLog">
              <p>RaumLog pone a disposición una plataforma con tecnología para que Usuarios y Anfitriones se encuentren en línea y acuerden Reservas de almacenamiento. RaumLog no es propietario ni operador de Anuncios/Espacios, ni es corredor de bienes raíces, agente inmobiliario, asegurador o agente de depósito en garantía. Las responsabilidades de RaumLog se limitan a facilitar la disponibilidad del Sitio, los Servicios y su plataforma. RaumLog no actúa como agente de ningún Miembro excepto para el propósito limitado de aceptar pagos de Usuarios en nombre del Anfitrión.</p>
            </Sub>
          </Section>

          {/* SECTION 3 */}
          <Section id="s3" title="3. Términos Relacionados al Servicio">
            <Sub title="3.1 Aceptación de los Términos">
              <p>Al utilizar el Sitio o los Servicios, usted acepta cumplir y quedar legalmente obligado por los presentes Términos, independientemente de que se convierta o no en Miembro de RaumLog. Si usted no está de acuerdo con estos Términos, no tiene derecho a obtener información de los Servicios ni a seguir utilizándolos. El uso no autorizado puede resultar en que se le prohíba el acceso y puede someterlo a responsabilidad civil y/o sanciones penales.</p>
            </Sub>
            <Sub title="3.2 Acuerdos entre Anfitriones y Usuarios">
              <p>Usted entiende y acepta que RaumLog no es parte de ningún acuerdo celebrado entre Anfitriones y Usuarios. Los acuerdos escritos firmados directamente entre las partes prevalecerán sobre estos Términos únicamente en cuanto a sus derechos y obligaciones mutuos, pero ningún acuerdo privado podrá modificar las obligaciones hacia RaumLog ni sus derechos bajo estos Términos. Todos los pagos relacionados con la Reserva deben procesarse <strong>exclusivamente a través de la Plataforma RaumLog</strong>.</p>
            </Sub>
            <Sub title="3.3 Obligaciones de cumplimiento normativo">
              <p>Usted acepta que es el único responsable de familiarizarse y cumplir con cualquier ley u otra regulación relacionada con el arriendo y/o uso del espacio, incluyendo cualquier requisito para que los anfitriones se registren u obtengan una licencia o permiso antes de publicar un espacio. RaumLog no asesora sobre asuntos legales.</p>
            </Sub>
            <Sub title="3.4 Contenido de los Anuncios e idoneidad del Espacio">
              <p>RaumLog no puede controlar el Contenido de ningún Anuncio, ni la condición, legalidad o idoneidad de ningún Espacio o Complemento. Los Usuarios son los únicos responsables de determinar la idoneidad y legalidad de cualquier Espacio. En consecuencia, todas las Reservas se realizarán bajo el riesgo exclusivo del Anfitrión y del Usuario.</p>
            </Sub>
            <Sub title="3.5 Autoridad">
              <p>Al acceder o utilizar el Sitio, usted indica que ha leído, comprende y acepta quedar obligado por estos Términos. Si usted acepta estos Términos en nombre de una empresa u otra persona jurídica, declara y garantiza que tiene la autoridad para vincular a dicha entidad.</p>
            </Sub>
            <Sub title="3.6 Capacidad jurídica">
              <p>El Sitio está destinado exclusivamente a personas con plena capacidad jurídica. Cualquier acceso por parte de personas sin plena capacidad jurídica está expresamente prohibido.</p>
            </Sub>
            <Sub title="3.7 Aviso de gravamen">
              <p className="uppercase font-semibold text-gray-600 text-xs">TENGA EN CUENTA QUE AL ACCEDER AL SITIO, UTILIZAR LOS SERVICIOS Y COMPLETAR CUALQUIER RESERVA PARA ALMACENAR EN UN ESPACIO, USTED ESTÁ CONSINTIENDO LA CREACIÓN DE UN GRAVAMEN Y LA FACULTAD DE RAUMLOG DE VENDER LOS ARTÍCULOS ALMACENADOS PARA SATISFACER DICHO GRAVAMEN.</p>
            </Sub>
          </Section>

          {/* SECTION 4 */}
          <Section id="s4" title="4. Política de No Discriminación">
            <Sub title="4.1 Cumplimiento con la Ley Aplicable">
              <p>Para seguir siendo Miembro de RaumLog, se requiere que usted cumpla todas las normas jurídicas aplicables. Usted no puede:</p>
              <Ul>
                <Li>Rechazar a un Usuario con base en su raza, color, etnia, origen nacional, religión, orientación sexual, identidad de género o estado civil.</Li>
                <Li>Imponer términos o condiciones diferentes basados en cualquiera de las características protegidas anteriores.</Li>
                <Li>Publicar Anuncios o hacer declaraciones que desanimen o indiquen preferencia a favor o en contra de cualquier Miembro por razones de discriminación.</Li>
                <Li>Rechazar a un Usuario por alguna discapacidad real o percibida.</Li>
                <Li>Imponer términos o condiciones diferentes por razón de discapacidad.</Li>
                <Li>Indagar sobre la existencia o gravedad de una discapacidad del Anfitrión o Usuario.</Li>
                <Li>Prohibir o limitar el uso de dispositivos de movilidad.</Li>
                <Li>Cobrar más en tarifas a Usuarios con discapacidad.</Li>
                <Li>Negarse a comunicarse a través de medios accesibles disponibles.</Li>
              </Ul>
            </Sub>
            <Sub title="4.2 Rechazo de Anfitriones o Usuarios">
              <p>Los Anfitriones o Usuarios que demuestren un patrón de rechazo a Miembros de una clase protegida debilitan la fortaleza de nuestra comunidad. RaumLog puede eliminar a dichos Miembros de la plataforma y/o prohibirles el uso del Sitio y los Servicios.</p>
            </Sub>
          </Section>

          {/* SECTION 5 */}
          <Section id="s5" title="5. Cuentas">
            <Sub title="5.1 Información de la cuenta">
              <p>Su Cuenta RaumLog será creada con base en la información personal que usted proporcione. Usted no puede tener más de una (1) Cuenta RaumLog activa. Usted acepta proporcionar información precisa, actual y completa y actualizarla oportunamente. RaumLog se reserva el derecho de suspender o terminar su Cuenta sin causa o aviso. Algunas razones de terminación incluyen: (1) crear más de una cuenta, (2) información inexacta o incompleta, y (3) incumplimiento de estos Términos.</p>
            </Sub>
            <Sub title="5.2 Contraseña">
              <p>Usted es responsable de salvaguardar su contraseña. Usted acepta no divulgarla a ningún tercero y acepta la responsabilidad exclusiva por cualquier actividad realizada bajo su Cuenta. Notifique de inmediato a RaumLog cualquier uso no autorizado escribiendo a <a href="mailto:contacto@raumlog.com" className="text-[#2C5E8D] underline">contacto@raumlog.com</a>.</p>
            </Sub>
            <Sub title="5.3 Comunicaciones y avisos">
              <p>USTED ACEPTA QUE TODOS LOS AVISOS REQUERIDOS POR ESTOS TÉRMINOS O POR LEY PODRÁN SER ENVIADOS POR RAUMLOG A LA DIRECCIÓN DE CORREO ELECTRÓNICO QUE USTED HAYA PROPORCIONADO. Usted otorga consentimiento expreso para ser contactado por medios escritos, electrónicos o verbales, incluyendo correo, mensajes de texto y correos electrónicos. Puede revocar su consentimiento para comunicaciones de mercadeo escribiendo a <a href="mailto:contacto@raumlog.com" className="text-[#2C5E8D] underline">contacto@raumlog.com</a>.</p>
            </Sub>
          </Section>

          {/* SECTION 6 */}
          <Section id="s6" title="6. Anuncios y Espacios">
            <Sub title="6.1 Creación de Anuncios">
              <p>Como Miembro de RaumLog, usted puede crear Anuncios respondiendo preguntas sobre el Espacio (ubicación, capacidad, tamaño, características, disponibilidad, precios, normas y términos financieros). Para ser incluido en Anuncios, el Espacio debe contar con una dirección física válida. Los Anuncios serán de acceso público a través del Sitio y los Servicios.</p>
            </Sub>
            <Sub title="6.2 Responsabilidad del Anfitrión por Anuncios y Complementos">
              <p>Usted es responsable de todos y cada uno de los Anuncios que publique, incluyendo garantizar la exactitud de la descripción del Espacio. Declara y garantiza que cualquier Anuncio que publique: (i) no vulnerará ningún acuerdo con terceros; (ii) cumplirá con todas las leyes, requisitos tributarios y normas aplicables; y (iii) no entrará en conflicto con los derechos de terceros. Los Anfitriones son los únicos responsables de todos los daños, pérdidas y gastos ocasionados por listar un Espacio que no poseen o para el cual no tienen autorización legal.</p>
            </Sub>
            <Sub title="6.3 Derecho de RaumLog a eliminar Anuncios">
              <p>RaumLog se reserva el derecho, en cualquier momento y sin previo aviso, de eliminar o inhabilitar el acceso a cualquier Anuncio que se considere objetable, contravenga estos Términos o la Ley Aplicable, o resulte perjudicial para su comunidad o el Sitio.</p>
            </Sub>
            <Sub title="6.4 Requisitos impuestos por el Anfitrión">
              <p>Al crear un Anuncio, el Anfitrión puede incluir ciertos requisitos y artículos prohibidos que los Miembros deben cumplir para solicitar una Reserva. El incumplimiento puede resultar en que el Usuario incurra en Incumplimiento y sea responsable de daños al Espacio del Anfitrión.</p>
            </Sub>
            <Sub title="6.5 Descripción del Espacio">
              <p>Cada Anfitrión debe proporcionar una descripción veraz y precisa del Espacio. Si un Anfitrión tergiversa un Espacio, RaumLog puede, a su discreción: (i) determinar si el Usuario tiene derecho a un reembolso; (ii) negarse a pagar al Anfitrión los montos reembolsados; (iii) retener o recuperar pagos al Anfitrión; o (iv) perseguir acciones legales. Si el Usuario mueve Artículos Almacenados al Espacio, confirma que la descripción del Anuncio es precisa.</p>
            </Sub>
            <Sub title="6.6 Responsabilidad del Anfitrión por sus actos">
              <p>El Anfitrión es responsable de sus propios actos y omisiones. Los Anfitriones aceptan utilizar las características de seguridad existentes en el Espacio para proteger razonablemente los Artículos Almacenados de daños o robos.</p>
            </Sub>
          </Section>

          {/* SECTION 7 */}
          <Section id="s7" title="7. Impuestos y Facturación">
            <Sub title="7.1 Composición del Servicio">
              <p>El Usuario entiende y acepta que el valor final a pagar se compone de: (i) la tarifa establecida por el Anfitrión, (ii) la comisión por intermediación de RaumLog, (iii) el Impuesto sobre las Ventas (IVA) calculado sobre el valor total del servicio, y (iv) los costos transaccionales de la pasarela de pagos.</p>
            </Sub>
            <Sub title="7.2 Retención de IVA">
              <p>En cumplimiento de la normativa tributaria vigente, RaumLog actuará como agente retenedor de IVA. El Usuario, como sujeto activo del impuesto, pagará el IVA sobre el 100% de la tarifa del servicio. RaumLog recaudará dicho impuesto y será el responsable de su reporte y remisión ante la Dirección de Impuestos y Aduanas Nacionales (DIAN).</p>
            </Sub>
            <Sub title="7.3 Facturación y Soportes">
              <Ul>
                <Li>RaumLog emitirá al Usuario un soporte de pago por el valor total de la transacción (servicio + impuesto + costos transaccionales).</Li>
                <Li>RaumLog emitirá al Anfitrión una factura electrónica por el valor de la comisión de intermediación tecnológica y otra por el valor de la cesión del espacio.</Li>
                <Li>Toda factura será emitida a nombre de la persona natural o jurídica cuyos datos hayan sido registrados en la Cuenta al momento de realizar la Reserva. Es responsabilidad del Miembro asegurar la veracidad de dichos datos.</Li>
              </Ul>
            </Sub>
          </Section>

          {/* SECTION 8 */}
          <Section id="s8" title="8. Pagos">
            <Sub title="8.1 Exclusividad de la Plataforma y Prohibición de Pagos Directos">
              <p>Todos los pagos derivados del uso de los Servicios deben realizarse obligatoriamente a través de RaumLog utilizando la pasarela <strong>Wompi</strong>.</p>
              <Ul>
                <Li><strong>Prohibición de evasión:</strong> Está prohibido solicitar, ofrecer o aceptar pagos totales o parciales por fuera de la plataforma para evadir las comisiones de intermediación.</Li>
                <Li><strong>Sanción por incumplimiento:</strong> Si RaumLog detecta que un Anfitrión y un Usuario han perfeccionado un acuerdo de almacenamiento por fuera de la plataforma, RaumLog podrá: (i) cancelar inmediatamente ambas cuentas y (ii) cobrar una <strong>Cláusula Penal equivalente a seis (6) meses</strong> de la Tarifa Total Mensual estimada. RaumLog queda facultado para deducir este monto de cualquier saldo a favor del Anfitrión o iniciar acciones legales de cobro.</Li>
                <Li><strong>Exención de responsabilidad:</strong> RaumLog no asumirá ningún tipo de soporte técnico, mediación o responsabilidad por disputas derivadas de acuerdos pactados por fuera de la plataforma.</Li>
              </Ul>
            </Sub>
            <Sub title="8.2 Pasarela de Pagos (Wompi)">
              <p>El procesamiento de los pagos estará a cargo de Wompi S.A.S. Al realizar una Reserva, el Usuario acepta los términos y condiciones de dicha pasarela. RaumLog no se hace responsable por comisiones adicionales, intereses o cargos que el banco emisor pueda aplicar. El costo transaccional de la pasarela no es reembolsable una vez procesado el pago.</p>
            </Sub>
            <Sub title="8.3 Verificación y Autorización de Cargo">
              <p>Al registrar un método de pago, el Usuario autoriza a RaumLog y/o a Wompi a realizar una verificación de la validez del instrumento financiero. Esto puede incluir una pre-autorización por un monto mínimo (ej. $1.000 COP) que será reversada automáticamente.</p>
            </Sub>
            <Sub title="8.4 Recepción de dinero del Anfitrión">
              <Ul>
                <Li><strong>Corte Semanal:</strong> Los pagos recibidos y servicios iniciados durante la semana serán liquidados y enviados a la cuenta bancaria del Anfitrión el día <strong>viernes</strong> de cada semana (o el día hábil siguiente).</Li>
                <Li><strong>Descuentos:</strong> Antes de enviar el dinero, RaumLog descontará automáticamente la comisión por uso de la tecnología, los impuestos y los costos de la pasarela de pagos.</Li>
                <Li><strong>Garantía de Satisfacción:</strong> El pago solo se enviará si el servicio ha comenzado con normalidad. Si el Usuario reporta algún problema grave antes del inicio del almacenamiento, RaumLog podrá retener el pago de manera preventiva hasta que se solucione la situación.</Li>
                <Li><strong>Datos Bancarios:</strong> Es responsabilidad del Anfitrión registrar correctamente su cuenta bancaria. RaumLog no se hace responsable por retrasos derivados de errores en los datos suministrados.</Li>
                <Li><strong>Abandono de Fondos:</strong> Si el Anfitrión no facilita una cuenta válida para el pago por un periodo de seis (6) meses, perderá el derecho a recibir dichos fondos.</Li>
              </Ul>
            </Sub>
          </Section>

          {/* SECTION 9 */}
          <Section id="s9" title="9. Seguro">
            <p>RaumLog <strong>no proporciona seguro</strong> a Anfitriones ni Usuarios. Los Anfitriones y Usuarios son responsables de proporcionar su propio seguro para cubrir daños que puedan ocurrir a la propiedad del Anfitrión y/o del Usuario, incluyendo daños a los Artículos Almacenados. RaumLog no está obligado a proporcionar seguro para proteger los Artículos Almacenados. RaumLog recomienda que los Usuarios adquieran seguro para sus artículos almacenados, el cual está disponible a través de la mayoría de las aseguradoras.</p>
          </Section>

          {/* SECTION 10 */}
          <Section id="s10" title="10. Verificaciones e Inspecciones">
            <Sub title="10.1 Verificaciones de Seguridad">
              <p>Los Anfitriones y Usuarios tienen el derecho de realizar verificaciones de identidad, antecedentes penales y antecedentes crediticios de la otra parte antes de iniciar el servicio. RaumLog se reserva el derecho, pero no la obligación, de realizar estas mismas verificaciones a través de terceros, pudiendo negar el servicio o cancelar cuentas basándose en los resultados. El Usuario y el Anfitrión liberan a RaumLog de cualquier responsabilidad por la exactitud de dicha información.</p>
            </Sub>
            <Sub title="10.2 Obligación del Derecho de Inspección de los Artículos Almacenados">
              <p>Para garantizar la seguridad de la red, el Anfitrión tiene la <strong>obligación</strong> de ejercer el Derecho de Inspección al momento de recibir los artículos y al momento de su retiro final. El Anfitrión deberá verificar, en presencia del Usuario, que los Artículos Almacenados no forman parte de la lista de Bienes Prohibidos. Se recomienda dejar constancia fotográfica o escrita del estado de los bienes al ingresar.</p>
              <p>Si durante la inspección inicial el Anfitrión detecta bienes prohibidos o sospechosos, tiene el deber y la facultad de negar el ingreso de la mercancía de inmediato y de reportar a las autoridades y a RaumLog. El Anfitrión que omita realizar la inspección inicial asume bajo su propio riesgo la responsabilidad civil o penal derivada de cualquier daño o sanción legal.</p>
            </Sub>
            <Sub title="10.3 Verificación de la Propiedad">
              <p>El Anfitrión declara, bajo la gravedad de juramento, que es el propietario, arrendatario autorizado o poseedor legítimo del espacio que ofrece en RaumLog, y que cuenta con las facultades legales para permitir el almacenamiento de bienes de terceros en dicho lugar.</p>
            </Sub>
          </Section>

          {/* SECTION 11 */}
          <Section id="s11" title="11. Reservas y Términos Financieros">
            <Sub title="11.1 Aceptación y rechazo de Reservas">
              <p>Si usted es Anfitrión y se solicita una Reserva para su Espacio, deberá aprobar o rechazar la Reserva dentro de las <strong>24 horas</strong> siguientes a la solicitud; de lo contrario, se rechazará automáticamente. Una vez confirmada, se compartirá la dirección del Espacio. Un Miembro de RaumLog no puede ser simultáneamente Usuario y Anfitrión para la misma Reserva.</p>
            </Sub>
            <Sub title="11.2 Tarifas">
              <p>Las tarifas que se muestran en cada Anuncio incluyen la Tarifa del Espacio, la Tarifa de Servicio, la Tarifa de Procesamiento y los Complementos aplicables. Las <strong>Tarifas de Servicio y de Procesamiento no son reembolsables</strong> una vez perfeccionada la Reserva.</p>
            </Sub>
            <Sub title="11.3 Pago del Usuario">
              <p>Cada Usuario acepta pagar las Tarifas Totales una vez el Anfitrión confirme la Reserva. Si un Usuario disputa un cargo ante su banco pero el cobro era debido según estos Términos, el Usuario reconoce que aún adeuda dicho monto a COALGE, quien podrá cargarlo en el próximo Pago Recurrente.</p>
            </Sub>
            <Sub title="11.4 Pagos recurrentes; recepción de fondos por el Anfitrión">
              <Ul>
                <Li><strong>Recurrencia:</strong> Para reservas de larga duración, el Usuario autoriza cobros automáticos en cada Fecha de Renovación.</Li>
                <Li><strong>Pago al Anfitrión:</strong> RaumLog entregará al Anfitrión su ganancia neta (deducidas comisiones e impuestos) de forma semanal. El pago solo se liberará si el servicio ha iniciado sin reportes de incumplimiento grave.</Li>
              </Ul>
            </Sub>
            <Sub title="11.5 Divulgaciones y Propiedad Protegida">
              <p>Al solicitar la Reserva, el Usuario debe declarar la naturaleza de los Artículos Almacenados. Queda estrictamente prohibido guardar armas, drogas, sustancias peligrosas o documentos con datos sensibles de terceros. El Usuario es el único responsable por cualquier daño causado por artículos no declarados o prohibidos.</p>
            </Sub>
            <Sub title="11.6 Acceso al Espacio">
              <p>El Anfitrión indicará en el Anuncio los horarios en que el Usuario puede acceder a los Artículos Almacenados. El Usuario debe contactar al Anfitrión con al menos <strong>24 horas de anticipación</strong> para solicitar acceso, a menos que se indique lo contrario. Se recomienda que el Usuario mantenga informado al Anfitrión sobre cualquier cambio que pueda afectar los términos del almacenamiento.</p>
            </Sub>
            <Sub title="11.7 Transporte de Artículos Almacenados">
              <p>El Anfitrión no está obligado a transportar ni manipular los Artículos Almacenados, y RaumLog recomienda que el Anfitrión no los manipule. Si un Anfitrión transporta o manipula los Artículos Almacenados, lo hace bajo su propio riesgo.</p>
            </Sub>
            <Sub title="11.8 Desocupación del Espacio">
              <p>El Usuario debe retirar todos los Artículos Almacenados y dejar el Espacio limpio ("limpieza con escoba") al finalizar el Periodo de Reserva. El incumplimiento generará cargos adicionales por limpieza o días extra de ocupación.</p>
            </Sub>
            <Sub title="11.9 Bienes Abandonados">
              <p>Se consideran Artículos Almacenados en situación de abandono legal aquellos que permanezcan en el Espacio después de <strong>quince (15) días calendario</strong> contados a partir de: (i) la terminación del Periodo de Reserva, (ii) el incumplimiento en el pago de las Tarifas Totales, o (iii) la cancelación de la cuenta del Usuario.</p>
              <p>Al aceptar estos Términos, el Usuario reconoce que el abandono configura una renuncia voluntaria y expresa a su derecho de propiedad, y autoriza la siguiente jerarquía de disposición:</p>
              <Ul>
                <Li><strong>Derecho de Retención Contractual:</strong> COALGE y el Anfitrión podrán impedir el retiro de los bienes hasta que se satisfaga cualquier deuda pendiente.</Li>
                <Li><strong>Opción de Adjudicación al Anfitrión:</strong> COALGE podrá ofrecer al Anfitrión la propiedad de los Artículos Almacenados como compensación. Si el Anfitrión acepta, se entenderá realizada una dación en pago.</Li>
                <Li><strong>Adjudicación a favor de COALGE:</strong> Si el Anfitrión no manifiesta interés, la propiedad se transferirá de pleno derecho a COALGE S.A.S.</Li>
                <Li><strong>Facultad de Destrucción o Venta:</strong> El nuevo titular (Anfitrión o COALGE) queda plenamente facultado para vender, donar, desechar o destruir los bienes sin necesidad de aviso previo ni autorización judicial.</Li>
                <Li><strong>Exoneración Total:</strong> El Usuario renuncia a cualquier acción de reivindicación o indemnización por la pérdida de la propiedad.</Li>
                <Li><strong>Entrega a las Autoridades:</strong> Los Bienes Prohibidos considerados ilegales serán entregados a la autoridad competente.</Li>
              </Ul>
            </Sub>
            <Sub title="11.10 Cancelaciones y Reembolsos">
              <Ul>
                <Li><strong>Por el Usuario:</strong> Reembolso del 100% si cancela con más de 7 días de antelación. Si cancela con menos de 7 días, se retienen las comisiones. Una vez iniciada la fecha de la Reserva, no hay reembolsos por días no utilizados.</Li>
                <Li><strong>Por el Anfitrión:</strong> Si cancela una reserva activa, debe dar un preaviso de 30 días. Si no cumple el preaviso, se le cobrará una penalidad equivalente al valor de la Tarifa de la Reserva.</Li>
              </Ul>
            </Sub>
            <Sub title="11.11 Valor Máximo Permitido">
              <p>El Usuario se obliga a no almacenar bienes cuyo valor total supere los <strong>$50.000.000 COP</strong>.</p>
              <Ul>
                <Li><strong>Excedentes:</strong> Si el Usuario decide almacenar bienes que superen este valor, estará obligado a contratar una póliza de seguro adicional que cubra el riesgo excedente.</Li>
                <Li><strong>Límite de Responsabilidad:</strong> En ausencia de dicho seguro, la responsabilidad de COALGE y el Anfitrión estará limitada estrictamente al tope de $50.000.000 COP, asumiendo el Usuario todo riesgo por encima de este monto.</Li>
              </Ul>
            </Sub>
            <Sub title="11.12 Descuento del primer mes">
              <p>Cuando se ofrezca, el descuento del primer mes solo estará disponible para Reservas de más de un mes de duración. Si el Usuario recibe un descuento y la Reserva se cancela antes de que se cobre el segundo mes, se le cobrará al Usuario el monto del descuento del primer mes.</p>
            </Sub>
          </Section>

          {/* SECTION 12 */}
          <Section id="s12" title="12. Daños a los Artículos Almacenados, Lesiones Personales y Robo">
            <Sub title="12.1 Daños a los Artículos Almacenados">
              <p>Los Anfitriones son responsables por los daños directos que causen a los Artículos Almacenados del Usuario por su negligencia. Para evitar disputas, se obliga a los Anfitriones a registrar el estado inicial de los bienes mediante el Derecho de Inspección. RaumLog puede, a su discreción exclusiva, retener o recuperar pagos de los Anfitriones ante reportes fundados de conducta indebida. Los Anfitriones y Usuarios reconocen que RaumLog no es responsable por ningún daño, deterioro o pérdida de los Artículos Almacenados.</p>
            </Sub>
            <Sub title="12.2 Riesgos ambientales y de seguridad">
              <p>El Anfitrión no será responsable, y el Usuario asume el riesgo, por daños derivados de:</p>
              <Ul>
                <Li>Factores ambientales como humedad, moho, plagas o cambios de temperatura.</Li>
                <Li>Olores: emanaciones provenientes de otros artículos o del entorno del Espacio.</Li>
                <Li>Incendio o explosión: eventos fortuitos que afecten el inmueble, salvo que se pruebe negligencia grave del Anfitrión en el mantenimiento de las instalaciones eléctricas o de gas.</Li>
                <Li>Basura y residuos: daños causados por la cercanía a zonas de disposición de desechos o mala manipulación de estos por parte de terceros.</Li>
              </Ul>
            </Sub>
            <Sub title="12.3 Lesiones corporales">
              <p>El Usuario acepta que el acceso al Espacio es bajo su propio riesgo. El Anfitrión no tendrá responsabilidad alguna frente al Usuario ni frente a sus invitados por lesiones personales o corporales, salvo en caso de negligencia grave o conducta dolosa del Anfitrión. El Usuario renuncia a cualquier reclamo contra el Anfitrión por este concepto, y ambas partes aceptan que RaumLog no es responsable por lesiones corporales de Anfitriones, Usuarios o terceros.</p>
            </Sub>
            <Sub title="12.4 Robo de Artículos Almacenados">
              <p>El Anfitrión no será responsable por Artículos Almacenados perdidos o robados siempre que: (i) se presente un informe policial y la autoridad determine que existe evidencia de entrada forzada o ilegal al Espacio, y (ii) la conducta negligente del Anfitrión no haya contribuido al robo. RaumLog no es responsable por la pérdida o robo de los bienes bajo ninguna circunstancia.</p>
            </Sub>
            <Sub title="12.5 Responsabilidad por Abandono y Disposición">
              <p>En caso de configurarse el abandono, el Usuario libera de toda responsabilidad al Anfitrión y a COALGE S.A.S. por los daños que puedan sufrir los bienes durante su movilización, venta, donación o destrucción. El Usuario asume el riesgo de pérdida total de los bienes una vez transcurrido el plazo de gracia para su retiro.</p>
            </Sub>
          </Section>

          {/* SECTION 13 */}
          <Section id="s13" title="13. Responsabilidad del Usuario por Daños a la Propiedad y al Espacio del Anfitrión">
            <p>Los Usuarios son responsables por los daños que ellos o sus Artículos Almacenados causen a la propiedad o al Espacio del Anfitrión. Para evitar disputas, se recomienda a los Usuarios registrar el estado inicial de la propiedad y del Espacio del Anfitrión. Los Anfitriones y Usuarios reconocen y aceptan que RaumLog no es responsable por daños causados a la propiedad o al Espacio del Anfitrión.</p>
          </Section>

          {/* SECTION 14 */}
          <Section id="s14" title="14. Uso del Espacio y Artículos Prohibidos">
            <Sub title="14.1 Uso del Espacio">
              <p>El Usuario acepta no usar el Espacio para fines ilícitos. El Espacio debe ser utilizado únicamente para el almacenamiento de propiedad personal bajo una licencia temporal de uso. Salvo acuerdo escrito contrario, el Usuario no puede modificar la propiedad del Anfitrión ni instalar sistemas de monitoreo, cámaras o alarmas. El uso del Espacio para cualquier fin diferente al almacenamiento lícito está expresamente prohibido.</p>
            </Sub>
            <Sub title="14.2 Artículos prohibidos">
              <p>Está expresamente prohibido el almacenamiento de los siguientes elementos:</p>
              <Ul>
                <Li>Explosivos, combustibles, materiales peligrosos o inflamables.</Li>
                <Li>Material biológico: cadáveres, restos humanos o animales, tejidos orgánicos, fluidos corporales, órganos, o muestras de laboratorio de origen biológico.</Li>
                <Li>Pesticidas u otros químicos tóxicos.</Li>
                <Li>Residuos, basura o desechos de cualquier tipo.</Li>
                <Li>Armas de fuego o municiones.</Li>
                <Li>Drogas, estupefacientes o mercancías ilegales.</Li>
                <Li>Bienes robados o de contrabando.</Li>
                <Li>Alimentos perecederos, alimentos en descomposición, animales (vivos o muertos), artículos infestados por plagas o con moho.</Li>
                <Li>Baterías de litio de gran capacidad que puedan representar un riesgo de ignición espontánea o incendio, a discreción del Anfitrión.</Li>
                <Li>Cualquier artículo que emita humos o un olor intenso.</Li>
                <Li>Cualquier otro artículo identificado por el Anfitrión en el Anuncio como prohibido.</Li>
                <Li>Cualquier objeto cuya posesión o transporte vulnere las leyes colombianas.</Li>
              </Ul>
              <p className="mt-2">Además de lo anterior, se prohíbe <strong>fumar en el Espacio</strong>. Está prohibido que el Usuario viva o trabaje en el Espacio, incluyendo realizar mantenimientos o reparaciones. Los Usuarios no podrán recibir correspondencia ni utilizar el Espacio como dirección postal o domicilio legal.</p>
            </Sub>
            <Sub title="14.3 Incumplimiento del Usuario de esta sección">
              <p>En caso de incumplimiento o sospecha razonable de incumplimiento, el Anfitrión tendrá derecho a terminar inmediatamente la Reserva y exigir el retiro de los Artículos Almacenados. Si el Usuario no los retira, se aplicará el protocolo de abandono y disposición de la cláusula 11.9.</p>
              <Ul>
                <Li><strong>Reporte a autoridades y a RaumLog:</strong> El Anfitrión debe contactar a las autoridades y a RaumLog para reportar actividades ilegales. Si el Anfitrión sospecha del almacenamiento de elementos ilícitos relacionados con LA/FT/PADM, el Usuario otorga permiso a las autoridades para registrar los Artículos Almacenados.</Li>
                <Li><strong>Indemnidad:</strong> El Usuario acepta indemnizar y mantener indemne al Anfitrión y a COALGE S.A.S. frente a cualquier responsabilidad derivada de la remoción de propiedad prohibida. El Usuario perderá todas las Tarifas Totales pagadas hasta la fecha de la terminación.</Li>
              </Ul>
            </Sub>
          </Section>

          {/* SECTION 15 */}
          <Section id="s15" title="15. Incumplimiento">
            <Sub title="15.1 Incumplimiento del Anfitrión">
              <p>Si RaumLog determina que un Anfitrión ha violado estos Términos o la ley aplicable, RaumLog podrá: (i) terminar todas las Reservas activas de dicho Anfitrión; (ii) recuperar, retener o suspender pagos al Anfitrión hasta que se aclare la situación; y (iii) abstenerse de asistir al Anfitrión en procesos de retiro de Usuarios o de Artículos Almacenados. Si la violación del Anfitrión genera gastos para COALGE S.A.S. o para el Usuario, el Anfitrión será responsable de pagar la totalidad de dichos costos.</p>
            </Sub>
            <Sub title="15.2 Incumplimiento del Usuario">
              <p>El Usuario incurrirá en "Incumplimiento" si:</p>
              <Ul>
                <Li>No paga cualquier suma a su vencimiento (Tarifas Totales, multas o gastos).</Li>
                <Li>No notifica a RaumLog un cambio en su dirección, correo electrónico o número de teléfono.</Li>
                <Li>Proporciona información falsa o incorrecta al Anfitrión o a RaumLog.</Li>
                <Li>No retira la totalidad de los Artículos Almacenados al finalizar el Periodo de Reserva o en la fecha exigida.</Li>
                <Li>Incumple, o se sospecha razonablemente que ha incumplido, cualquier disposición de estos Términos o las reglas específicas del Anuncio.</Li>
                <Li>Viola, o se sospecha razonablemente que ha violado, leyes de salud, seguridad o penales en la propiedad del Anfitrión.</Li>
              </Ul>
            </Sub>
            <Sub title="15.3 No renuncia">
              <p>El hecho de que RaumLog o el Anfitrión no hagan valer cualquiera de estos Términos en un momento dado no constituirá una renuncia a dichos derechos en el futuro.</p>
            </Sub>
          </Section>

          {/* SECTION 16 */}
          <Section id="s16" title="16. Remedios y Ejecución">
            <Sub title="16.1 Remedios">
              <p>Si el Usuario incurre en incumplimiento, RaumLog podrá ejercer uno o más de los siguientes remedios:</p>
              <Ul>
                <Li>Negar al Usuario el acceso al Espacio o a los Artículos Almacenados hasta que subsane el incumplimiento.</Li>
                <Li>Terminar la Reserva dando un aviso de tres (3) días calendario para desocupar el Espacio.</Li>
                <Li>Hacer efectivo el derecho de retención y la facultad de disposición, incluyendo la venta, donación o destrucción de los Artículos Almacenados si las tarifas no se han pagado por un periodo de <strong>treinta (30) días calendario</strong>.</Li>
                <Li><strong>Vehículos:</strong> Si los Artículos Almacenados incluyen vehículos, el Usuario autoriza a RaumLog para: (i) venderlo según el procedimiento de disposición, o (ii) remolcarlo a costo del Usuario fuera de la propiedad del Anfitrión.</Li>
                <Li><strong>Emergencias:</strong> En situaciones de riesgo para la salud, seguridad o bloqueo de accesos, RaumLog puede retirar y disponer de inmediato de los bienes.</Li>
                <Li>Cargar al Usuario todos los gastos derivados del incumplimiento, incluyendo honorarios de abogados y costos de logística.</Li>
              </Ul>
            </Sub>
            <Sub title="16.2 Cesión de remedios">
              <p>RaumLog puede ceder sus derechos y remedios, incluyendo la facultad de retención y disposición, al Anfitrión o a cualquier tercero que considere pertinente para la resolución del conflicto.</p>
            </Sub>
            <Sub title="16.3 Remoción de dispositivos de seguridad">
              <p>El Usuario autoriza expresamente a RaumLog o al Anfitrión para remover, cortar o retirar cualquier candado, cerradura o dispositivo de seguridad colocado por el Usuario para acceder a los bienes en mora o abandono.</p>
            </Sub>
            <Sub title="16.4 Cooperación del Anfitrión">
              <p>En caso de incumplimiento del Usuario, el Anfitrión debe cooperar con RaumLog en los procedimientos de desalojo, venta o remoción. Si el Anfitrión no coopera oportunamente, asumirá la responsabilidad total y el costo del desalojo bajo su propia cuenta y riesgo, y RaumLog podrá terminar la Reserva y suspender la cuenta del Anfitrión.</p>
            </Sub>
          </Section>

          {/* SECTION 17 */}
          <Section id="s17" title="17. Reseñas y Calificaciones">
            <Sub title="17.1 Reseñas">
              <p>Los usuarios pueden tener la oportunidad de reseñar a otros usuarios. Su reseña debe ser precisa y no puede contener lenguaje discriminatorio, ofensivo, difamatorio ni otro que viole nuestras políticas. RaumLog no verifica la exactitud de las reseñas y estas pueden ser incorrectas o engañosas.</p>
            </Sub>
            <Sub title="17.2 No respaldo">
              <p>RaumLog no respalda a ningún Miembro, Complemento ni Espacio. Aunque exigimos información precisa, no verificamos de forma independiente la identidad ni los antecedentes de los Miembros. Usted es responsable de determinar la idoneidad de las personas con las que transa. RaumLog no será responsable por daños resultantes de sus interacciones con otros Miembros.</p>
            </Sub>
          </Section>

          {/* SECTION 18 */}
          <Section id="s18" title="18. Tarifas Adicionales y Cobranzas">
            <Sub title="18.1 Cargos por mora">
              <p>Si el Usuario no realiza un pago dentro de los cinco (5) días calendario posteriores a su vencimiento, o si el pago es rechazado o revocado, estará sujeto a un cargo administrativo por mora equivalente a <strong>$20.000 COP</strong> o el 5% del valor de la tarifa mensual, lo que resulte mayor.</p>
            </Sub>
            <Sub title="18.2 Gastos de cobranza">
              <p>Si RaumLog debe enviar notificaciones formales (correo certificado, burofax, etc.) por falta de pago o en relación con la disposición de bienes abandonados, el Usuario deberá pagar una tarifa de gestión de <strong>$50.000 COP</strong> por cada comunicación enviada.</p>
            </Sub>
            <Sub title="18.3 Intereses moratorios">
              <p>Los saldos impagos generarán intereses de mora a la tasa máxima legal comercial permitida, liquidada desde la fecha de vencimiento hasta el pago total. El Usuario asume los costos de cobranza prejudicial y judicial, incluyendo honorarios de agencias externas y abogados.</p>
            </Sub>
          </Section>

          {/* SECTION 19 */}
          <Section id="s19" title="19. Responsabilidad del Usuario y Conducta Inadmisible">
            <p>Usted entiende y acepta que es el único responsable del cumplimiento de todas las leyes, normas y obligaciones tributarias aplicables. En relación con el Sitio y los Servicios, usted no puede:</p>
            <Ul>
              <Li>Violar ninguna Ley de la República.</Li>
              <Li>Utilizar bots, scripts o scrapers para extraer datos de RaumLog.</Li>
              <Li>Utilizar el Sitio para fines comerciales no permitidos o para enviar spam.</Li>
              <Li>Infringir derechos de propiedad intelectual o privacidad de terceros.</Li>
              <Li>Ofrecer como Anfitrión un Espacio que no sea de su propiedad o para el cual no tenga autorización legal expresa de subarrendar o licenciar.</Li>
              <Li>Contactar a otros Miembros para eludir la plataforma y realizar la Reserva por fuera, evitando el pago de las Tarifas de Servicio.</Li>
              <Li>Publicar contenido falso, difamatorio, obsceno, discriminatorio o que promueva actividades ilícitas.</Li>
            </Ul>
          </Section>

          {/* SECTION 20 */}
          <Section id="s20" title="20. Reporte de Conducta Indebida">
            <p>Si interactúa con alguien que incurre en conducta ofensiva, violenta, sospechosa de robo o ilícita, debe informarlo de inmediato a las autoridades competentes y a RaumLog en <a href="mailto:contacto@raumlog.com" className="text-[#2C5E8D] underline">contacto@raumlog.com</a>. Este reporte no obliga a RaumLog a asumir funciones de autoridad ni acarrea responsabilidad civil o penal para la plataforma.</p>
          </Section>

          {/* SECTION 21 */}
          <Section id="s21" title="21. Terminación y Cancelación de Cuenta">
            <p>RaumLog puede, a su discreción y sin responsabilidad, con o sin previo aviso: (a) terminar estos Términos o su acceso al Sitio; y (b) cancelar su cuenta. En caso de cancelación, el Usuario seguirá siendo responsable de todos los montos adeudados. Usted puede cancelar su cuenta escribiendo a soporte, pero RaumLog conservará la licencia sobre las reseñas y comentarios públicos que haya dejado.</p>
          </Section>

          {/* SECTION 22 */}
          <Section id="s22" title="22. Descargos y Limitaciones de Responsabilidad">
            <Sub title="22.1 Provisión en el estado en que se encuentra el Sitio">
              <p>El Sitio, los Servicios y el contenido se proporcionan estrictamente "en el estado en que se encuentran" y según su disponibilidad técnica. COALGE S.A.S. no otorga garantías expresas o implícitas de comerciabilidad, funcionamiento ininterrumpido o idoneidad para un fin determinado. RaumLog no garantiza que los Anuncios sean exactos.</p>
            </Sub>
            <Sub title="22.2 Límite máximo de daños">
              <p>Las partes aceptan que COALGE S.A.S. actúa únicamente como intermediario tecnológico y que la Tarifa de Servicio no guarda proporción con el valor de los bienes almacenados. Por lo tanto, se pacta el siguiente límite de responsabilidad:</p>
              <Ul>
                <Li><strong>Obligaciones excluidas del límite:</strong> Este tope no aplica a la obligación de COALGE S.A.S. de transferir al Anfitrión los fondos efectivamente recaudados y libres de disputa, tras una Reserva completada.</Li>
                <Li><strong>Monto máximo de indemnización:</strong> Salvo por la obligación anterior, la responsabilidad total y acumulada de COALGE S.A.S. estará limitada al <strong>menor</strong> de los siguientes valores: (i) el monto total de las Tarifas de Servicio pagadas durante los doce (12) meses anteriores al hecho que originó la reclamación, o (ii) la suma de <strong>TRESCIENTOS MIL PESOS ($300.000 COP)</strong> si el Miembro no hubiese pagado tarifas previas.</Li>
                <Li><strong>Aceptación de riesgo:</strong> El Miembro de RaumLog reconoce que, de no aceptar esta limitación, la Tarifa de Servicio sería significativamente más alta, y por ende, asume voluntariamente cualquier riesgo excedente.</Li>
              </Ul>
            </Sub>
          </Section>

          {/* SECTION 23 */}
          <Section id="s23" title="23. Indemnización">
            <p>Usted acepta defender, indemnizar y mantener indemne a COALGE S.A.S., sus directivos y empleados frente a cualquier reclamación, daño o gasto (incluyendo honorarios de abogados) derivado de:</p>
            <Ul>
              <Li>Su uso de la plataforma o violación de estos Términos.</Li>
              <Li>Lesiones a personas o daños a propiedades resultantes de su uso del Espacio.</Li>
              <Li>Disputas directas entre usted y otro Miembro de RaumLog.</Li>
            </Ul>
          </Section>

          {/* SECTION 24 */}
          <Section id="s24" title="24. Licencia de Contenido y Enlaces">
            <Sub title="24.1 Licencia">
              <p>Al subir fotografías, reseñas o textos (Contenido de Miembro de RaumLog), usted otorga a RaumLog una <strong>licencia mundial, perpetua y gratuita</strong> para usar, modificar y publicitar dicho contenido. Usted garantiza que es dueño de los derechos de lo que publica.</p>
            </Sub>
            <Sub title="24.2 Terceros y Google Maps">
              <p>El uso de mapas integrados está sujeto a los Términos de Servicio de Google. RaumLog no se hace responsable por enlaces o servicios de terceros.</p>
            </Sub>
          </Section>

          {/* SECTION 25 */}
          <Section id="s25" title="25. Resolución de Disputas y Arbitraje">
            <Sub title="25.1 Arreglo directo">
              <p>Antes de iniciar cualquier acción legal, las partes se comprometen a buscar una solución amistosa. La parte afectada enviará una notificación escrita a la otra. Si tras <strong>treinta (30) días calendario</strong> no se llega a un acuerdo, se procederá a la siguiente fase.</p>
            </Sub>
            <Sub title="25.2 Tribunal de Arbitramento">
              <p>Toda controversia o diferencia relativa a este contrato será dirimida por un tribunal de arbitramento administrado por el <strong>Centro de Conciliación, Arbitraje y Amigable Composición de la Cámara de Comercio de Medellín para Antioquia</strong>, conformado por:</p>
              <Ul>
                <Li>Un (1) árbitro para asuntos con pretensiones inferiores o iguales a cuatrocientos (400) SMMLV.</Li>
                <Li>Tres (3) árbitros para asuntos superiores a dicha cuantía o cuando esta sea indeterminada.</Li>
              </Ul>
              <p>Los árbitros serán designados de común acuerdo por las partes o por sorteo del Centro. El tribunal funcionará en las instalaciones del mencionado Centro y decidirá en derecho.</p>
            </Sub>
            <Sub title="25.3 Excepciones al arbitraje">
              <p>Quedan excluidas del arbitraje las acciones por infracción de propiedad intelectual y los procesos ejecutivos para el cobro de deudas (incluyendo la ejecución del derecho de retención y la disposición de bienes abandonados), los cuales podrán adelantarse ante la <strong>jurisdicción ordinaria colombiana</strong>.</p>
            </Sub>
          </Section>

          {/* SECTION 26 */}
          <Section id="s26" title="26. Cumplimiento y Prevención del Riesgo (LA/FT/FPADM)">
            <Sub title="26.1 Declaración de legalidad de fondos">
              <p>Al aceptar estos Términos, el Miembro de RaumLog declara bajo la gravedad del juramento que sus negocios y los recursos que utiliza para el pago de las Tarifas Totales, o los Espacios que pone a disposición, no provienen ni se destinan al ejercicio de ninguna actividad ilícita, particularmente lavado de activos, financiación del terrorismo o de la financiación de la proliferación de armas de destrucción masiva (LA/FT/FPADM).</p>
            </Sub>
            <Sub title="26.2 Conocimiento y cumplimiento de políticas">
              <p>El Miembro de RaumLog declara que:</p>
              <Ul>
                <Li>Conoce y se obliga a cumplir la política de prevención de LA/FT/FPADM de COALGE S.A.S. disponible en La Plataforma.</Li>
                <Li>Entregará toda la información y documentación solicitada por RaumLog para cumplir con las disposiciones de debida diligencia.</Li>
                <Li>Llevará a cabo todas las actividades tendientes a asegurar que sus propios empleados, socios o contrapartes no se encuentren relacionados con actividades ilícitas.</Li>
              </Ul>
            </Sub>
            <Sub title="26.3 Consulta en listas restrictivas">
              <p>El Miembro de RaumLog autoriza expresamente a COALGE S.A.S. para que, directamente o a través de terceros, consulte sus antecedentes y los de sus socios o representantes en listas restrictivas y de control, tales como: <strong>OFAC, ONU, listas de terroristas de los EE.UU. y de la Unión Europea</strong>, y demás bases de datos vinculantes para Colombia.</p>
            </Sub>
            <Sub title="26.4 Terminación unilateral por riesgo de cumplimiento">
              <p>COALGE S.A.S. tendrá derecho a terminar de manera inmediata y unilateral la Reserva y el acceso a los Servicios, sin lugar a pagar compensación alguna, en caso de que el Miembro de RaumLog o sus relacionados: (i) resulten inmiscuidos en una investigación relacionada con LA/FT/FPADM; (ii) sean incluidos en cualquiera de las listas restrictivas mencionadas; o (iii) se nieguen a suministrar la información de debida diligencia requerida.</p>
            </Sub>
            <Sub title="26.5 Reporte de operaciones sospechosas">
              <p>El Miembro de RaumLog reconoce que COALGE S.A.S., en cumplimiento de la normativa vigente, podrá reportar ante la <strong>Unidad de Información y Análisis Financiero (UIAF)</strong> cualquier operación que sea considerada sospechosa, sin que esto genere responsabilidad alguna para la plataforma.</p>
            </Sub>
          </Section>

          {/* SECTION 27 */}
          <Section id="s27" title="27. Miscelánea">
            <Sub title="27.1 Naturaleza del acuerdo">
              <p>Estos Términos constituyen la totalidad del acuerdo entre las partes. Bajo ninguna circunstancia se entenderá que la intermediación de RaumLog genera un contrato de arrendamiento sobre bienes inmuebles sujeto a la Ley 820 de 2003 o al Código de Comercio para locales comerciales. Lo que se otorga es una <strong>Licencia Temporal de Uso de Espacio</strong>.</p>
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
              <p>Si cualquier disposición de estos Términos fuera declarada nula, ilegal, inválida o inejecutable por un tribunal o autoridad competente, dicha nulidad se limitará exclusivamente a esa disposición específica. Las demás disposiciones de este contrato conservarán plena vigencia y efecto.</p>
            </Sub>
          </Section>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
            <p>© {new Date().getFullYear()} COALGE S.A.S. · NIT 902.029.993 · Medellín, Colombia</p>
            <p className="mt-2">Para cualquier duda: <a href="mailto:contacto@raumlog.com" className="text-[#2C5E8D] underline">contacto@raumlog.com</a></p>
            <p className="mt-2">
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
