document.addEventListener('DOMContentLoaded', () => {

    const faqItems = [
        {
            pregunta: '¿Qué tipo de problemas puede diagnosticar Reparify?',
            respuesta: `
             <p>Reparify puede diagnosticar problemas de plomería, electricidad, gas, climatización, carpintería, albañilería y más. Solo subí una foto o video y nuestra IA analizará el
            caso</p> `
        },

        {
            pregunta: '¿Qué tan preciso es el diagnóstico de la IA?',
            respuesta: `
             <p>Nuestra IA tiene un 98% de precisión en el análisis de problemas domésticos, basada en  miles de casos resueltos por profesionales verificados.</p> `
        },
        {
            pregunta: '¿Necesito registrarme para usar el servicio?',
            respuesta: `
             <p>Para usar el servicio, es necesario registrarse en nuestra plataforma. El registro es gratuito y te permitirá acceder a todas las funcionalidades de Reparify.</p> `
        },
        {
            pregunta: '¿Cuánto tiempo tarda el diagnóstico?',
            respuesta: `
             <p>El diagnóstico es instantáneo. En menos de 30 segundos obtenés una evaluación completa
   del problema y las opciones para resolverlo.</p> `
        },
        {
            pregunta: '¿Qué formato de archivos puedo subir?',
            respuesta: `
             <p>Aceptamos imágenes JPG, PNG y WEBP, y videos en formato MP4, MOV y AVI de hasta 100 MB.
    También podés describir el problema solo con texto.</p> `
        },
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
})