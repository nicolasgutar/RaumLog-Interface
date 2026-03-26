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
  return <li className="ml-5 list-disc text-gray-700">{children}</li>;
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAFC]">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-[#AECBE9]/30 p-8 md:p-12">
          <div className="mb-10 text-center">
            <img src="/raumlog-logo-main.png" alt="RaumLog" className="h-16 w-auto mx-auto mb-4 object-contain" />
            <h1 className="text-3xl font-bold text-[#1a3d5c]">Política de Tratamiento de Datos Personales</h1>
            <p className="text-sm text-gray-500 mt-2">Plataforma RaumLog · COMPAÑÍA DE ALMACENAMIENTO Y GESTIÓN S.A.S. (COALGE)</p>
            <p className="text-xs text-gray-400 mt-1">Última actualización: Febrero 2026 · NIT 902.029.993 · Medellín, Colombia</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-10 text-sm text-blue-900">
            <strong>Responsable del tratamiento:</strong> COALGE S.A.S., propietaria y operadora de la plataforma tecnológica RaumLog, actúa como responsable del tratamiento de los datos personales recolectados a través de su sitio web, aplicaciones móviles, canales de atención y demás medios de interacción con Anfitriones, Usuarios, aliados y terceros. Marco legal: <strong>Ley 1581 de 2012</strong> (Colombia).
          </div>

          <Section id="s1" title="1. Objeto">
            <p>Esta Política comunica e informa cómo COALGE S.A.S. trata sus Datos Personales, qué tipo de datos recolectamos, los principios que rigen nuestras actividades de tratamiento, sus derechos y las finalidades del tratamiento de datos.</p>
          </Section>

          <Section id="s2" title="2. Alcance">
            <p>Esta Política aplica a todos los Datos Personales que recopilamos y tratamos para prestar nuestros servicios y cumplir con las obligaciones que tenemos con usted y con las autoridades. Aplica a clientes, posibles clientes, empleados, candidatos, accionistas, proveedores, contratistas y aliados (en adelante, los "Titulares").</p>
          </Section>

          <Section id="s3" title="3. Definiciones Clave">
            <ul className="space-y-2">
              <Bullet><strong>Autorización:</strong> Manifestación de voluntad libre, específica, informada e inequívoca del Titular para el tratamiento de sus datos.</Bullet>
              <Bullet><strong>Datos Personales:</strong> Toda información sobre un individuo identificado o identificable (nombre, número de identificación, correo electrónico, etc.).</Bullet>
              <Bullet><strong>Datos Personales Sensibles:</strong> Los que revelen origen racial, opiniones políticas, creencias religiosas, afiliación sindical, datos de salud, vida u orientación sexual, datos genéticos o biométricos.</Bullet>
              <Bullet><strong>Titular:</strong> Persona natural cuyos datos son objeto de tratamiento.</Bullet>
              <Bullet><strong>Tratamiento:</strong> Cualquier operación sobre datos personales (recolección, almacenamiento, uso, transmisión, supresión, etc.).</Bullet>
              <Bullet><strong>Responsable del Tratamiento:</strong> COALGE S.A.S., quien determina los fines y medios del tratamiento.</Bullet>
            </ul>
          </Section>

          <Section id="s4" title="4. Derechos de los Titulares">
            <Sub title="4.1 Sus derechos">
              <p>Como Titular de datos personales, usted tiene derecho a:</p>
              <ul className="space-y-1 mt-2">
                <Bullet>Acceder en forma gratuita a los datos suministrados.</Bullet>
                <Bullet>Conocer, actualizar y rectificar su información cuando sea parcial, inexacta, incompleta o induzca a error.</Bullet>
                <Bullet>Solicitar prueba de la autorización otorgada.</Bullet>
                <Bullet>Presentar quejas ante la <strong>Superintendencia de Industria y Comercio (SIC)</strong> por infracciones a la normatividad vigente.</Bullet>
                <Bullet>Revocar la autorización y solicitar la supresión de los datos, salvo obligación legal o contractual que lo impida.</Bullet>
                <Bullet>Abstenerse de otorgar autorización para el tratamiento de datos sensibles o de menores de edad.</Bullet>
                <Bullet>Ser informado sobre el uso dado a sus datos personales.</Bullet>
              </ul>
            </Sub>
            <Sub title="4.2 Tipos de datos que tratamos">
              <p>Podemos recopilar los siguientes Datos Personales:</p>
              <ul className="space-y-1 mt-2">
                <Bullet>Nombre, edad, ocupación, fecha y lugar de nacimiento.</Bullet>
                <Bullet>Tipo y número de identificación, sexo, estado civil.</Bullet>
                <Bullet>Ciudadanía, país y ciudad de residencia.</Bullet>
                <Bullet>Información de contacto (dirección, teléfono, correo electrónico).</Bullet>
                <Bullet>Referencias laborales, antecedentes y verificaciones (para empleados y candidatos).</Bullet>
                <Bullet>Datos de comportamiento crediticio y actividad comercial.</Bullet>
              </ul>
            </Sub>
            <Sub title="4.3 Datos Sensibles">
              <p>RaumLog tratará Datos Sensibles únicamente cuando cuente con autorización explícita del Titular, cuando sea necesario para salvaguardar su interés vital, para el reconocimiento de un derecho en proceso judicial, o con fines históricos o estadísticos con supresión de identidad.</p>
            </Sub>
          </Section>

          <Section id="s5" title="5. Finalidades del Tratamiento">
            <Sub title="Para todos los Titulares">
              <ul className="space-y-1">
                <Bullet>Asuntos fiscales, comerciales, contractuales y corporativos de COALGE.</Bullet>
                <Bullet>Gestión de trámites: peticiones, quejas y reclamaciones.</Bullet>
                <Bullet>Contacto con el Titular por cualquier medio.</Bullet>
                <Bullet>Cobro de facturas y saldos pendientes.</Bullet>
                <Bullet>Consulta de antecedentes judiciales, administrativos y financieros (debida diligencia).</Bullet>
                <Bullet>Consulta en listas restrictivas (OFAC, ONU, LA/FT/PADM/C/ST).</Bullet>
                <Bullet>Actividades de publicidad relacionadas con el objeto social de COALGE.</Bullet>
                <Bullet>Verificación crediticia y de comportamiento comercial.</Bullet>
              </ul>
            </Sub>
            <Sub title="Para clientes y posibles clientes">
              <ul className="space-y-1">
                <Bullet>Seguimiento al cumplimiento de obligaciones contractuales.</Bullet>
                <Bullet>Análisis y mantenimiento de relaciones contractuales.</Bullet>
                <Bullet>Evaluación de riesgos derivados de las relaciones vigentes y futuras.</Bullet>
              </ul>
            </Sub>
            <Sub title="Para empleados y candidatos">
              <ul className="space-y-1">
                <Bullet>Procesos de selección, nómina, evaluaciones de desempeño y bienestar laboral.</Bullet>
                <Bullet>Seguridad y salud en el trabajo.</Bullet>
                <Bullet>Acceso a historias clínicas para recobro de incapacidades.</Bullet>
                <Bullet>Publicaciones institucionales y de mercadeo (imagen del titular).</Bullet>
              </ul>
            </Sub>
            <Sub title="Datos de menores de edad">
              <p>COALGE S.A.S. se abstendrá de manipular datos de menores de edad conforme al artículo 7° de la Ley 1581 de 2012. En casos excepcionales, se respetarán el interés superior del menor y se obtendrá autorización de su representante legal.</p>
            </Sub>
          </Section>

          <Section id="s6" title="6. Canales de Contacto y Procedimientos">
            <Sub title="Contacto">
              <p>Para cualquier solicitud relacionada con esta Política, contáctenos en:</p>
              <div className="bg-gray-50 rounded-xl p-4 mt-2 text-sm">
                <p><strong>RaumLog / COALGE S.A.S.</strong></p>
                <p>Correo: <a href="mailto:contacto@raumlog.com" className="text-[#2C5E8D] underline">contacto@raumlog.com</a></p>
                <p>Horario de atención: Lunes a viernes, 8:00 a.m. – 6:00 p.m.</p>
              </div>
              <p className="mt-2">Las solicitudes deben incluir: nombre completo, datos de contacto, medio para recibir respuesta, motivo de la solicitud, firma y número de identificación.</p>
            </Sub>
            <Sub title="5.1 Consultas">
              <p>La consulta será respondida en un plazo máximo de <strong>diez (10) días hábiles</strong> a partir de la recepción. Si no es posible atenderla en ese plazo, se informará al interesado con los motivos, sin que la nueva fecha pueda exceder cinco (5) días hábiles adicionales.</p>
            </Sub>
            <Sub title="5.2 Reclamaciones">
              <p>Las reclamaciones se atenderán en un plazo máximo de <strong>quince (15) días hábiles</strong>. Si el reclamo es incompleto, el solicitante tendrá cinco (5) días para subsanarlo; de lo contrario, se entenderá desistido tras dos (2) meses.</p>
            </Sub>
            <Sub title="5.3 Revocatoria">
              <p>Puede revocar la autorización para el tratamiento de sus datos. Tenga en cuenta que la revocatoria puede implicar la finalización de su relación con RaumLog o que, por obligación legal, debamos continuar tratando algunos datos.</p>
            </Sub>
          </Section>

          <Section id="s7" title="7. Obligaciones de COALGE S.A.S.">
            <p>En virtud de los artículos 17 y 18 de la Ley 1581 de 2012, COALGE se compromete a:</p>
            <ul className="space-y-1 mt-2">
              <Bullet>Garantizar el pleno ejercicio del derecho de hábeas data.</Bullet>
              <Bullet>Solicitar la autorización del Titular antes del tratamiento.</Bullet>
              <Bullet>Informar al Titular sobre la finalidad de la recolección y sus derechos.</Bullet>
              <Bullet>Conservar la información con las condiciones de seguridad necesarias.</Bullet>
              <Bullet>Garantizar que la información suministrada sea veraz, completa, exacta y actualizada.</Bullet>
              <Bullet>Rectificar la información cuando sea incorrecta.</Bullet>
              <Bullet>Tramitar consultas y reclamos en los términos previstos en la ley.</Bullet>
              <Bullet>Informar a la autoridad competente ante violaciones de seguridad.</Bullet>
              <Bullet>Cumplir instrucciones y requerimientos de la Superintendencia de Industria y Comercio.</Bullet>
            </ul>
          </Section>

          <Section id="s8" title="8. Cambios a esta Política">
            <p>Esta Política puede ser modificada para cumplir con las leyes aplicables o para ajustarse a nuestras prácticas comerciales. Publicaremos cualquier cambio en nuestro sitio web. En caso de modificaciones sustanciales, solicitaremos nueva autorización del Titular o le avisaremos con anticipación.</p>
          </Section>

          <Section id="s9" title="9. Limitaciones Temporales">
            <p>RaumLog y COALGE solo podrán recoger, almacenar, usar o difundir los datos personales durante el tiempo razonable y necesario, de acuerdo con los fines que justificaron el tratamiento y con la autorización otorgada.</p>
          </Section>

          <Section id="s10" title="10. Vigencia">
            <p>Esta política rige a partir de la fecha de su publicación y estará vigente durante el tiempo que COALGE y RaumLog ejecuten las actividades descritas y estas se correspondan con las finalidades de tratamiento que la inspiran.</p>
          </Section>

          <div className="border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
            <p>© {new Date().getFullYear()} COALGE S.A.S. · NIT 902.029.993 · Medellín, Colombia</p>
            <p className="mt-1">
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
