// Función de guardado
function guardarProgresoFill() {
    const progreso = {
        jugado: true,
        completado: preguntaActual >= PREGUNTAS.length && vidas > 0,
        sinVidas: vidas <= 0,
        avance: puntaje, // Aciertos
        vidasPerdidas: 3 - vidas,
        vidasRestantes: vidas
    };
    localStorage.setItem('amphiq_fill', JSON.stringify(progreso));
}

const PREGUNTAS = [
    { 
        oracion: 'The cat drinks _____ every morning.', 
        respuesta: 'MILK', 
        opciones: ['MILK','MUSIC','CHAIR','STONE'], 
        pista: '😺 Cats love this white drink!',
        explicacion: 'En inglés, "Milk" es un sustantivo incontable. No decimos "one milk", sino "some milk" o "a glass of milk".'
    },
    { 
        oracion: 'She reads a good _____ before sleeping.', 
        respuesta: 'BOOK', 
        opciones: ['BOOK','RAIN','PLATE','SMILE'],  
        pista: '📚 You find it at the library.',
        explicacion: '"Book" es el objeto directo aquí. Como consejo: cuando veas "read", piensa en un libro.'
    },
    { 
        oracion: 'The sky is _____ on a sunny day.', 
        respuesta: 'BLUE', 
        opciones: ['BLUE','HEAVY','ROUND','SOFT'],  
        pista: '☀️ Look up on a clear day.',
        explicacion: '"Blue" es un adjetivo. En desarrollo web, puedes usar el nombre del color o su código hexadecimal como #0000FF.'
    },
    { 
        oracion: 'I use a _____ to clean my teeth.', 
        respuesta: 'TOOTHBRUSH', 
        opciones: ['TOOTHBRUSH','CLOCK','CLOUD','CHAIR'],
        pista: '🪥 It works with toothpaste.',
        explicacion: '"Brush" funciona como sustantivo (cepillo) y como verbo (cepillar). ¡Es una palabra de doble propósito!'
    },
    { 
        oracion: 'We need _____ to make bread.', 
        respuesta: 'FLOUR', 
        opciones: ['FLOUR','MUSIC','SLEEP','LAUGH'],
        pista: '🌾 It comes from wheat.',
        explicacion: '¡Ojo! "Flour" (harina) se pronuncia igual que "Flower" (flor). Se les llama palabras homófonas.'
    },
    { 
        oracion: 'The dog wags its _____ when happy.', 
        respuesta: 'TAIL', 
        opciones: ['TAIL','WALL','DOOR','LAMP'],   
        pista: '🐕 It is at the back of the body.',
        explicacion: '"Tail" es cola. En informática, el comando "tail" se usa para ver las últimas líneas de un archivo de log.'
    },
    { 
        oracion: 'Please open the _____ to come inside.', 
        respuesta: 'DOOR', 
        opciones: ['DOOR','CLOUD','RIVER','STONE'],
        pista: '🚪 You knock on it first.',
        explicacion: '"Door" es la entrada física. En redes, usamos el término "Gateway" (puerta de enlace) para salir a Internet.'
    },
    { 
        oracion: 'She wore a warm _____ in winter.', 
        respuesta: 'COAT', 
        opciones: ['COAT','APPLE','CAKE','FORK'],    
        pista: '🧥 It protects you from the cold.',
        explicacion: '"Coat" es abrigo. También se usa en "Sugar-coat" cuando alguien intenta decir una mala noticia de forma amable.'
    },
    { 
        oracion: 'I write with a _____ on paper.', 
        respuesta: 'PEN', 
        opciones: ['PEN','FISH','STAR','MOON'],     
        pista: '🖊️ It has ink inside.',
        explicacion: 'Si sabes que "lapiz" es "pencil" en inglés, puedes asociar "pen" (Pencil más corto) con una pluma que tiene tinta.'
    },
    { 
        oracion: 'The _____ shines at night.', 
        respuesta: 'MOON', 
        opciones: ['MOON','SUN','BIRD','ROAD'],    
        pista: '🌙 It has different phases.',
        explicacion: 'Usamos "The Moon" con el artículo definido porque solo hay una luna terrestre (es un sustantivo único).'
    }
];

let preguntaActual = 0, vidas = 3, puntaje = 0, respondida = false;

function mezclar(arr) { return arr.slice().sort(() => Math.random() - .5); }

