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
  return (
    <li className="flex gap-2">
      <span className="mt-0.5 text-[#2C5E8D] flex-shrink-0">•</span>
      <span>{children}</span>
    </li>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAFC]">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-[#AECBE9]/30 p-8 md:p-12">

          {/* Header */}
          <div className="mb-10 text-center">
            <img src="/raumlog-logo-main.png" alt="RaumLog" className="h-16 w-auto mx-auto mb-4 object-contain" />
            <h1 className="text-3xl font-bold text-[#1a3d5c]">Política de Tratamiento de Datos Personales</h1>
            <p className="text-sm text-gray-500 mt-2">COMPAÑÍA DE ALMACENAMIENTO Y GESTIÓN S.A.S. (COALGE)</p>
            <p className="text-xs text-gray-400 mt-1">Última actualización: Febrero 2026 · NIT 902.029.993 · Medellín, Colombia</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-10 text-sm text-blue-900">
            <p>El presente documento constituye la Política de Tratamiento de Datos Personales de <strong>COMPAÑÍA DE ALMACENAMIENTO Y GESTIÓN S.A.S.</strong> (en adelante, "COALGE", "COALGE S.A.S." o "La Compañía"), sociedad comercial identificada con <strong>NIT 902.029.993</strong>, con domicilio principal en la ciudad de Medellín, Colombia.</p>
            <p className="mt-2">COALGE, como propietaria y operadora de la plataforma tecnológica RaumLog, actúa como <strong>responsable del tratamiento</strong> de los datos personales recolectados a través de su sitio web, aplicaciones móviles, canales de atención y demás medios de interacción con sus Anfitriones, Usuarios, aliados y terceros. Marco legal aplicable: <strong>Ley 1581 de 2012</strong> (Colombia).</p>
          </div>

          {/* SECTION 1 */}
          <Section id="s1" title="1. Objeto">
            <p>COALGE S.A.S. reconoce la importancia de la seguridad, privacidad y confidencialidad de los Datos Personales de nuestros clientes y posibles clientes, empleados, candidatos, accionistas, proveedores, contratistas (en adelante denominados "Titulares").</p>
            <p>El objetivo de esta Política de Protección de Datos Personales es comunicarle e informarle cómo tratamos sus Datos Personales, qué tipo de datos recogemos, los principios que rigen nuestras actividades de tratamiento de datos, sus derechos y las finalidades de nuestras actividades de tratamiento de datos.</p>
            <p>Esta Política de Protección de Datos Personales aplica a todas nuestras actividades.</p>
          </Section>

          {/* SECTION 2 */}
          <Section id="s2" title="2. Alcance">
            <p>Esta Política de Protección de Datos Personales aplica a todos los datos Personales que recopilamos y tratamos para prestar nuestros servicios y cumplir con las obligaciones que tenemos con usted y con las autoridades.</p>
          </Section>

          {/* SECTION 3 */}
          <Section id="s3" title="3. Definiciones">
            <Ul>
              <Li><strong>Autorización:</strong> Toda manifestación de voluntad libre, específica, informada e inequívoca por la que el Titular acepta y autoriza el tratamiento de sus Datos Personales, ya sea mediante una declaración escrita o una clara acción afirmativa.</Li>
              <Li><strong>Base de Datos:</strong> Conjunto organizado de Datos Personales, automatizados o no, ya sea físico, magnético, digital u óptico, cualquiera que sea la forma de su creación, almacenamiento, organización y acceso.</Li>
              <Li><strong>Datos Biométricos:</strong> Datos Personales obtenidos a partir de un tratamiento técnico específico, relativos a las características físicas, fisiológicas o conductuales de una persona física que permitan o confirmen la identificación única de dicha persona, como imágenes faciales o datos dactiloscópicos.</Li>
              <Li><strong>Datos Personales:</strong> Toda información sobre un individuo identificado o identificable. Se considerará identificable toda persona cuya identidad pueda determinarse directa o indirectamente, en particular mediante un identificador como un nombre, un número de identificación, datos de localización o un identificador en línea.</Li>
              <Li><strong>Datos Personales Sensibles:</strong> Son aquellos que revelen el origen racial o étnico, las opiniones políticas, las creencias religiosas o filosóficas, la pertenencia a una organización sindical, información concerniente a la salud, o a la vida u orientación sexuales de una persona natural, información genética o biométrica con el propósito de identificar unívocamente a una persona natural, e información relacionada con condenas penales.</Li>
              <Li><strong>Encargado del Tratamiento:</strong> La persona física o jurídica de carácter privado o público, autoridad pública, servicio u otro organismo que trate datos Personales por cuenta del responsable del Tratamiento.</Li>
              <Li><strong>Incidente de Seguridad:</strong> Toda violación de la seguridad que ocasione la destrucción, pérdida o alteración accidental o ilícita de Datos Personales transmitidos, conservados o tratados de otra forma, o la comunicación o acceso no autorizados a dichos datos.</Li>
              <Li><strong>Responsable del Tratamiento:</strong> La persona física o jurídica de carácter privado o público, autoridad, servicio u otro organismo que, solo o junto con otros, determine los fines y medios del tratamiento de los Datos Personales.</Li>
              <Li><strong>Titular:</strong> Cualquier persona natural cuyos datos Personales son objeto de las actividades de tratamiento de Datos.</Li>
              <Li><strong>Tratamiento de Datos:</strong> Cualquier operación o conjunto de operaciones realizadas sobre datos Personales o conjuntos de datos Personales, ya sea por procedimientos automatizados o no, como la recolección, registro, organización, estructuración, conservación, adaptación o modificación, extracción, consulta, utilización, comunicación por transmisión, difusión o cualquier otra forma de habilitación de acceso, cotejo o interconexión, limitación, supresión o destrucción.</Li>
            </Ul>
          </Section>

          {/* SECTION 4 */}
          <Section id="s4" title="4. Descripción del Tratamiento">
            <p>Tratamos sus Datos Personales basándonos en los siguientes principios y de conformidad con todos aquellos principios definidos por la legislación aplicable:</p>
            <Ul>
              <Li>Tratamos sus datos de forma legal, equitativa y transparente.</Li>
              <Li>Sus datos personales se tratan con fines específicos, explícitos y legítimos, y no se tratan de forma incompatible con dichos fines.</Li>
              <Li>Nuestras actividades de tratamiento de datos son adecuadas, pertinentes y se limitan a lo necesario en relación con los fines para los que se tratan.</Li>
              <Li>Los datos que tratamos sobre usted son exactos y, cuando sea necesario, se mantienen actualizados. La veracidad de los datos personales suministrados es una responsabilidad exclusiva del Titular.</Li>
              <Li>Definimos procesos para proteger los datos personales recopilados de la pérdida, el mal uso, el acceso no autorizado, la divulgación, alteración y la destrucción. A pesar de nuestros esfuerzos, ninguna medida de seguridad puede garantizar la seguridad absoluta.</Li>
            </Ul>

            <Sub title="4.1 Derechos de los Titulares">
              <p>Los derechos de los titulares consisten en:</p>
              <Ul>
                <Li>Acceder en forma gratuita a los datos suministrados.</Li>
                <Li>Conocer, actualizar y rectificar su información en caso de datos parciales, inexactos, incompletos, fraccionados, que induzcan a error, o aquellos cuyo tratamiento esté prohibido o no haya sido autorizado.</Li>
                <Li>Solicitar prueba de la autorización otorgada.</Li>
                <Li>Presentar quejas ante la <strong>Superintendencia de Industria y Comercio (SIC)</strong> por infracciones a las disposiciones de la normatividad vigente.</Li>
                <Li>Revocar la autorización y solicitar la supresión de los datos, siempre y cuando no exista ninguna obligación legal o contractual que impida su supresión.</Li>
                <Li>Abstenerse de otorgar autorización para el tratamiento de datos sensibles o de niñas, niños y adolescentes.</Li>
                <Li>Ser informado por el responsable del tratamiento, previa solicitud, respecto del uso que le ha dado a sus datos personales.</Li>
              </Ul>
            </Sub>

            <Sub title="4.2 Tipos de datos que tratamos">
              <p>Podemos recopilar Datos Personales sobre usted directa o automáticamente a través del uso de nuestro sitio web y/o de fuentes de terceros (que podemos combinar con otra información que hayamos recopilado). Estas fuentes de terceros pueden incluir proveedores de servicios, socios de mercadeo, redes de publicidad, proveedores de análisis de datos, bases de datos públicas, plataformas de medios sociales, entidades gubernamentales, procesadores de pagos y proveedores de servicios de salud.</p>
              <p className="font-medium text-gray-800 mt-2">Datos relacionados con su información personal:</p>
              <Ul>
                <Li>Nombre</Li>
                <Li>Edad</Li>
                <Li>Ocupación</Li>
                <Li>Fecha y lugar de nacimiento</Li>
                <Li>Tipo y Número de identificación</Li>
                <Li>Sexo</Li>
                <Li>Estado civil, ciudadanía, país y ciudad de residencia</Li>
                <Li>Información de contacto</Li>
              </Ul>
              <p className="font-medium text-gray-800 mt-3">Datos relacionados con referencias laborales, desempeño y beneficios:</p>
              <Ul>
                <Li>En función de su solicitud de empleo, podemos tratar datos sensibles, como sus antecedentes penales o su estado de salud.</Li>
                <Li>Tratamos Datos Personales relacionados con su profesión, ocupación, referencias y verificación de antecedentes.</Li>
              </Ul>
            </Sub>

            <Sub title="4.3 Datos Sensibles">
              <p>RaumLog tratará Datos Sensibles cuando:</p>
              <Ul>
                <Li>Cuente con autorización explícita para su tratamiento, salvo en los casos en que la Ley 1581 de 2012 establezca que no se requiere autorización.</Li>
                <Li>El tratamiento sea necesario para salvaguardar el interés vital del titular, y éste se encuentre física o jurídicamente imposibilitado para otorgar la autorización.</Li>
                <Li>El tratamiento se refiera a datos necesarios para el reconocimiento, ejercicio o defensa de un derecho en un proceso judicial.</Li>
                <Li>El tratamiento tenga una finalidad histórica, estadística o científica, adoptando las medidas necesarias para la supresión de la identidad del Titular.</Li>
              </Ul>
              <p>En todo caso, el tratamiento de datos sensibles se realizará conforme a la normativa vigente, garantizando la adopción de medidas de seguridad adecuadas para proteger la privacidad e integridad de los datos.</p>
            </Sub>

            <Sub title="4.4 ¿Cómo utilizamos sus datos?">
              <p>Se entenderá que los datos personales que serán tratados dependerán de si usted es cliente, posible cliente, empleado, candidato, proveedor, contratista o aliado de COALGE S.A.S. y de RaumLog.</p>
            </Sub>

            <Sub title="4.5 Finalidades del tratamiento de datos">
              <p className="font-medium text-gray-800">Para todos los Titulares:</p>
              <Ul>
                <Li>Para todos los asuntos fiscales, comerciales, contractuales, de negociación, corporativos y cualquier otro tipo de obligación de COALGE.</Li>
                <Li>Emitir las certificaciones contractuales solicitadas por contratistas, proveedores, etc.</Li>
                <Li>Realizar las acciones oportunas para desarrollar el objeto social de la empresa y gestionar trámites: peticiones, quejas, reclamaciones.</Li>
                <Li>Contactar con el Titular por cualquier medio.</Li>
                <Li>Proporcionar información a terceros con los que COALGE tenga una relación contractual y que sea necesaria para la ejecución de dicha relación.</Li>
                <Li>Para el cobro de facturas, títulos valores y, en general, saldos pendientes.</Li>
                <Li>Para consultar o gestionar cualquier asunto relacionado con el sistema de seguridad social y temas tributarios y contables.</Li>
                <Li>Para consultar antecedentes judiciales, administrativos y financieros y hacer la debida diligencia.</Li>
                <Li>Consultar la actividad comercial, empresarial, contable y financiera del Titular, siempre que dicha información no esté protegida por cláusulas de confidencialidad.</Li>
                <Li>Transferir o transmitir la información cuando sea necesario para cumplir con alguna de las finalidades previstas en la presente política.</Li>
                <Li>Establecer canales de comunicación con todos los titulares y enviar información de carácter institucional y comercial.</Li>
                <Li>Ejecutar actividades de publicidad relacionadas con el objeto social de COALGE.</Li>
                <Li>Cumplir con todas las obligaciones legales o contractuales relacionadas con las actividades propias de COALGE.</Li>
                <Li>Almacenar información en archivos cuando exista el deber legal de mantener la información.</Li>
                <Li>Adoptar medidas de control y seguridad sobre el tratamiento.</Li>
                <Li>Verificar, consultar y reportar información relacionada con el comportamiento crediticio de los titulares y entidades públicas o privadas.</Li>
                <Li>Verificar y consultar información en listas y bases de datos relacionadas con antecedentes judiciales, inhabilidades, incompatibilidades, LA/FT/PADM/C/ST.</Li>
              </Ul>

              <p className="font-medium text-gray-800 mt-4">Para empleados, candidatos, contratistas y ex empleados:</p>
              <Ul>
                <Li>Ejecutar procesos de selección, promoción, bienestar laboral, nómina, evaluaciones de desempeño, competencias, inducción, entrenamiento, formación, seguridad y salud en el trabajo.</Li>
                <Li>Ejecutar tareas de investigación, análisis y reporte de incidentes y situaciones al interior de las instalaciones de COALGE.</Li>
                <Li>Conocer el entorno familiar de cada empleado, garantizando y respetando los derechos laborales que pudieran derivarse de la composición de dicho entorno.</Li>
                <Li>Acceder, consultar y obtener historias clínicas y sus anexos para el recobro de incapacidades y seguimiento a recomendaciones y restricciones.</Li>
                <Li>Ejecutar programas de formación y capacitación.</Li>
                <Li>Controlar el acceso a las instalaciones de COALGE.</Li>
                <Li>Recolectar, almacenar, consultar, circular, transmitir, verificar, usar, reproducir, divulgar, comunicar, adaptar, extraer y diferir la imagen de los titulares de la información, con el fin de realizar publicaciones institucionales, de mercadeo y publicidad relacionada con el objeto social de COALGE S.A.S., para ser divulgados en la página web y redes sociales de COALGE y RaumLog.</Li>
              </Ul>

              <p className="font-medium text-gray-800 mt-4">Para clientes y posibles clientes:</p>
              <Ul>
                <Li>Realizar seguimiento al cumplimiento de las obligaciones por parte de los clientes.</Li>
                <Li>Analizar el establecimiento y/o mantenimiento de relaciones contractuales.</Li>
                <Li>Evaluar los riesgos derivados de las relaciones contractuales vigentes y futuras.</Li>
              </Ul>

              <p className="font-medium text-gray-800 mt-4">Para proveedores y posibles proveedores:</p>
              <Ul>
                <Li>Realizar seguimiento al cumplimiento de las obligaciones por parte de los proveedores.</Li>
                <Li>Evaluar la calidad de los servicios y productos recibidos.</Li>
                <Li>Analizar el establecimiento y/o mantenimiento de relaciones contractuales.</Li>
                <Li>Evaluar los riesgos derivados de las relaciones contractuales vigentes.</Li>
              </Ul>

              <p className="font-medium text-gray-800 mt-4">Datos de menores de edad:</p>
              <p>COALGE S.A.S., por regla general, se abstendrá de manipular datos cuyo titular sea un menor de edad, según lo dicta el artículo 7° de la Ley 1581 de 2012. Excepcionalmente, cuando se requiera ejecutar actividades de tratamiento sobre datos personales de menores de edad, COALGE someterá el tratamiento a las siguientes reglas:</p>
              <Ul>
                <Li>Respeto del interés superior de los niños, niñas y adolescentes, menores titulares de los datos.</Li>
                <Li>Respeto de los derechos fundamentales de los niños, niñas y adolescentes.</Li>
                <Li>Obtener autorización emitida por el representante legal del niño, niña o adolescente, cuando se requiera.</Li>
              </Ul>
            </Sub>
          </Section>

          {/* SECTION 5 */}
          <Section id="s5" title="5. Canales de Contacto">
            <p>En caso de cualquier solicitud o queja en relación con esta Política, puede comunicarse con:</p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mt-2">
              <p className="font-semibold text-[#1a3d5c]">RaumLog / COALGE S.A.S.</p>
              <p className="mt-1">Correo electrónico: <a href="mailto:contacto@raumlog.com" className="text-[#2C5E8D] underline">contacto@raumlog.com</a></p>
              <p className="mt-1">Horario de atención: Lunes a viernes, 8:00 a.m. – 6:00 p.m.</p>
              <p className="mt-1 text-xs text-gray-500">Las solicitudes recibidas por fuera de este horario se entenderán radicadas al día hábil siguiente.</p>
            </div>

            <p className="mt-4">Como Titular de los datos, usted tiene derecho a solicitar a COALGE y a RaumLog información relacionada con la forma en que tratamos sus Datos Personales, la finalidad del tratamiento, las transferencias o transmisiones y sus destinatarios, el tipo de Datos Personales que recopilamos, entre otros. También puede presentar reclamaciones o quejas sobre el tratamiento de sus Datos Personales.</p>

            <p className="mt-3">Todas las solicitudes deben contener la siguiente información:</p>
            <Ul>
              <Li>Nombre y apellidos completos.</Li>
              <Li>Datos de contacto (dirección física y de correo electrónico o teléfonos de contacto).</Li>
              <Li>Medios para recibir una respuesta a su solicitud.</Li>
              <Li>Motivo(s)/hecho(s) que origina(n) la reclamación con una breve descripción del derecho que desea ejercer (conocer, actualizar, rectificar, solicitar prueba de la autorización, revocar, suprimir, acceder a la información).</Li>
              <Li>Firma.</Li>
              <Li>Número de identificación.</Li>
            </Ul>

            <Sub title="5.1 Consultar">
              <Ul>
                <Li>Los titulares, su apoderado o sus causahabientes podrán consultar la información personal del titular contenida en las bases de datos de RaumLog y COALGE.</Li>
                <Li>Las solicitudes de consulta se recibirán de lunes a viernes de 8:00 a.m. a 6:00 p.m. Las solicitudes recibidas por fuera de ese horario se entenderán radicadas al día hábil siguiente.</Li>
                <Li>La consulta será respondida en un plazo máximo de <strong>diez (10) días hábiles</strong> a partir de la fecha de recepción de la misma.</Li>
                <Li>Cuando no sea posible atender la consulta dentro de dicho plazo, se informará al interesado señalando los motivos de la demora e indicando la fecha en que se atenderá la consulta, que en ningún caso podrá exceder de <strong>cinco (5) días hábiles</strong> siguientes al vencimiento del término inicial.</Li>
              </Ul>
            </Sub>

            <Sub title="5.2 Reclamaciones">
              <Ul>
                <Li>El Titular, su apoderado o sus causahabientes que consideren que la información contenida en una base de datos debe ser corregida, actualizada o eliminada, o cuando adviertan el presunto incumplimiento de alguno de los deberes contenidos en esta política o en la ley, podrán presentar una queja ante COALGE.</Li>
                <Li>Los reclamos se recibirán de lunes a viernes de 8:00 a.m. a 6:00 p.m.</Li>
                <Li>La consulta será atendida en un plazo máximo de <strong>quince (15) días hábiles</strong> desde la fecha de recepción.</Li>
                <Li>Cuando no sea posible atender el reclamo dentro de dicho término, se informará al interesado señalando los motivos de la demora e indicando la fecha de atención, la cual en ningún caso podrá exceder los <strong>ocho (8) días hábiles</strong> siguientes al vencimiento del primer término.</Li>
                <Li>Si el reclamo es incompleto, se requerirá al interesado para que subsane las fallas dentro de los <strong>cinco (5) días hábiles</strong> siguientes a la recepción. Transcurridos dos (2) meses desde la fecha del requerimiento, sin que el solicitante presente la información requerida, se entenderá que el reclamo ha sido desistido.</Li>
                <Li>No procederá la solicitud de supresión de la información ni la revocación de la autorización cuando el titular tenga un deber legal o contractual de permanecer en la base de datos.</Li>
              </Ul>
            </Sub>

            <Sub title="5.3 Revocatoria">
              <p>Usted puede revocar la autorización que, en su caso, nos haya otorgado para el tratamiento de sus Datos Personales. No obstante, es importante que tenga en cuenta que no en todos los casos podremos atender su solicitud o cesar el uso de forma inmediata, ya que es posible que, debido a alguna obligación legal, debamos seguir tratando sus Datos Personales en cumplimiento de la legislación aplicable.</p>
              <p>Asimismo, debe considerar que, para determinados fines, la revocatoria de su autorización implicará la finalización de su relación con nosotros. El trámite de revocatoria de autorización se surtirá conforme lo previsto en la ley aplicable.</p>
            </Sub>
          </Section>

          {/* SECTION 6 */}
          <Section id="s6" title="6. Información">
            <p>La información solicitada podrá ser suministrada por cualquier medio, incluyendo los electrónicos, según lo requiera el titular. La información será de fácil lectura, sin barreras técnicas que impidan su acceso y deberá corresponder a aquella que repose en la Base de Datos.</p>
            <p className="mt-2">La información sobre los datos Personales podrá ser suministrada a las siguientes personas:</p>
            <Ul>
              <Li>Al titular, al apoderado debidamente facultado, a sus causahabientes debidamente identificados o a sus representantes legales.</Li>
              <Li>A las entidades públicas o administrativas en ejercicio de sus funciones legales o por orden judicial.</Li>
              <Li>A los terceros autorizados por el titular o por la ley.</Li>
            </Ul>
          </Section>

          {/* SECTION 7 */}
          <Section id="s7" title="7. Obligaciones de COMPAÑÍA DE ALMACENAMIENTO Y GESTIÓN S.A.S.">
            <p>COALGE S.A.S., en lineamiento con lo que disponen los artículos 17 y 18 de la Ley 1581 de 2012, y en virtud de su calidad de "responsable de tratamiento de información personal", adopta los siguientes compromisos con los titulares de la información personal:</p>
            <Ul>
              <Li>Garantizar al titular, en todo tiempo, el pleno y efectivo ejercicio del derecho de hábeas data.</Li>
              <Li>Solicitar la autorización otorgada por el Titular.</Li>
              <Li>Informar debidamente al Titular sobre la finalidad de la recolección y los derechos que le asisten por virtud de la autorización otorgada.</Li>
              <Li>Conservar la información bajo las condiciones de seguridad necesarias para impedir su adulteración, pérdida, consulta, uso o acceso no autorizado o fraudulento.</Li>
              <Li>Garantizar que la información que se suministre al encargado del tratamiento sea veraz, completa, exacta, actualizada, comprobable y comprensible.</Li>
              <Li>Actualizar la información, comunicando de forma oportuna al encargado del tratamiento todas las novedades respecto de los datos que previamente le haya suministrado.</Li>
              <Li>Rectificar la información cuando sea incorrecta y comunicar lo pertinente al Encargado del Tratamiento.</Li>
              <Li>Suministrar al Encargado del Tratamiento únicamente datos cuyo tratamiento esté previamente autorizado de conformidad con lo previsto en la ley.</Li>
              <Li>Exigir al Encargado del Tratamiento en todo momento el respeto a las condiciones de seguridad y privacidad de la información del titular.</Li>
              <Li>Tramitar las consultas y reclamos formulados en los términos señalados en la presente ley.</Li>
              <Li>Adoptar un manual interno de políticas y procedimientos para garantizar el adecuado cumplimiento de la presente ley y, en especial, para la atención de consultas y reclamos.</Li>
              <Li>Informar al Encargado del Tratamiento cuando determinada información se encuentre en discusión por parte del titular, una vez se haya presentado la reclamación y no haya finalizado el trámite respectivo.</Li>
              <Li>Informar a solicitud del titular sobre el uso dado a sus datos.</Li>
              <Li>Informar a la autoridad de protección de datos cuando se presenten violaciones a los códigos de seguridad y existan riesgos en la administración de la información de los Titulares.</Li>
              <Li>Cumplir las instrucciones y requerimientos que imparta la <strong>Superintendencia de Industria y Comercio</strong>.</Li>
            </Ul>
          </Section>

          {/* SECTION 8 */}
          <Section id="s8" title="8. Cambios a esta Política de Tratamiento de Datos Personales">
            <p>Esta Política de Tratamiento de Datos Personales puede ser modificada para cumplir con las leyes aplicables o para ajustarse a nuestras prácticas comerciales actuales. Publicaremos cualquier cambio en nuestro sitio web y, en caso de que se produzcan modificaciones sustanciales en la política, en aspectos como la identidad del responsable de los datos y/o los medios y fines del tratamiento de los datos exigidos por la legislación aplicable, solicitaremos la autorización del titular de los datos o nos esforzaremos por avisarle con antelación de dicho cambio destacando la modificación en nuestro sitio web, de conformidad con la legislación aplicable.</p>
            <p className="mt-2">Lo invitamos a que vuelva a visitar nuestro sitio web de vez en cuando para comprobar si hay actualizaciones.</p>
          </Section>

          {/* SECTION 9 */}
          <Section id="s9" title="9. Limitaciones Temporales">
            <p>RaumLog y COALGE solo podrán recoger, almacenar, utilizar o difundir los datos personales durante el tiempo que sea razonable y necesario, de acuerdo con los fines que justificaron el tratamiento, y de acuerdo con la autorización otorgada.</p>
          </Section>

          {/* SECTION 10 */}
          <Section id="s10" title="10. Entrada en Vigencia">
            <p>Esta política rige a partir de la fecha de su publicación y estará vigente durante el tiempo que COALGE y RaumLog ejecuten las actividades descritas en la presente política y las mismas se correspondan con las finalidades de tratamiento que inspiraron la presente política.</p>
          </Section>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
            <p>© {new Date().getFullYear()} COALGE S.A.S. · NIT 902.029.993 · Medellín, Colombia</p>
            <p className="mt-2">Para cualquier duda o solicitud: <a href="mailto:contacto@raumlog.com" className="text-[#2C5E8D] underline">contacto@raumlog.com</a></p>
            <p className="mt-2">
              <Link to="/terminos-y-condiciones" className="text-[#2C5E8D] hover:underline">Términos y Condiciones</Link>
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
