/* diagnostico.js
   Motor de palabras clave → redirige a resultadoDiagnostico.html */

const BASE_DIAGNOSTICOS = [
    /* ── PLOMERÍA ── */
    {
        profesion: 'Plomería',
        palabras: ['caño','tubería','fuga','pérdida','gotera','canilla','grifo','sifón','desagüe','inodoro','toilet','humedad','filtra','gotea','agua'],
        titulo: 'Fuga menor en conexión de agua',
        descripcion: 'Identificamos un posible desgaste en la junta de estanqueidad o un desajuste en la tuerca de compresión del sifón (desagüe). El goteo constante y focalizado en la unión sugiere que el sello hidráulico ha perdido eficacia o que la conexión se ha aflojado debido al uso diario.',
        dificultad: 'BAJA',
        solucionCasera: true,
        pasos: [
            'Cerrá la llave de paso principal del agua para evitar más fugas.',
            'Secá completamente la zona afectada y verificá de dónde viene exactamente la fuga.',
            'Aplicá cinta teflón en las roscas de la conexión y volvé a ajustar firmemente con una llave inglesa.',
            'Abrí el agua gradualmente y verificá que no haya más fugas. Si persiste, considerá contactar a un profesional.'
        ],
        advertencia: 'Solo procedé si te sentís seguro. Si en algún momento no te sentís cómodo o el problema parece más complejo, no dudes en contactar a un profesional.'
    },
    {
        profesion: 'Plomería',
        palabras: ['presión','baja presión','poca agua','no sale agua','bomba'],
        titulo: 'Baja presión en la instalación',
        descripcion: 'La baja presión puede deberse a un filtro tapado, una válvula parcialmente cerrada o un problema en la red general. Es importante descartar causas externas antes de intervenir la instalación interior.',
        dificultad: 'MEDIA',
        solucionCasera: true,
        pasos: [
            'Verificá si el problema es en toda la casa o solo en un punto (ducha, cocina, etc.).',
            'Comprobá que todas las llaves de paso estén completamente abiertas.',
            'Revisá si hay un filtro de entrada de agua y limpíalo si está obstruido.',
            'Si el problema persiste en toda la propiedad, consultá con un plomero.'
        ],
        advertencia: 'No manipules la válvula reguladora de presión sin conocimientos previos, ya que puede dañar toda la instalación.'
    },
    /* ── ELECTRICIDAD ── */
    {
        profesion: 'Electricista',
        palabras: ['luz','electricidad','cortocircuito','interruptor','enchufe','toma corriente','cable','chispa','quemado','foco','bombilla','disyuntor','térmico','tablero'],
        titulo: 'Problema en circuito eléctrico',
        descripcion: 'La descripción sugiere un posible cortocircuito, un disyuntor disparado o un contacto defectuoso en la instalación. Este tipo de falla puede originarse en cables deteriorados, empalmes incorrectos o sobrecargas en el circuito.',
        dificultad: 'MEDIA',
        solucionCasera: false,
        pasos: [
            'Identificá si la falla es solo en una zona o en toda la vivienda.',
            'Revisá el tablero eléctrico: si algún disyuntor está caído, intentá subirlo una sola vez.',
            'Si el disyuntor vuelve a caer, desconectá los artefactos de esa zona.',
            'No intentes reparar cables ni el tablero por tu cuenta. Llamá a un electricista matriculado.'
        ],
        advertencia: 'Los trabajos eléctricos implican riesgo de electrocución e incendio. Solo un profesional matriculado debe intervenir la instalación.'
    },
    {
        profesion: 'Electricista',
        palabras: ['apagón','no hay luz','sin electricidad','corte de luz','no enciende','no funciona el enchufe'],
        titulo: 'Corte parcial de electricidad',
        descripcion: 'Un corte parcial de luz generalmente está relacionado con un disyuntor o fusible que se disparó por sobrecarga, o con un problema puntual en el cableado de ese sector.',
        dificultad: 'BAJA',
        solucionCasera: true,
        pasos: [
            'Revisá el tablero eléctrico y buscá el disyuntor caído o en posición intermedia.',
            'Desconectá todos los artefactos del sector afectado.',
            'Intentá subir el disyuntor. Si se mantiene arriba, el problema era una sobrecarga.',
            'Reconectá los artefactos de a uno para identificar cuál genera la sobrecarga.'
        ],
        advertencia: 'Si el disyuntor cae repetidamente, no lo fuerces. El circuito puede tener un defecto que requiere revisión profesional.'
    },
    /* ── GAS ── */
    {
        profesion: 'Gasista',
        palabras: ['gas','olor a gas','pérdida de gas','calefón','termotanque','estufa','garrafa','caldera','calefacción','llama','piloto'],
        titulo: 'Posible fuga o falla en instalación de gas',
        descripcion: 'El olor a gas o la falla en la ignición de artefactos puede indicar una pérdida en una conexión flexible, un problema en el regulador o un piloto apagado. Las instalaciones de gas requieren intervención de un profesional matriculado.',
        dificultad: 'ALTA',
        solucionCasera: false,
        pasos: [
            'Si sentís olor a gas, abrí todas las ventanas y puertas de inmediato para ventilar.',
            'Cerrá la llave general del gas (la válvula principal ubicada cerca del medidor).',
            'NO enciendas ni apagues ningún interruptor, ni uses el teléfono dentro del ambiente.',
            'Salí del lugar y llamá al servicio de emergencias de gas o a un gasista matriculado urgente.'
        ],
        advertencia: '⚠️ Las fugas de gas son una emergencia. No intentes ninguna reparación por tu cuenta. Evacuá y llamá a emergencias.'
    },
    {
        profesion: 'Gasista',
        palabras: ['no calienta agua','agua fría','calefón no enciende','termotanque frío','sin agua caliente'],
        titulo: 'Falla en calentador de agua a gas',
        descripcion: 'La falta de agua caliente generalmente se debe al piloto apagado, un electrodo de encendido defectuoso, o falta de tiro en el conducto de evacuación de gases.',
        dificultad: 'MEDIA',
        solucionCasera: false,
        pasos: [
            'Verificá si el calefón o termotanque tiene luz piloto encendida.',
            'Si el piloto está apagado, seguí las instrucciones del fabricante para encenderlo.',
            'Revisá que la llave de gas del artefacto esté abierta.',
            'Si no lográs encenderlo o el problema persiste, llamá a un gasista habilitado.'
        ],
        advertencia: 'No intentes reparar internamente el calefón ni sus conexiones. Solo un gasista matriculado puede intervenir en instalaciones de gas.'
    },
    /* ── CARPINTERÍA ── */
    {
        profesion: 'Carpintería',
        palabras: ['puerta','ventana','madera','bisagra','cerradura','marco','portón','cajón','mueble','traba','no cierra','no abre','tabla','parquet'],
        titulo: 'Problema en carpintería de madera',
        descripcion: 'Las puertas o ventanas que no cierran correctamente suelen deberse a la dilatación de la madera por humedad, bisagras flojas o marcos desalineados. En la mayoría de los casos es una reparación sencilla.',
        dificultad: 'BAJA',
        solucionCasera: true,
        pasos: [
            'Identificá en qué punto roza o traba la puerta/ventana marcando la zona de fricción con lápiz.',
            'Si las bisagras están flojas, ajustá los tornillos o reemplazalos por unos de mayor diámetro.',
            'Para rozamiento leve por humedad, lija suavemente la zona marcada y aplicá sellador para madera.',
            'Si el marco está visiblemente desalineado o la madera tiene grietas profundas, consultá con un carpintero.'
        ],
        advertencia: 'Antes de lijar o cortar, verificá que la puerta no roza por desalineación del marco, lo cual puede indicar un problema estructural.'
    },
    {
        profesion: 'Carpintería',
        palabras: ['cerrojo','llave','no gira','cerradura rota','cambiar cerradura','me quedé afuera'],
        titulo: 'Falla en cerradura',
        descripcion: 'Las cerraduras pueden fallar por desgaste del cilindro, acumulación de suciedad o desalineamiento del picaporte con la caja de la cerradura.',
        dificultad: 'BAJA',
        solucionCasera: true,
        pasos: [
            'Aplicá lubricante en spray (tipo WD-40) en el cilindro de la cerradura e intentá girar la llave.',
            'Verificá que el picaporte y la placa de cierre estén bien alineados.',
            'Si la llave gira pero no cierra, ajustá la placa de la caja con un destornillador.',
            'Si la cerradura está rota o no responde, llamá a un cerrajero o carpintero para su reemplazo.'
        ],
        advertencia: 'Si la llave se rompió dentro del cilindro, no intentes extraerla con objetos improvisados ya que podés dañar el mecanismo.'
    },
    /* ── ALBAÑILERÍA ── */
    {
        profesion: 'Albañilería',
        palabras: ['pared','grieta','fisura','revoque','mancha','descascarado','techo','losa','baldosa','cerámica','porcelanato','piso roto','contrapiso'],
        titulo: 'Fisura o daño en mampostería',
        descripcion: 'Las grietas en paredes o techos pueden ser superficiales (por movimientos térmicos normales) o estructurales. La forma y el espesor de la grieta son indicadores clave para determinar su gravedad.',
        dificultad: 'MEDIA',
        solucionCasera: true,
        pasos: [
            'Observá la grieta: si es delgada, horizontal y no varía, probablemente sea por temperatura.',
            'Para grietas superficiales, limpiá la zona, aplicá enduído plástico y pintá al seco.',
            'Marcá los extremos con lápiz y la fecha. Si crece en días siguientes, hay movimiento estructural.',
            'Si la grieta es ancha (más de 3mm), en diagonal o en zonas de carga, consultá urgentemente con un albañil.'
        ],
        advertencia: 'Las grietas estructurales son una señal de alerta seria. No las cubras sin evaluar si comprometen la seguridad del edificio.'
    },
    {
        profesion: 'Albañilería',
        palabras: ['gotera en techo','llueve adentro','impermeabilización','filtra el techo','humedad en techo'],
        titulo: 'Humedad o gotera en cubierta',
        descripcion: 'Las filtraciones en techos suelen originarse en la impermeabilización deteriorada, juntas de dilatación abiertas o fisuras en la losa. La detección temprana evita daños mayores en la estructura.',
        dificultad: 'MEDIA',
        solucionCasera: false,
        pasos: [
            'Identificá la zona de ingreso del agua observando dónde aparece la humedad en el cielorraso.',
            'Inspeccioná el techo en busca de zonas sin membrana, burbujas o desprendimientos.',
            'Si es una zona pequeña, podés aplicar membrana líquida impermeabilizante de manera provisoria.',
            'Para una solución definitiva, contactá a un albañil especializado en impermeabilización.'
        ],
        advertencia: 'No subas al techo en días de lluvia o superficies mojadas. La humedad acumulada puede hacer la losa muy resbaladiza.'
    },
    /* ── PINTURERÍA ── */
    {
        profesion: 'Pinturería',
        palabras: ['pintura','pintar','descascarada','repintar','decolorado','burbuja en pintura','pintura pelada'],
        titulo: 'Deterioro en pintura de paredes',
        descripcion: 'El descascarado o ampollado de la pintura generalmente indica humedad por capilaridad, mala preparación de la superficie o pintura de baja calidad. Es importante tratar la causa raíz antes de volver a pintar.',
        dificultad: 'BAJA',
        solucionCasera: true,
        pasos: [
            'Raspá toda la pintura suelta con una espátula hasta llegar a la superficie firme.',
            'Verificá si hay humedad detrás: si la pared está húmeda al tacto, primero hay que solucionar la fuente.',
            'Aplicá sellador o fijador sobre la zona preparada antes de pintar.',
            'Pintá con rodillo usando al menos dos manos de pintura latex interior de buena calidad.'
        ],
        advertencia: 'Si la pintura pelada está acompañada de manchas oscuras (hongos), usá primero fungicida o solución de agua con lavandina antes de repintar.'
    },
    {
        profesion: 'Pinturería',
        palabras: ['moho','hongo','hongos en pared','manchas negras','manchas verdes','olor a humedad'],
        titulo: 'Presencia de hongos o moho en paredes',
        descripcion: 'Los hongos en paredes son consecuencia de exceso de humedad y falta de ventilación. Además del problema estético, pueden afectar la salud respiratoria de los habitantes.',
        dificultad: 'MEDIA',
        solucionCasera: true,
        pasos: [
            'Ventilá bien el ambiente abriendo ventanas diariamente para reducir la humedad ambiental.',
            'Limpiá la zona afectada con solución de 1 parte de lavandina y 3 de agua, usando guantes y barbijo.',
            'Dejá secar completamente (mínimo 48 horas) antes de aplicar pintura antihongos.',
            'Si el problema se repite, evaluá la fuente de humedad con un profesional.'
        ],
        advertencia: 'Usá siempre guantes, barbijo y ventilación adecuada al trabajar con lavandina. En casos de moho extenso, consultá a un especialista.'
    }
];

