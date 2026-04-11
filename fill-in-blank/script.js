const PREGUNTAS = [
    { oracion: 'The cat drinks _____ every morning.',       respuesta: 'MILK',  opciones: ['MILK','MUSIC','CHAIR','STONE'], pista: '🥛 Cats love this white drink!' },
    { oracion: 'She reads a good _____ before sleeping.',   respuesta: 'BOOK',  opciones: ['BOOK','RAIN','PLATE','SMILE'],  pista: '📚 You find it at the library.' },
    { oracion: 'The sky is _____ on a sunny day.',          respuesta: 'BLUE',  opciones: ['BLUE','HEAVY','ROUND','SOFT'],  pista: '☀️ Look up on a clear day.' },
    { oracion: 'I use a _____ to clean my teeth.',          respuesta: 'BRUSH', opciones: ['BRUSH','CLOCK','CLOUD','CHAIR'],pista: '🪥 It works with toothpaste.' },
    { oracion: 'We need _____ to make bread.',              respuesta: 'FLOUR', opciones: ['FLOUR','MUSIC','SLEEP','LAUGH'],pista: '🌾 It comes from wheat.' },
    { oracion: 'The dog wags its _____ when happy.',        respuesta: 'TAIL',  opciones: ['TAIL','WALL','DOOR','LAMP'],   pista: '🐕 It is at the back of the body.' },
    { oracion: 'Please open the _____ to come inside.',     respuesta: 'DOOR',  opciones: ['DOOR','CLOUD','RIVER','STONE'],pista: '🚪 You knock on it first.' },
    { oracion: 'She wore a warm _____ in winter.',          respuesta: 'COAT',  opciones: ['COAT','FLAME','GLASS','BELL'], pista: '🧥 It keeps you warm outside.' },
    { oracion: 'The sun rises in the _____.',               respuesta: 'EAST',  opciones: ['EAST','SOUTH','WEST','NORTH'], pista: '🌅 Think: morning direction.' },
    { oracion: 'He saved money in his _____ account.',      respuesta: 'BANK',  opciones: ['BANK','PARK','LAKE','FARM'],   pista: '🏦 A financial institution.' }
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
    document.querySelectorAll('.opcion').forEach(b => b.disabled = true);

    const fb    = document.getElementById('feedback');
    const blank = document.getElementById('blank');

    if (opcion === q.respuesta) {
        botonElegido.classList.add('correcta');
        puntaje++;
        document.getElementById('count-puntaje').textContent = puntaje;
        if (blank) { blank.textContent = q.respuesta; blank.classList.add('correcto'); }
        fb.textContent = '✓ ¡Correcto! ' + q.pista;
        fb.className = 'feedback ok';
    } else {
        botonElegido.classList.add('incorrecta');
        document.querySelectorAll('.opcion').forEach(b => {
            if (b.textContent === q.respuesta) b.classList.add('correcta');
        });
        vidas--;
        document.getElementById('vidas-restantes').textContent =
            '❤️'.repeat(Math.max(0, vidas)) || '💔';
        if (blank) { blank.textContent = q.respuesta; blank.classList.add('correcto'); }
        fb.textContent = '✗ Incorrecto. La respuesta es: ' + q.respuesta;
        fb.className = 'feedback no';
        if (vidas <= 0) { setTimeout(() => finalizarJuego(false), 900); return; }
    }

    document.getElementById('btn-siguiente').disabled = false;
}

function siguientePregunta() {
    preguntaActual++;
    if (preguntaActual >= PREGUNTAS.length) finalizarJuego(true);
    else renderPregunta();
}

function finalizarJuego(completado) {
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
                <a class="boton-inicio" href="../index.html">← Volver al inicio</a>
            </div>
        </div>`;
    document.body.appendChild(overlay);
}

renderPregunta();