document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const connectedCount = document.getElementById('connected');
    const totalCount = document.getElementById('total');
    const progressBar = document.getElementById('progressBar');
    const messageDiv = document.getElementById('message');
    const resetBtn = document.getElementById('resetBtn');
    const levelBtns = document.querySelectorAll('.level-btn');

    const levelsData = {
        1: {
            name: "Básico",
            pairs: [
                { en: "SOFTWARE", es: "PROGRAMA", desc: "Instrucciones lógicas que hacen funcionar a la computadora." },
                { en: "HARDWARE", es: "EQUIPO FÍSICO", desc: "Componentes físicos y tangibles de un sistema informático." },
                { en: "NETWORK", es: "RED", desc: "Conjunto de nodos y dispositivos conectados para compartir datos." },
                { en: "SERVER", es: "SERVIDOR", desc: "Equipo que ofrece recursos y servicios a otros nodos (clientes)." },
                { en: "CLOUD", es: "NUBE", desc: "Uso de una red de servidores remotos para procesar y almacenar datos." }
            ]
        },
        2: {
            name: "SQL",
            pairs: [
                { en: "CREATE", es: "CREAR", desc: "Comando para definir nuevas bases de datos, tablas o índices." },
                { en: "DELETE", es: "ELIMINAR", desc: "Elimina uno o más registros existentes en una tabla." },
                { en: "UPDATE", es: "ACTUALIZAR", desc: "Modifica los valores de los datos existentes en una tabla." },
                { en: "SELECT", es: "CONSULTAR / SELECCIONAR", desc: "Recupera datos específicos de una o varias tablas." },
                { en: "INSERT", es: "INSERTAR", desc: "Añade nuevos registros de datos a una tabla." },
                { en: "DROP", es: "ELIMINAR (TABLA)", desc: "Elimina por completo una tabla o base de datos y sus datos." },
                { en: "ALTER", es: "MODIFICAR", desc: "Cambia la estructura de una tabla (como añadir columnas)." },
                { en: "JOIN", es: "COMBINAR / UNIR", desc: "Combina filas de dos o más tablas basándose en una columna común." }
            ]
        },
        3: {
            name: "Avanzado",
            pairs: [
                { en: "DATABASE", es: "BASE DE DATOS", desc: "Sistema organizado para almacenar y gestionar grandes volúmenes de datos." },
                { en: "TRANSACTION", es: "TRANSACCIÓN", desc: "Unidad de trabajo lógica que debe completarse toda o ninguna." },
                { en: "QUERY", es: "CONSULTA", desc: "Solicitud formal de información a una base de datos." },
                { en: "INDEX", es: "ÍNDICE", desc: "Estructura que mejora la velocidad de búsqueda de datos en las tablas." },
                { en: "VIEW", es: "VISTA", desc: "Tabla virtual generada a partir de una consulta SELECT." },
                { en: "TRIGGER", es: "DISPARADOR", desc: "Acción automática que se ejecuta ante un evento (INSERT, UPDATE o DELETE)." },
                { en: "BACKUP", es: "RESPALDO", desc: "Copia de seguridad de los datos para su recuperación en caso de pérdida." },
                { en: "FRAMEWORK", es: "MARCO DE TRABAJO / ENTORNO", desc: "Conjunto de herramientas y reglas predefinidas para desarrollar software." }
            ]
        }
    };

    let currentLevel = 1;
    let selectedCards = [];
    let connectedPairs = 0;
    let levelsCompleted = { 1: false, 2: false, 3: false };

    function loadLevel(level) {
        board.innerHTML = '';
        selectedCards = [];
        connectedPairs = 0;
        const data = levelsData[level];

        let englishCards = data.pairs.map(p => ({ text: p.en, pair: p.es, type: 'en' }));
        let spanishCards = data.pairs.map(p => ({ text: p.es, pair: p.en, type: 'es' }));

        englishCards.sort(() => Math.random() - 0.5);
        spanishCards.sort(() => Math.random() - 0.5);

        const colEn = document.createElement('div');
        colEn.className = 'column';
        const colEs = document.createElement('div');
        colEs.className = 'column';

        englishCards.forEach(item => colEn.appendChild(createCard(item)));
        spanishCards.forEach(item => colEs.appendChild(createCard(item)));

        board.appendChild(colEn);
        board.appendChild(colEs);

        updateStats();
        showMessage(`Nivel ${level}: ${data.name}`, 'info');
    }

    function createCard(item) {
        const card = document.createElement('div');
        card.className = 'card';
        card.textContent = item.text;
        card.dataset.value = item.text;
        card.dataset.pair = item.pair;
        card.onclick = () => selectCard(card);
        return card;
    }

    function selectCard(card) {
        if (card.classList.contains('connected') || selectedCards.includes(card)) return;

        if (selectedCards.length === 1 && selectedCards[0].parentElement === card.parentElement) {
            selectedCards[0].classList.remove('selected');
            selectedCards = [];
        }

        card.classList.add('selected');
        selectedCards.push(card);

        if (selectedCards.length === 2) {
            checkMatch();
        }
    }

    function checkMatch() {
        const [c1, c2] = selectedCards;
        const isMatch = c1.dataset.value === c2.dataset.pair;

        if (isMatch) {
            c1.classList.remove('selected');
            c2.classList.remove('selected');
            c1.classList.add('connected');
            c2.classList.add('connected');
            connectedPairs++;
            updateStats();

            const pairData = levelsData[currentLevel].pairs.find(p =>
                p.en === c1.dataset.value || p.es === c1.dataset.value
            );

            if (connectedPairs === levelsData[currentLevel].pairs.length) {
                levelsCompleted[currentLevel] = true;
                showMessage(`✅ ¡Correcto! ${pairData.desc}`, 'success');
                setTimeout(() => { checkAllLevelsFinished(); }, 1500);
            } else {
                showMessage(`✅ ¡Correcto! ${pairData.desc}`, 'success');
            }
        } else {
            c1.classList.add('wrong');
            c2.classList.add('wrong');
            setTimeout(() => {
                c1.classList.remove('selected', 'wrong');
                c2.classList.remove('selected', 'wrong');
            }, 500);
            showMessage('❌ Intenta de nuevo', 'error');
        }
        selectedCards = [];
    }

    function checkAllLevelsFinished() {
        const allDone = levelsCompleted[1] && levelsCompleted[2] && levelsCompleted[3];
        if (allDone) {
            showVictoryModal(true);
        } else {
            showMessage('🏆 ¡Felicidades! Nivel completado.', 'victory');
        }
    }

    function showVictoryModal(isFinal) {
        let modal = document.getElementById('victory-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'victory-modal';
            modal.className = 'modal-overlay';
            document.body.appendChild(modal);
        }

        const content = isFinal
            ? `<h2>¡Eres un Maestro! 🏆</h2>
               <p>Has completado los 3 niveles de conceptos de TI y SQL.</p>
               <div class="modal-buttons">
                   <button onclick="location.reload()">🔄 Reiniciar Todo</button>
                   <button onclick="window.location.href='../../dashboard/Cursos.php'">← Volver a Cursos</button>
               </div>`
            : `<h2>¡Nivel Completado! 🌟</h2>
               <p>¿Listo para el siguiente reto?</p>
               <div class="modal-buttons">
                   <button onclick="document.getElementById('victory-modal').remove()">Continuar →</button>
               </div>`;

        modal.innerHTML = `<div class="modal-content">${content}</div>`;
        modal.style.display = 'flex';
    }

    function updateStats() {
        const total = levelsData[currentLevel].pairs.length;
        connectedCount.textContent = connectedPairs;
        totalCount.textContent = total;
        const percent = (connectedPairs / total) * 100;
        progressBar.style.width = percent + '%';
    }

    function showMessage(msg, type) {
        messageDiv.textContent = msg;
        messageDiv.className = 'message-box ' + type;
        const duration = type === 'success' ? 4000 : 2500;
        setTimeout(() => {
            if (messageDiv.textContent === msg) {
                messageDiv.className = 'message-box';
            }
        }, duration);
    }

    resetBtn.addEventListener('click', () => loadLevel(currentLevel));

    levelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentLevel = parseInt(btn.dataset.level);
            levelBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadLevel(currentLevel);
        });
    });

    loadLevel(1);
});