const DIAGNOSTICO_GENERICO = {
    profesion: null,
    titulo: 'Problema en el hogar detectado',
    descripcion: 'Hemos registrado tu problema. Para darte un diagnóstico más preciso necesitamos más detalles. Te recomendamos describir el problema con mayor especificidad.',
    dificultad: 'BAJA',
    solucionCasera: false,
    pasos: [
        'Describí el problema con más detalle: ¿dónde está?, ¿cuándo empezó?, ¿empeoró con el tiempo?',
        'Revisá si el problema afecta una sola zona o varias partes de la vivienda.',
        'Si el problema representa un riesgo inmediato (agua, gas, electricidad), llamá a un profesional de urgencia.'
    ],
    advertencia: 'Cuando hay dudas sobre la gravedad de un problema en el hogar, siempre es mejor consultar con un profesional antes de intentar repararlo.'
};

function detectarDiagnostico(texto) {
    const norm = t => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const textoNorm = norm(texto);
    let mejorMatch = null;
    let maxCoincidencias = 0;
    for (const diag of BASE_DIAGNOSTICOS) {
        let coincidencias = 0;
        for (const palabra of diag.palabras) {
            if (textoNorm.includes(norm(palabra))) coincidencias++;
        }
        if (coincidencias > maxCoincidencias) {
            maxCoincidencias = coincidencias;
            mejorMatch = diag;
        }
    }
    return maxCoincidencias > 0 ? mejorMatch : DIAGNOSTICO_GENERICO;
}

