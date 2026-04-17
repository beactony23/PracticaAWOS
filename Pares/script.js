const pairs = [
    { id: 1, val: "Need" }, { id: 1, val: "Necesito" },
    { id: 2, val: "tell you" }, { id: 2, val: "Decirtelo" },
    { id: 3, val: "What" }, { id: 3, val: "Que" },
    { id: 4, val: "Do you know" }, { id: 4, val: "Tu sepas" }
];

let selectedCards = [];
let score = 0;
let tries = 0;

const grid = document.getElementById('game-grid');
const scoreDisplay = document.getElementById('score');
const triesDisplay = document.getElementById('tries');
const resetBtn = document.getElementById('reset-btn');

function init() {
    grid.innerHTML = '';
    pairs.sort(() => Math.random() - 0.5);
    pairs.forEach(item => {
        const div = document.createElement('div');
        div.className = 'tile';
        div.textContent = item.val;
        div.dataset.id = item.id;
        div.onclick = () => handleSelect(div);
        grid.appendChild(div);
    });
}

function handleSelect(el) {
    if (selectedCards.length === 2 || el.classList.contains('active-tile')) return;

    el.classList.add('active-tile');
    selectedCards.push(el);

    if (selectedCards.length === 2) {
        tries++;
        triesDisplay.textContent = tries;
        checkMatch();
    }
}

function checkMatch() {
    const [c1, c2] = selectedCards;
    const match = c1.dataset.id === c2.dataset.id;

    if (match) {
        score++;
        scoreDisplay.textContent = score;
        setTimeout(() => {
            c1.classList.add('matched-tile');
            c2.classList.add('matched-tile');
            selectedCards = [];
        }, 500);
    } else {
        c1.classList.add('wrong-tile');
        c2.classList.add('wrong-tile');
        setTimeout(() => {
            c1.classList.remove('active-tile', 'wrong-tile');
            c2.classList.remove('active-tile', 'wrong-tile');
            selectedCards = [];
        }, 800);
    }
}

resetBtn.onclick = () => {
    score = 0;
    tries = 0;
    scoreDisplay.textContent = 0;
    triesDisplay.textContent = 0;
    init();
};

init();