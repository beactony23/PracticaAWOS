function guardarProgresoMemory() {
    const progreso = {
        jugado: true,
        completado: parejasEncontradas === total,
        sinVidas: vidas <= 0,
        avance: parejasEncontradas,
        vidasPerdidas: 8 - vidas,
        vidasRestantes: vidas
    };
    localStorage.setItem('amphiq_memory', JSON.stringify(progreso));
}

const PARES = [
    { emoji: '🍎', palabra: 'APPLE'  },
    { emoji: '🏠', palabra: 'HOUSE'  },
    { emoji: '💧', palabra: 'WATER'  },
    { emoji: '📚', palabra: 'BOOKS'  },
    { emoji: '🎵', palabra: 'MUSIC'  },
    { emoji: '🌙', palabra: 'NIGHT'  },
    { emoji: '🌿', palabra: 'GREEN'  },
    { emoji: '😊', palabra: 'SMILE'  }
];

let vidas = 8;
let parejasEncontradas = 0;
let intentos = 0;
let cartasVolteadas = [];
let bloqueado = false;
const total = PARES.length;

function mezclar(arr) { return arr.sort(() => Math.random() - .5); }

function construirTablero() {
    const items = [];
    PARES.forEach(par => {
        items.push({ tipo: 'emoji',   valor: par.emoji,   clave: par.palabra });
        items.push({ tipo: 'palabra', valor: par.palabra, clave: par.palabra });
    });
    mezclar(items);

    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';

    items.forEach((item, idx) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.clave = item.clave;
        card.dataset.idx = idx;
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-back">
                    <span class="card-back-inner">?</span>
                </div>
                <div class="card-face card-front">
                    ${item.tipo === 'emoji'
                        ? `<span class="emoji">${item.valor}</span>`
                        : `<span class="word">${item.valor}</span>`}
                </div>
            </div>`;
        card.addEventListener('click', () => voltear(card));
        grid.appendChild(card);
    });
}

function voltear(card) {
    if (bloqueado || card.classList.contains('flipped') ||
        card.classList.contains('matched') || vidas <= 0) return;

    card.classList.add('flipped');
    cartasVolteadas.push(card);

    if (cartasVolteadas.length === 2) {
        intentos++;
        document.getElementById('count-intentos').textContent = intentos;
        bloqueado = true;
        setTimeout(verificar, 800);
    }
}

function verificar() {
    const [a, b] = cartasVolteadas;

    if (a.dataset.clave === b.dataset.clave && a !== b) {
        a.classList.add('matched');
        b.classList.add('matched');
        parejasEncontradas++;

        const pct = Math.round(parejasEncontradas / total * 100);
        document.getElementById('count-parejas').textContent = `${parejasEncontradas} / ${total}`;
        document.getElementById('progress-fill').style.width = pct + '%';
        document.getElementById('progress-pct').textContent = pct + '%';

        if (parejasEncontradas === total) setTimeout(victoria, 500);
    } else {
        vidas--;
        guardarProgresoMemory();
        document.getElementById('vidas-restantes').textContent =
            '❤️'.repeat(Math.max(0, vidas)) || '💔';
        a.classList.add('wrong');
        b.classList.add('wrong');
        setTimeout(() => {
            a.classList.remove('flipped', 'wrong');
            b.classList.remove('flipped', 'wrong');
            if (vidas <= 0) setTimeout(() => finalizarJuego(false), 300);
        }, 650);
    }

    cartasVolteadas = [];
    bloqueado = false;
}

function victoria() {
    const fin = Date.now() + 4500;
    (function frame() {
        confetti({ particleCount: 3, angle: 60,  spread: 55, origin: { x: 0 }, colors: ['#2ecc71','#f1c40f','#3498db'] });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#2ecc71','#f1c40f','#3498db'] });
        if (Date.now() < fin) requestAnimationFrame(frame);
        else finalizarJuego(true);
    })();
}

function finalizarJuego(ganaste) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay-mensaje';
    overlay.innerHTML = `
        <div class="overlay-card">
            <h2>${ganaste ? '¡Ganaste! 🏆' : '¡Sin vidas! 💀'}</h2>
            <p>${ganaste
                ? `Encontraste todas las parejas en <strong>${intentos}</strong> intentos. ¡Excelente memoria!`
                : 'Te quedaste sin vidas. ¡Inténtalo de nuevo!'}</p>
            <div class="overlay-btns" style="display: flex; flex-direction: column; gap: 10px; align-items: center;">
                
                ${ganaste ? `
                    <button class="boton-siguiente" onclick="window.location.href='../fill-in-blank/fill-in-blank.html'" 
                        style="background: var(--forest); color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 600; cursor: pointer; width: 100%;">
                        Siguiente Minijuego
                    </button>
                ` : ''}

                <button class="boton-reiniciar" onclick="location.reload()" style="width: 100%;">¿Otra vez?</button>
                
                <a class="boton-inicio" href="../../index.html" style="text-decoration: none; color: var(--muted); font-size: 0.9em; margin-top: 5px;">
                    ← Volver al inicio
                </a>
            </div>
        </div>`;
    document.body.appendChild(overlay);
}

construirTablero();
guardarProgresoMemory();