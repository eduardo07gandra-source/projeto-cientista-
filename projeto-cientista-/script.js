// ==================== METRÔNOMO ====================
let metronomoInterval = null;
let isMetronomoRunning = false;
let bpm = 120;

function abrirMetronomo() {
    document.getElementById('metronomoModal').style.display = 'flex';
    updateBPM();
}

function fecharMetronomo() {
    stopMetronomo();
    document.getElementById('metronomoModal').style.display = 'none';
}

function updateBPM() {
    bpm = parseInt(document.getElementById('bpmSlider').value);
    document.getElementById('bpmDisplay').textContent = bpm;
}

function changeBPM(delta) {
    bpm = Math.max(40, Math.min(200, bpm + delta));
    document.getElementById('bpmSlider').value = bpm;
    document.getElementById('bpmDisplay').textContent = bpm;
}

function toggleMetronomo() {
    if (isMetronomoRunning) {
        stopMetronomo();
    } else {
        startMetronomo();
    }
}

function startMetronomo() {
    isMetronomoRunning = true;
    document.getElementById('metronomoBtn').textContent = "⏹ Parar Metrônomo";
    document.getElementById('metronomoBtn').style.background = "#ff0066";

    const interval = 60000 / bpm;
    metronomoInterval = setInterval(playClick, interval);
}

function stopMetronomo() {
    isMetronomoRunning = false;
    clearInterval(metronomoInterval);
    document.getElementById('metronomoBtn').textContent = "▶ Iniciar Metrônomo";
    document.getElementById('metronomoBtn').style.background = "";
}

function playClick() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.05);
}

// ==================== CHAT IA (mantido) ====================
function abrirChatIA() {
    const modal = document.getElementById('chatModal');
    modal.style.display = 'flex';
    document.getElementById('chatMessages').innerHTML = '';
    adicionarMensagemIA("Olá! 👋 Como posso te ajudar com violão hoje?");
}

function fecharChat() { document.getElementById('chatModal').style.display = 'none'; }

function adicionarMensagem(texto, tipo) {
    const chat = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `message ${tipo}`;
    div.textContent = texto;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function adicionarMensagemIA(texto) { adicionarMensagem(texto, 'ia'); }

function enviarMensagem() {
    const input = document.getElementById('chatInput');
    const texto = input.value.trim();
    if (!texto) return;

    adicionarMensagem(texto, 'user');
    input.value = "";

    setTimeout(() => {
        let resposta = "Me conte mais detalhes!";
        const p = texto.toLowerCase();
        if (p.includes("fá")) resposta = "Acorde de Fá: dedo 1 (1ª casa corda 2), dedo 2 (2ª casa corda 3), dedo 3 (3ª casa corda 4).";
        adicionarMensagemIA(resposta);
    }, 600);
}