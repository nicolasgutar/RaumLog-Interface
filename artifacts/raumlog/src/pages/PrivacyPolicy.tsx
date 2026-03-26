import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10">
      <h2 className="font-heading text-xl uppercase tracking-wide text-[#2C5E8D] border-b-2 border-[#AECBE9] pb-2 mb-4">
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

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero banner — igual que el resto del sitio */}
      <section className="bg-[#2C5E8D] py-14 px-4 text-center">
        <h1 className="font-heading text-4xl lg:text-5xl text-white mb-3 uppercase tracking-wide">
          Política de Privacidad
        </h1>
        <p className="text-[#AECBE9] text-base lg:text-lg">
          COMPAÑÍA DE ALMACENAMIENTO Y GESTIÓN S.A.S. (COALGE) · NIT 902.029.993 · Medellín, Colombia
        </p>
      </section>

      <main className="flex-1 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <div className="bg-blue-50 border border-[#AECBE9] rounded-xl p-4 mb-10 text-sm text-[#1a3d5c]">
            <p>El presente documento constituye la <strong>Política de Tratamiento de Datos Personales</strong> de <strong>COMPAÑÍA DE ALMACENAMIENTO Y GESTIÓN S.A.S.</strong> (COALGE), sociedad comercial identificada con <strong>NIT 902.029.993</strong>, con domicilio principal en la ciudad de Medellín, Colombia.</p>
            <p className="mt-2">COALGE, como propietaria y operadora de la plataforma tecnológica RaumLog, actúa como <strong>responsable del tratamiento</strong> de los datos personales recolectados a través de sus canales de interacción. Marco legal aplicable: <strong>Ley 1581 de 2012</strong> (Colombia).</p>
          </div>

          {/* SECTION 1 */}
          <Section id="s1" title="1. Objeto">
            <p>COALGE S.A.S. reconoce la importancia de la seguridad, privacidad y confidencialidad de los Datos Personales de nuestros clientes y posibles clientes, empleados, candidatos, accionistas, proveedores, contratistas (en adelante denominados "Titulares").</p>
            <p>El objetivo de esta Política es comunicarle cómo tratamos sus Datos Personales, qué tipo de datos recopilamos, los principios que rigen nuestras actividades de tratamiento de datos, sus derechos y las finalidades de nuestras actividades de tratamiento.</p>
            <p>Esta Política aplica a todas nuestras actividades.</p>
          </Section>

          {/* SECTION 2 */}
          <Section id="s2" title="2. Alcance">
            <p>Esta Política aplica a todos los Datos Personales que recopilamos y tratamos para prestar nuestros servicios y cumplir con las obligaciones que tenemos con usted y con las autoridades.</p>
          </Section>

          {/* SECTION 3 */}
          <Section id="s3" title="3. Definiciones">
            <Ul>
              <Li><strong>Autorización:</strong> Manifestación de voluntad libre, específica, informada e inequívoca por la que el Titular acepta el tratamiento de sus Datos Personales.</Li>
              <Li><strong>Base de Datos:</strong> Conjunto organizado de Datos Personales, automatizados o no, cualquiera que sea la forma de su creación, almacenamiento, organización y acceso.</Li>
              <Li><strong>Datos Biométricos:</strong> Datos Personales obtenidos a partir de un tratamiento técnico específico que permitan identificar unívocamente a una persona, como imágenes faciales o datos dactiloscópicos.</Li>
              <Li><strong>Datos Personales:</strong> Toda información sobre un individuo identificado o identificable directa o indirectamente, en particular mediante un identificador como nombre, número de identificación, datos de localización o un identificador en línea.</Li>
              <Li><strong>Datos Personales Sensibles:</strong> Aquellos que revelen el origen racial o étnico, opiniones políticas, creencias religiosas o filosóficas, pertenencia sindical, salud, vida u orientación sexual, información genética o biométrica, o información sobre condenas penales.</Li>
              <Li><strong>Encargado del Tratamiento:</strong> La persona física o jurídica que trate datos Personales por cuenta del Responsable del Tratamiento.</Li>
              <Li><strong>Incidente de Seguridad:</strong> Toda violación de la seguridad que ocasione destrucción, pérdida, alteración, comunicación o acceso no autorizado a Datos Personales.</Li>
              <Li><strong>Responsable del Tratamiento:</strong> La persona física o jurídica que, solo o junto con otros, determine los fines y medios del tratamiento de los Datos Personales.</Li>
              <Li><strong>Titular:</strong> Cualquier persona natural cuyos datos Personales son objeto de las actividades de tratamiento.</Li>
              <Li><strong>Tratamiento de Datos:</strong> Cualquier operación realizada sobre datos Personales, como la recolección, registro, organización, conservación, adaptación, extracción, consulta, utilización, comunicación, difusión, interconexión, limitación, supresión o destrucción.</Li>
            </Ul>
          </Section>

          {/* SECTION 4 */}
          <Section id="s4" title="4. Descripción del Tratamiento">
            <p>Tratamos sus Datos Personales con base en los siguientes principios y de conformidad con la legislación aplicable:</p>
            <Ul>
              <Li>Tratamos sus datos de forma legal, equitativa y transparente.</Li>
              <Li>Sus Datos Personales se tratan con fines específicos, explícitos y legítimos, no incompatibles con dichos fines.</Li>
              <Li>Nuestras actividades de tratamiento son adecuadas, pertinentes y se limitan a lo necesario en relación con los fines para los que se tratan.</Li>
              <Li>Los datos que tratamos sobre usted son exactos y, cuando sea necesario, se mantienen actualizados. La veracidad de los datos suministrados es responsabilidad exclusiva del Titular.</Li>
              <Li>Definimos procesos para proteger los datos personales de la pérdida, mal uso, acceso no autorizado, divulgación, alteración y destrucción.</Li>
            </Ul>

            <Sub title="4.1 Derechos de los Titulares">
              <p>Los Titulares tienen derecho a:</p>
              <Ul>
                <Li>Acceder en forma gratuita a los datos suministrados.</Li>
                <Li>Conocer, actualizar y rectificar su información en caso de datos parciales, inexactos, incompletos o cuyo tratamiento esté prohibido.</Li>
                <Li>Solicitar prueba de la autorización otorgada.</Li>
                <Li>Presentar quejas ante la <strong>Superintendencia de Industria y Comercio (SIC)</strong> por infracciones a la normatividad vigente.</Li>
                <Li>Revocar la autorización y solicitar la supresión de los datos, siempre que no exista obligación legal o contractual que impida su supresión.</Li>
                <Li>Abstenerse de otorgar autorización para el tratamiento de datos sensibles o de menores de edad.</Li>
                <Li>Ser informado respecto del uso dado a sus datos personales.</Li>
              </Ul>
            </Sub>

            <Sub title="4.2 Tipos de datos que tratamos">
              <p>Podemos recopilar Datos Personales sobre usted directa o automáticamente a través del uso de nuestro sitio web y/o de fuentes de terceros. Estas fuentes pueden incluir proveedores de servicios, socios de mercadeo, redes de publicidad, proveedores de análisis, bases de datos públicas, plataformas de medios sociales, entidades gubernamentales y procesadores de pagos.</p>
              <p className="font-medium text-gray-800 mt-2">Datos de información personal:</p>
              <Ul>
                <Li>Nombre, edad, ocupación, fecha y lugar de nacimiento.</Li>
                <Li>Tipo y número de identificación, sexo, estado civil, ciudadanía.</Li>
                <Li>País y ciudad de residencia, información de contacto.</Li>
              </Ul>
              <p className="font-medium text-gray-800 mt-3">Datos laborales y de beneficios:</p>
              <Ul>
                <Li>Para solicitudes de empleo: podemos tratar datos sensibles como antecedentes penales o estado de salud, con la respectiva autorización.</Li>
                <Li>Datos relacionados con profesión, ocupación, referencias y verificación de antecedentes.</Li>
              </Ul>
            </Sub>

            <Sub title="4.3 Datos Sensibles">
              <p>RaumLog tratará Datos Sensibles cuando:</p>
              <Ul>
                <Li>Cuente con autorización explícita del Titular, salvo los casos en que la Ley 1581/2012 establezca que no se requiere.</Li>
                <Li>El tratamiento sea necesario para salvaguardar el interés vital del Titular, y éste esté física o jurídicamente imposibilitado para otorgar la autorización.</Li>
                <Li>El tratamiento se refiera a datos necesarios para el reconocimiento, ejercicio o defensa de un derecho en un proceso judicial.</Li>
                <Li>El tratamiento tenga una finalidad histórica, estadística o científica, adoptando medidas necesarias para la supresión de la identidad del Titular.</Li>
              </Ul>
            </Sub>

            <Sub title="4.4 Finalidades del Tratamiento por Tipo de Titular">
              <p className="font-medium text-gray-800">Para todos los Titulares:</p>
              <Ul>
                <Li>Asuntos fiscales, comerciales, contractuales, corporativos y cualquier obligación de COALGE.</Li>
                <Li>Emitir certificaciones contractuales solicitadas por contratistas o proveedores.</Li>
                <Li>Gestionar trámites: peticiones, quejas, reclamaciones.</Li>
                <Li>Contactar con el Titular por cualquier medio.</Li>
                <Li>Proporcionar información a terceros con relación contractual con COALGE.</Li>
                <Li>Cobro de facturas, títulos valores y saldos pendientes.</Li>
                <Li>Consultar o gestionar asuntos del sistema de seguridad social y temas tributarios.</Li>
                <Li>Consultar antecedentes judiciales, administrativos y financieros (debida diligencia).</Li>
                <Li>Transferir o transmitir información cuando sea necesario para cumplir con las finalidades de esta política.</Li>
                <Li>Establecer canales de comunicación y enviar información institucional y comercial.</Li>
                <Li>Ejecutar actividades de publicidad relacionadas con el objeto social de COALGE.</Li>
                <Li>Almacenar información en archivos cuando exista deber legal de mantenerla.</Li>
                <Li>Verificar, consultar y reportar información sobre comportamiento crediticio.</Li>
                <Li>Verificar y consultar antecedentes judiciales, inhabilidades, incompatibilidades y listas LA/FT/PADM.</Li>
              </Ul>

              <p className="font-medium text-gray-800 mt-4">Para empleados, candidatos, contratistas y ex-empleados:</p>
              <Ul>
                <Li>Procesos de selección, promoción, bienestar laboral, nómina, evaluaciones de desempeño, inducción, entrenamiento y seguridad y salud en el trabajo.</Li>
                <Li>Investigación, análisis y reporte de incidentes al interior de las instalaciones de COALGE.</Li>
                <Li>Conocer el entorno familiar de cada empleado, garantizando los derechos laborales derivados.</Li>
                <Li>Acceder a historias clínicas para el recobro de incapacidades y seguimiento de recomendaciones médicas.</Li>
                <Li>Controlar el acceso a las instalaciones de COALGE.</Li>
                <Li>Recolectar, almacenar y usar la imagen de los Titulares para publicaciones institucionales y de mercadeo, para su divulgación en la página web y redes sociales de RaumLog.</Li>
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
                <Li>Analizar el establecimiento y/o mantenimiento de relaciones contractuales y sus riesgos.</Li>
              </Ul>

              <p className="font-medium text-gray-800 mt-4">Datos de menores de edad:</p>
              <p>COALGE S.A.S. se abstendrá, por regla general, de manipular datos cuyo titular sea un menor de edad. Excepcionalmente, cuando se requiera, COALGE someterá el tratamiento a estas reglas:</p>
              <Ul>
                <Li>Respeto del interés superior de los niños, niñas y adolescentes.</Li>
                <Li>Respeto de los derechos fundamentales de los menores de edad.</Li>
                <Li>Obtención de autorización emitida por el representante legal del menor.</Li>
              </Ul>
            </Sub>
          </Section>

          {/* SECTION 5 */}
          <Section id="s5" title="5. Canales de Contacto">
            <p>Para cualquier solicitud, consulta o queja relacionada con esta Política, puede comunicarse con:</p>
            <div className="bg-gray-50 border border-[#AECBE9]/60 rounded-xl p-5 mt-2">
              <p className="font-semibold text-[#1a3d5c]">RaumLog / COALGE S.A.S.</p>
              <p className="mt-1">Correo electrónico: <a href="mailto:contacto@raumlog.com" className="text-[#2C5E8D] underline">contacto@raumlog.com</a></p>
              <p className="mt-1">Horario de atención: Lunes a viernes, 8:00 a.m. – 6:00 p.m.</p>
              <p className="mt-1 text-xs text-gray-500">Las solicitudes recibidas fuera de este horario se entenderán radicadas al día hábil siguiente.</p>
            </div>

            <p className="mt-4">Todas las solicitudes deben contener:</p>
            <Ul>
              <Li>Nombre y apellidos completos.</Li>
              <Li>Datos de contacto (dirección física, correo electrónico o teléfono).</Li>
              <Li>Medios para recibir una respuesta.</Li>
              <Li>Motivo(s)/hecho(s) que originan la solicitud con descripción del derecho que desea ejercer (conocer, actualizar, rectificar, solicitar prueba de autorización, revocar, suprimir, acceder).</Li>
              <Li>Firma y número de identificación.</Li>
            </Ul>

            <Sub title="5.1 Consultas">
              <Ul>
                <Li>Los titulares, su apoderado o sus causahabientes podrán consultar la información personal contenida en las bases de datos de RaumLog y COALGE.</Li>
                <Li>Las solicitudes se recibirán de lunes a viernes de 8:00 a.m. a 6:00 p.m.</Li>
                <Li>La consulta será respondida en un plazo máximo de <strong>diez (10) días hábiles</strong> a partir de la fecha de recepción.</Li>
                <Li>Cuando no sea posible atender la consulta dentro de dicho plazo, se informará al interesado y se indicará la nueva fecha, que en ningún caso podrá exceder <strong>cinco (5) días hábiles</strong> adicionales.</Li>
              </Ul>
            </Sub>

            <Sub title="5.2 Reclamaciones">
              <Ul>
                <Li>El Titular que considere que la información debe ser corregida, actualizada o eliminada podrá presentar una reclamación ante COALGE.</Li>
                <Li>La reclamación será atendida en un plazo máximo de <strong>quince (15) días hábiles</strong> desde la fecha de recepción.</Li>
                <Li>Cuando no sea posible atender el reclamo dentro de dicho término, se informará al interesado y se indicará la nueva fecha, que en ningún caso podrá exceder <strong>ocho (8) días hábiles</strong> adicionales.</Li>
                <Li>Si el reclamo es incompleto, el interesado tendrá <strong>cinco (5) días hábiles</strong> para subsanar. Transcurridos dos (2) meses sin respuesta, se entenderá que el reclamo ha sido desistido.</Li>
              </Ul>
            </Sub>

            <Sub title="5.3 Revocatoria">
              <p>Usted puede revocar la autorización otorgada para el tratamiento de sus Datos Personales. No obstante, es posible que, debido a una obligación legal, debamos seguir tratando sus datos. La revocatoria para determinados fines puede implicar la finalización de su relación con nosotros.</p>
            </Sub>
          </Section>

          {/* SECTION 6 */}
          <Section id="s6" title="6. Información">
            <p>La información solicitada podrá ser suministrada por cualquier medio, incluyendo los electrónicos. La información sobre los Datos Personales podrá ser suministrada a:</p>
            <Ul>
              <Li>Al Titular, al apoderado debidamente facultado, a sus causahabientes o a sus representantes legales.</Li>
              <Li>A las entidades públicas o administrativas en ejercicio de sus funciones legales o por orden judicial.</Li>
              <Li>A los terceros autorizados por el Titular o por la ley.</Li>
            </Ul>
          </Section>

          {/* SECTION 7 */}
          <Section id="s7" title="7. Obligaciones de COALGE S.A.S.">
            <p>COALGE S.A.S., en lineamiento con los artículos 17 y 18 de la Ley 1581 de 2012, adopta los siguientes compromisos con los Titulares:</p>
            <Ul>
              <Li>Garantizar al Titular, en todo tiempo, el pleno y efectivo ejercicio del derecho de hábeas data.</Li>
              <Li>Solicitar y conservar la autorización otorgada por el Titular.</Li>
              <Li>Informar debidamente al Titular sobre la finalidad de la recolección y los derechos que le asisten.</Li>
              <Li>Conservar la información bajo las condiciones de seguridad necesarias para impedir su adulteración, pérdida, consulta, uso o acceso no autorizado.</Li>
              <Li>Garantizar que la información suministrada al Encargado del Tratamiento sea veraz, completa, exacta, actualizada, comprobable y comprensible.</Li>
              <Li>Actualizar la información, comunicando de forma oportuna al Encargado del Tratamiento todas las novedades.</Li>
              <Li>Rectificar la información cuando sea incorrecta y comunicar lo pertinente al Encargado del Tratamiento.</Li>
              <Li>Suministrar al Encargado únicamente datos cuyo tratamiento esté previamente autorizado conforme a la ley.</Li>
              <Li>Exigir al Encargado del Tratamiento el respeto a las condiciones de seguridad y privacidad de la información del Titular.</Li>
              <Li>Tramitar las consultas y reclamos formulados en los términos señalados en la presente ley.</Li>
              <Li>Adoptar un manual interno de políticas y procedimientos para garantizar el adecuado cumplimiento de la ley.</Li>
              <Li>Informar a solicitud del Titular sobre el uso dado a sus datos.</Li>
              <Li>Informar a la autoridad de protección de datos cuando se presenten violaciones a los códigos de seguridad y existan riesgos en la administración de la información.</Li>
              <Li>Cumplir las instrucciones y requerimientos que imparta la <strong>Superintendencia de Industria y Comercio</strong>.</Li>
            </Ul>
          </Section>

          {/* SECTION 8 */}
          <Section id="s8" title="8. Cambios a esta Política">
            <p>Esta Política puede ser modificada para cumplir con las leyes aplicables o para ajustarse a nuestras prácticas comerciales. Publicaremos cualquier cambio en nuestro sitio web y, en caso de modificaciones sustanciales, solicitaremos la autorización del Titular o le avisaremos con antelación destacando la modificación.</p>
            <p className="mt-2">Lo invitamos a que vuelva a visitar nuestro sitio web de vez en cuando para comprobar si hay actualizaciones.</p>
          </Section>

          {/* SECTION 9 */}
          <Section id="s9" title="9. Limitaciones Temporales">
            <p>RaumLog y COALGE solo podrán recoger, almacenar, utilizar o difundir los datos personales durante el tiempo que sea razonable y necesario, de acuerdo con los fines que justificaron el tratamiento y de conformidad con la autorización otorgada.</p>
          </Section>

          {/* SECTION 10 */}
          <Section id="s10" title="10. Entrada en Vigencia">
            <p>Esta Política rige a partir de la fecha de su publicación y estará vigente durante el tiempo que COALGE y RaumLog ejecuten las actividades descritas y las mismas se correspondan con las finalidades de tratamiento que la inspiraron.</p>
          </Section>

          {/* Bottom nav */}
          <div className="border-t border-[#AECBE9]/50 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} COALGE S.A.S. · NIT 902.029.993 · Medellín, Colombia · <a href="mailto:contacto@raumlog.com" className="text-[#2C5E8D] hover:underline">contacto@raumlog.com</a></p>
            <div className="flex gap-4">
              <Link to="/terminos-y-condiciones" className="text-[#2C5E8D] hover:underline">Términos y Condiciones</Link>
              <Link to="/" className="text-[#2C5E8D] hover:underline">Volver al inicio</Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
