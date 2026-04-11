
document.addEventListener('DOMContentLoaded', () => {

    /* PREGUNTAS FRECUENTES */
    const faqItems = [
        {
            pregunta: '¿Qué necesito para registrarme en Reparify?',
            respuesta: `
                <p>Necesitás los siguientes datos:</p>
                <ul>
                    <li><strong>Datos Personales:</strong> Nombre, apellido, DNI o CUIL.</li>
                    <li><strong>Contacto:</strong> Correo electrónico y número de teléfono.</li>
                    <li><strong>Profesional:</strong> Matrícula profesional.</li>
                    <li><strong>Documentación Legal:</strong> Certificado de antecedentes penales vigente.</li>
                </ul>
            `
        },
        {
            pregunta: '¿Cuánto tarda en activarse mi cuenta?',
            respuesta: `
                <p>Una vez enviada la documentación, la revisamos en un plazo de 24 a 48 horas hábiles.
                Te notificaremos por email cuando tu perfil esté aprobado y listo para recibir solicitudes.</p>
            `
        },
        {
            pregunta: '¿En qué zonas puedo trabajar?',
            respuesta: `
                <p>Podés configurar tu zona de cobertura en tu perfil. Reparify opera en todo el
                Gran Buenos Aires y CABA, con expansión continua a otras provincias.</p>
            `
        },
        {
            pregunta: '¿Cuánto cuesta usar Reparify?',
            respuesta: `
                <p>El registro y el uso de la plataforma son completamente gratuitos para los profesionales.
                No cobramos comisión por los trabajos que concretés.</p>
            `
        },
        {
            pregunta: '¿Cómo recibo el cobro?',
            respuesta: `
                <p>El cobro lo acordás directamente con el cliente. Reparify no intermedia en el
                pago: podés cobrar en efectivo, transferencia o el método que prefieras.</p>
            `
        }
    ];


    /* RENDER DEL FAQ
       Genera los <details> con <summary> y la respuesta para cada item. */
    function renderFaq() {
        const contenedor = document.getElementById('faqLista');
        if (!contenedor) return;

        contenedor.innerHTML = faqItems.map((item, i) => `
            <details class="faq-item">
                <summary class="faq-pregunta">
                    ${item.pregunta}
                    <span class="faq-chevron">›</span>
                </summary>
                <div class="faq-respuesta">
                    ${item.respuesta}
                </div>
            </details>
        `).join('');
    }

    renderFaq();

});