function renderPregunta() {
    const q = PREGUNTAS[preguntaActual];
    const total = PREGUNTAS.length;

    document.getElementById('q-numero').textContent = `Pregunta ${preguntaActual + 1} de ${total}`;
    document.getElementById('count-pregunta').textContent = `${preguntaActual + 1} / ${total}`;
    document.getElementById('q-oracion').innerHTML =
        q.oracion.replace('_____', '<span class="blank" id="blank">______</span>');

    const fb = document.getElementById('feedback');
    fb.textContent = ''; fb.className = 'feedback';

    const btn = document.getElementById('btn-siguiente');
    btn.disabled = true;
    btn.innerHTML = preguntaActual === total - 1
        ? 'Finalizar <i class="bi bi-check-lg"></i>'
        : 'Siguiente <i class="bi bi-arrow-right"></i>';

    respondida = false;

    const contenedor = document.getElementById('opciones');
    contenedor.innerHTML = '';
    mezclar(q.opciones).forEach(op => {
        const b = document.createElement('button');
        b.className = 'opcion';
        b.textContent = op;
        b.addEventListener('click', () => elegir(op, b));
        contenedor.appendChild(b);
    });

    const pct = Math.round(preguntaActual / total * 100);
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('progress-pct').textContent = pct + '%';
}

function elegir(opcion, botonElegido) {
    if (respondida || vidas <= 0) return;
    respondida = true;

    const q = PREGUNTAS[preguntaActual];
    const fb = document.getElementById('feedback');
    const blank = document.getElementById('blank');
    
    document.querySelectorAll('.opcion').forEach(b => b.disabled = true);

    const esCorrecto = (opcion === q.respuesta);

    if (esCorrecto) {
        botonElegido.classList.add('correcta');
        puntaje++;
        guardarProgresoFill();
        document.getElementById('count-puntaje').textContent = puntaje;
        confetti({ particleCount: 25, spread: 40, origin: { y: 0.7 }, colors: ['#8aab8e', '#2d5c34'] });
    } else {
        botonElegido.classList.add('incorrecta');
        document.querySelectorAll('.opcion').forEach(b => {
            if (b.textContent === q.respuesta) b.classList.add('correcta');
        });
        vidas--;
        guardarProgresoFill();
        document.getElementById('vidas-restantes').textContent = '❤️'.repeat(Math.max(0, vidas)) || '💔';
    }

    if (blank) { 
        blank.textContent = q.respuesta; 
        blank.classList.add('correcto'); 
    }

    // Un solo bloque de feedback para evitar errores de sobreescritura
    fb.innerHTML = `
        <div class="feedback-content">
            <span class="status-text">${esCorrecto ? '✓ ¡Correcto!' : '✗ Incorrecto. Era ' + q.respuesta}</span>
            <p class="explanation-text">${q.explicacion}</p>
        </div>
    `;
    fb.className = `feedback ${esCorrecto ? 'ok' : 'no'}`;

    if (!esCorrecto && vidas <= 0) {
        setTimeout(() => finalizarJuego(false), 900);
    } else {
        document.getElementById('btn-siguiente').disabled = false;
    }
}

function siguientePregunta() {
    preguntaActual++;
    if (preguntaActual >= PREGUNTAS.length) finalizarJuego(true);
    else renderPregunta();
}

function finalizarJuego(completado) {
    guardarProgresoFill();
    if (completado) {
        document.getElementById('progress-fill').style.width = '100%';
        document.getElementById('progress-pct').textContent = '100%';
        const fin = Date.now() + 4500;
        (function frame() {
            confetti({ particleCount: 3, angle: 60,  spread: 55, origin: { x: 0 }, colors: ['#2ecc71','#f1c40f','#3498db'] });
            confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#2ecc71','#f1c40f','#3498db'] });
            if (Date.now() < fin) requestAnimationFrame(frame);
        })();
    }
    const overlay = document.createElement('div');
    overlay.className = 'overlay-mensaje';
    overlay.innerHTML = `
        <div class="overlay-card">
            <h2>${completado ? '¡Completado! 🎉' : '¡Sin vidas! 💀'}</h2>
            <div class="score-badge">${puntaje} / ${PREGUNTAS.length}</div>
            <p>${completado
                ? `Respondiste correctamente <strong>${puntaje}</strong> de <strong>${PREGUNTAS.length}</strong> preguntas.`
                : `Respondiste <strong>${puntaje}</strong> correctamente antes de quedarte sin vidas.`}</p>
            <div class="overlay-btns">
                <button class="boton-reiniciar" onclick="location.reload()">¿Otra vez?</button>
                <a class="boton-inicio" href="../WasWere/index.html "> Siguiente minijuego</a>
                <a class="boton-inicio" href="../../index.html">← Volver al inicio</a>
            </div>
        </div>`;
    document.body.appendChild(overlay);
}

renderPregunta();