function guardarEstadoSopa() {
    const encontradas = document.querySelectorAll('#lista-palabras li.tachado').length;
    const total = 12; // Las 12 palabras de tu diccionario
    localStorage.setItem('amphiq_sopa', JSON.stringify({
        jugado: true,
        vidasRestantes: vidas,
        vidasPerdidas: 3 - vidas, // 3 es el total de vidas iniciales
        avance: encontradas,
        completado: encontradas === total,
        sinVidas: vidas <= 0
    }));
}// --- CONFIGURACIÓN ---
const TAMAÑO = 20;
const VIDAS_INICIALES = 3; // Te sugiero subir a 3 para que no sea tan castigador

// Diccionario Inglés - Español
const diccionario = {
    "APPLE": "Manzana",
    "HOUSE": "Casa",
    "WATER": "Agua",
    "BREAD": "Pan",
    "SMILE": "Sonrisa",
    "GREEN": "Verde",
    "MUSIC": "Música",
    "NIGHT": "Noche",
    "BOOKS": "Libros",
    "HAPPY": "Feliz",
};

const palabras = Object.keys(diccionario);

// --- VARIABLES DE ESTADO ---
let vidas = VIDAS_INICIALES;
let matriz = Array(TAMAÑO).fill(null).map(() => Array(TAMAÑO).fill(''));
let palabrasUbicacion = {}; 
const container = document.getElementById('sopa-container');
const listaUl = document.getElementById('lista-palabras');
const vidasSpan = document.getElementById('vidas-restantes');

// --- LÓGICA DE GENERACIÓN ---

function colocarPalabras() {
    palabras.forEach(palabra => {
        let colocada = false;
        let intentos = 0;
        
        while (!colocada && intentos < 150) {
            // 0: Horizontal, 1: Vertical, 2: Diagonal
            const dir = Math.floor(Math.random() * 3);
            let f, c;

            if (dir === 0) { // Horizontal
                f = Math.floor(Math.random() * TAMAÑO);
                c = Math.floor(Math.random() * (TAMAÑO - palabra.length));
            } else if (dir === 1) { // Vertical
                f = Math.floor(Math.random() * (TAMAÑO - palabra.length));
                c = Math.floor(Math.random() * TAMAÑO);
            } else { // Diagonal
                f = Math.floor(Math.random() * (TAMAÑO - palabra.length));
                c = Math.floor(Math.random() * (TAMAÑO - palabra.length));
            }

            if (puedeColocar(palabra, f, c, dir)) {
                let coords = [];
                for (let i = 0; i < palabra.length; i++) {
                    let filaActual = (dir === 1 || dir === 2) ? f + i : f;
                    let colActual = (dir === 0 || dir === 2) ? c + i : c;
                    matriz[filaActual][colActual] = palabra[i];
                    coords.push(`${filaActual}-${colActual}`);
                }
                palabrasUbicacion[palabra] = coords;
                colocada = true;
            }
            intentos++;
        }
    });
}

function puedeColocar(palabra, f, c, dir) {
    for (let i = 0; i < palabra.length; i++) {
        let filaActual = (dir === 1 || dir === 2) ? f + i : f;
        let colActual = (dir === 0 || dir === 2) ? c + i : c;
        const letraExistente = matriz[filaActual][colActual];
        if (letraExistente !== '' && letraExistente !== palabra[i]) return false;
    }
    return true;
}

// --- LÓGICA DEL JUEGO ---

function verificarPalabras() {
    palabras.forEach(palabra => {
        const coords = palabrasUbicacion[palabra];
        const todasSeleccionadas = coords.every(c => {
            const el = document.querySelector(`[data-coord="${c}"]`);
            return el && el.classList.contains('seleccionada');
        });

        if (todasSeleccionadas) {
            const items = document.querySelectorAll('#lista-palabras li');
            items.forEach(li => {
                // Comparamos con el dataset que pusimos en dibujarSopa
                if (li.dataset.word === palabra && !li.classList.contains('tachado')) {
                    const traduccion = diccionario[palabra];
                    li.innerHTML = `${palabra} <span class="translation">(${traduccion})</span>`;
                    li.classList.add('tachado');
                    
                    coords.forEach(c => {
                        document.querySelector(`[data-coord="${c}"]`).classList.add('correcta');
                    });
                }
            });
        }
    });

    const totalTachadas = document.querySelectorAll('#lista-palabras li.tachado').length;
    if (totalTachadas === palabras.length) {
        setTimeout(mostrarVictoria, 500);
    }
}

function manejarError(celda) {
    if (celda.classList.contains('correcta') || celda.classList.contains('error-letra')) return;
    
    vidas--;
    actualizarVidasUI();
    guardarEstadoSopa();
    celda.classList.add('error-letra');
    setTimeout(() => celda.classList.remove('error-letra'), 500);

    if (vidas <= 0) {
        finalizarJuego(false);
    }
}

function actualizarVidasUI() {
    vidasSpan.textContent = '❤️'.repeat(vidas) || '💔';
}

function verificarVictoria() {
    const totalEncontradas = document.querySelectorAll('.tachado').length;
    if (totalEncontradas === palabras.length) {
        celebrar();
    }
}

function celebrar() {
    const duracion = 5 * 1000;
    const fin = Date.now() + duracion;

    (function frame() {
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#2ecc71', '#f1c40f', '#3498db']
        });
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#2ecc71', '#f1c40f', '#3498db']
        });

        if (Date.now() < fin) {
            requestAnimationFrame(frame);
        } else {
            finalizarJuego(true);
        }
    }());
}

function mostrarVictoria() {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#2d5c34', '#8aab8e', '#ddeedd'] });

    const overlay = document.createElement('div');
    overlay.className = 'overlay-victoria';
    overlay.innerHTML = `
        <div class="victoria-card">
            <h2 style="font-family: 'DM Serif Display';">¡Excelente trabajo!</h2>
            <p>Has dominado este vocabulario.</p>
            <div class="d-flex">
                <button class="boton-reiniciar" onclick="location.reload()">Reintentar</button>
                <button class="boton-siguiente" onclick="window.location.href='../Memory Match/memory-match.html'">Siguiente Nivel</button>
            </div>
        </div>
    `;
    celebrar();
    document.body.appendChild(overlay);
}

// --- DIBUJAR TABLERO ---

function dibujarSopa() {
    colocarPalabras();
    container.innerHTML = '';
    actualizarVidasUI();

    for (let f = 0; f < TAMAÑO; f++) {
        for (let c = 0; c < TAMAÑO; c++) {
            const div = document.createElement('div');
            div.className = 'celda';
            div.dataset.coord = `${f}-${c}`;
            div.textContent = matriz[f][c] || String.fromCharCode(65 + Math.floor(Math.random() * 26));

            div.addEventListener('click', function() {
                if (this.classList.contains('correcta') || vidas <= 0) return;
                const coord = this.dataset.coord;
                const esLetraCorrecta = Object.values(palabrasUbicacion).some(coords => coords.includes(coord));
                if (esLetraCorrecta) {
                    this.classList.add('seleccionada');
                    verificarPalabras();
                } else {
                    manejarError(this);
                }
            });
            container.appendChild(div);
        }
    }

    // --- ESTA PARTE ES LA CLAVE ---
    listaUl.innerHTML = '';
    // Las ordenamos alfabéticamente para que se vea ordenado
    palabras.sort().forEach(p => {
        const li = document.createElement('li');
        li.textContent = p;
        li.dataset.word = p; // <--- Sin esto, el juego no sabe qué palabra tachar
        listaUl.appendChild(li);
    });
}

dibujarSopa();