document.addEventListener('DOMContentLoaded', () => {

    /* FAQ */
    const faqItems = [
        { pregunta: '¿Qué tipo de problemas puede diagnosticar Reparify?', respuesta: '<p>Reparify puede diagnosticar problemas de plomería, electricidad, gas, carpintería, albañilería, pinturería y más. Solo describí tu problema y nuestro sistema analizará el caso.</p>' },
        { pregunta: '¿Qué tan preciso es el diagnóstico?', respuesta: '<p>Nuestro sistema detecta las palabras clave de tu descripción y te ofrece la solución más apropiada basada en miles de casos resueltos por profesionales verificados.</p>' },
        { pregunta: '¿Necesito registrarme para usar el servicio?', respuesta: '<p>Para usar el servicio, es necesario registrarse en nuestra plataforma. El registro es gratuito y te permitirá acceder a todas las funcionalidades de Reparify.</p>' },
        { pregunta: '¿Cuánto tiempo tarda el diagnóstico?', respuesta: '<p>El diagnóstico es instantáneo. En menos de 30 segundos obtenés una evaluación completa del problema y las opciones para resolverlo.</p>' },
        { pregunta: '¿Qué formato de archivos puedo subir?', respuesta: '<p>Aceptamos imágenes JPG, PNG y WEBP, y videos en formato MP4, MOV y AVI de hasta 100 MB. También podés describir el problema solo con texto.</p>' },
    ];

    function renderFaq() {
        const contenedor = document.getElementById('faqLista');
        if (!contenedor) return;
        contenedor.innerHTML = faqItems.map(item => `
            <details class="faq-item">
                <summary class="faq-pregunta">${item.pregunta}<span class="faq-chevron">›</span></summary>
                <div class="faq-respuesta">${item.respuesta}</div>
            </details>`).join('');
    }
    renderFaq();

    /* BOTÓN */
    const btn   = document.getElementById('btnDiagnostico');
    const input = document.getElementById('problemaInput');

    if (btn && input) {
        const enviar = () => {
            const texto = input.value.trim();
            if (!texto) {
                input.focus();
                input.style.boxShadow = '0 0 0 3px #186CFF66';
                setTimeout(() => { input.style.boxShadow = ''; }, 1500);
                return;
            }
            const resultado = detectarDiagnostico(texto);
            localStorage.setItem('reparify_diagnostico', JSON.stringify({
                descripcionUsuario: texto,
                resultado,
                fecha: new Date().toISOString()
            }));
            window.location.href = './resultadoDiagnostico.html';
        };

        btn.addEventListener('click', enviar);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') enviar(); });
    }
});