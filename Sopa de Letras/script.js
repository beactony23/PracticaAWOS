// --- CONFIGURACIÓN ---
const TAMAÑO = 20;
const VIDAS_INICIALES = 1;
const palabras = ["APPLE", "HOUSE", "WATER", "BREAD", "SMILE", "GREEN", "MUSIC", "NIGHT", "BOOKS", "HAPPY", "TETO"];

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
    const seleccionadas = Array.from(document.querySelectorAll('.celda.seleccionada'))
                               .map(el => el.dataset.coord);

    palabras.forEach(palabra => {
        const coordsPalabra = palabrasUbicacion[palabra];
        const encontrada = coordsPalabra.every(coord => seleccionadas.includes(coord));
        
        const itemLista = document.getElementById(`item-${palabra}`);
        if (encontrada && !itemLista.classList.contains('tachado')) {
            itemLista.classList.add('tachado');
            coordsPalabra.forEach(coord => {
                const celda = document.querySelector(`[data-coord="${coord}"]`);
                celda.classList.add('correcta');
                celda.classList.remove('seleccionada');
            });
            verificarVictoria();
        }
    });
}

function manejarError(celda) {
    if (celda.classList.contains('correcta') || celda.classList.contains('error-letra')) return;
    
    vidas--;
    actualizarVidasUI();
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

function finalizarJuego(victoria) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay-mensaje';
    overlay.innerHTML = `
        <div style="background: white; padding: 40px; border-radius: 15px; color: #333;">
            <h1 style="font-size: 3rem; margin-bottom: 10px;">${victoria ? '¡ERES GENIAL! 🏆' : '¡OH NO! 💀'}</h1>
            <p style="font-size: 1.2rem;">${victoria ? 'Has resuelto la sopa perfectamente.' : 'Te has quedado sin vidas.'}</p>
            <button class="boton-reiniciar" onclick="location.reload()">¿OTRA VEZ?</button>
        </div>
    `;
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

    // Lista de palabras
    listaUl.innerHTML = '';
    palabras.sort().forEach(p => {
        let li = document.createElement('li');
        li.textContent = p;
        li.id = `item-${p}`;
        listaUl.appendChild(li);
    });
}

dibujarSopa();