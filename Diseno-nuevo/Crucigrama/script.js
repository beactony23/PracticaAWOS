const crosswordData = {
    horizontales: {
        1: { f: 0, c: 1, p: "TRANSACCION", d: "Operaciones como unidad (ACID)." },
        4: { f: 6, c: 0, p: "PRIMARYKEY", d: "Identificador único de registro." },
        5: { f: 8, c: 4, p: "VIEW", d: "Consulta como tabla virtual." },
        7: { f: 10, c: 2, p: "JOIN", d: "Combina registros de varias tablas." }
    },
    verticales: {
        2: { f: 0, c: 8, p: "CRUD", d: "Create, Read, Update, Delete." },
        3: { f: 4, c: 5, p: "FOREIGNKEY", d: "Referencia a clave primaria externa." },
        6: { f: 8, c: 7, p: "WHERE", d: "Filtrar resultados con condiciones." }
    }
};

const ROWS = 15;
const COLS = 12;
let userMatrix = Array(ROWS).fill().map(() => Array(COLS).fill(''));

function initGame() {
    renderBoard();
    renderClues();
    updateProgress();

    document.getElementById('verificarBtn').onclick = verificarTodo;
    document.getElementById('reiniciarBtn').onclick = reiniciar;
}

function renderBoard() {
    const wrapper = document.getElementById('crossword-wrapper');
    let tableHtml = '<table>';
    for (let f = 0; f < ROWS; f++) {
        tableHtml += '<tr>';
        for (let c = 0; c < COLS; c++) {
            const letter = getCorrectLetter(f, c);
            if (letter) {
                const num = getStartNumber(f, c);
                tableHtml += `<td class="active" id="cell-${f}-${c}">
                    ${num ? `<span class="numero">${num}</span>` : ''}
                    <input type="text" maxlength="1" id="input-${f}-${c}"
                           oninput="handleInput(this, ${f}, ${c})"
                           autocomplete="off" autocorrect="off" spellcheck="false">
                </td>`;
            } else {
                tableHtml += '<td class="empty"></td>';
            }
        }
        tableHtml += '</tr>';
    }
    wrapper.innerHTML = tableHtml + '</table>';
}

function handleInput(input, f, c) {
    userMatrix[f][c] = input.value.toUpperCase();
    validateRealTime(f, c);
    updateProgress();
}

function validateRealTime(f, c) {
    const cell = document.getElementById(`cell-${f}-${c}`);
    if (userMatrix[f][c] === getCorrectLetter(f, c) && userMatrix[f][c] !== "") {
        cell.classList.add('correct');
    } else {
        cell.classList.remove('correct');
    }
}

function getCorrectLetter(f, c) {
    for (const type in crosswordData) {
        for (const id in crosswordData[type]) {
            const w = crosswordData[type][id];
            for (let i = 0; i < w.p.length; i++) {
                const currF = w.f + (type === 'verticales' ? i : 0);
                const currC = w.c + (type === 'horizontales' ? i : 0);
                if (currF === f && currC === c) return w.p[i];
            }
        }
    }
    return null;
}

function getStartNumber(f, c) {
    for (const type in crosswordData) {
        for (const id in crosswordData[type]) {
            if (crosswordData[type][id].f === f && crosswordData[type][id].c === c) return id;
        }
    }
    return null;
}

function renderClues() {
    const hList = document.getElementById('horizontales-list');
    const vList = document.getElementById('verticales-list');
    hList.innerHTML = "";
    vList.innerHTML = "";

    Object.entries(crosswordData.horizontales).forEach(([num, data]) => {
        hList.innerHTML += `
            <div class="clue-item">
                <span><strong>${num}.</strong> ${data.d}</span>
                <button class="btn-hint" onclick="revelarPalabra(${num}, 'horizontales')" title="Revelar palabra">💡</button>
            </div>`;
    });

    Object.entries(crosswordData.verticales).forEach(([num, data]) => {
        vList.innerHTML += `
            <div class="clue-item">
                <span><strong>${num}.</strong> ${data.d}</span>
                <button class="btn-hint" onclick="revelarPalabra(${num}, 'verticales')" title="Revelar palabra">💡</button>
            </div>`;
    });
}

function updateProgress() {
    let completedWords = 0;
    const horiz = crosswordData.horizontales;
    const vert  = crosswordData.verticales;
    const totalWords = Object.keys(horiz).length + Object.keys(vert).length;

    for (const id in horiz) {
        let word = horiz[id], correct = true;
        for (let i = 0; i < word.p.length; i++) {
            if (userMatrix[word.f][word.c + i] !== word.p[i]) { correct = false; break; }
        }
        if (correct) completedWords++;
    }

    for (const id in vert) {
        let word = vert[id], correct = true;
        for (let i = 0; i < word.p.length; i++) {
            if (userMatrix[word.f + i][word.c] !== word.p[i]) { correct = false; break; }
        }
        if (correct) completedWords++;
    }

    document.getElementById('completadas').innerText = completedWords;
    document.getElementById('progressBar').style.width = `${(completedWords / totalWords) * 100}%`;

    if (completedWords === totalWords && totalWords > 0) {
        const btnNext = document.getElementById('nextGameBtn');
        if (btnNext.style.display !== 'block') {
            btnNext.style.display = 'block';
            lanzarConfeti();
        }
    }
}

function verificarTodo() {
    for (let f = 0; f < ROWS; f++) {
        for (let c = 0; c < COLS; c++) {
            const correct = getCorrectLetter(f, c);
            if (correct) {
                userMatrix[f][c] = correct;
                const input = document.getElementById(`input-${f}-${c}`);
                if (input) { input.value = correct; validateRealTime(f, c); }
            }
        }
    }
    updateProgress();
}

function revelarPalabra(id, tipo) {
    const word = crosswordData[tipo][id];
    for (let i = 0; i < word.p.length; i++) {
        let f = word.f + (tipo === 'verticales' ? i : 0);
        let c = word.c + (tipo === 'horizontales' ? i : 0);
        userMatrix[f][c] = word.p[i];
        const input = document.getElementById(`input-${f}-${c}`);
        if (input) { input.value = word.p[i]; validateRealTime(f, c); }
    }
    updateProgress();
}

function lanzarConfeti() {
    if (typeof confetti === 'undefined') return;
    const end = Date.now() + 3000;
    const colors = ['#2d5c34', '#5c8c62', '#b4cdb7', '#f0b429', '#ffffff'];
    (function frame() {
        confetti({ particleCount: 5, angle: 60,  spread: 55, origin: { x: 0 }, colors });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}

function reiniciar() { location.reload(); }

document.addEventListener('DOMContentLoaded', initGame);