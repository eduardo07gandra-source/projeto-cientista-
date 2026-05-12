// ==================== VARIÁVEIS GLOBAIS ====================
let audioContext;
let analyser;
let microphone;
let animationFrame;
let isTuning = false;
let targetFreq = 82.41;

// ==================== AFINADOR ====================
const noteFrequencies = {
    "E2": 82.41, "A2": 110.00, "D3": 146.83,
    "G3": 196.00, "B3": 246.94, "E4": 329.63
};

function abrirAfinador() {
    document.getElementById('afinadorModal').style.display = 'flex';
    document.getElementById('note').textContent = '—';
    document.getElementById('frequency').textContent = '— Hz';
}

function fecharAfinador() {
    stopTuner();
    document.getElementById('afinadorModal').style.display = 'none';
}

async function toggleTuner() {
    const btn = document.getElementById('startBtn');
    
    if (!isTuning) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } 
            });

            microphone = audioContext.createMediaStreamSource(stream);
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 4096;
            microphone.connect(analyser);

            isTuning = true;
            btn.textContent = "⏹ Parar Afinador";
            detectPitch();
        } catch (err) {
            alert("❌ Não foi possível acessar o microfone.\nPermita o acesso.");
        }
    } else {
        stopTuner();
    }
}

function stopTuner() {
    isTuning = false;
    document.getElementById('startBtn').textContent = "▶ Ativar Microfone";
    if (animationFrame) cancelAnimationFrame(animationFrame);
}

function setTargetNote(note) {
    targetFreq = noteFrequencies[note];
}

// Detecção de pitch
function detectPitch() {
    if (!isTuning || !analyser) return;

    const buffer = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buffer);

    const pitch = autoCorrelate(buffer, audioContext.sampleRate);

    if (pitch > 70 && pitch < 1200) {
        const noteName = getClosestNote(pitch);
        const cents = Math.round(1200 * Math.log2(pitch / targetFreq));

        document.getElementById('note').textContent = noteName;
        document.getElementById('frequency').textContent = Math.round(pitch) + " Hz";
    }

    animationFrame = requestAnimationFrame(detectPitch);
}

function autoCorrelate(buffer, sampleRate) {
    let rms = 0;
    for (let i = 0; i < buffer.length; i++) rms += buffer[i] * buffer[i];
    rms = Math.sqrt(rms / buffer.length);
    if (rms < 0.02) return -1;

    let maxCorrelation = 0;
    let bestLag = 0;

    for (let lag = 20; lag < buffer.length / 2; lag++) {
        let correlation = 0;
        for (let i = 0; i < buffer.length - lag; i++) {
            correlation += buffer[i] * buffer[i + lag];
        }
        if (correlation > maxCorrelation) {
            maxCorrelation = correlation;
            bestLag = lag;
        }
    }
    return bestLag > 0 ? sampleRate / bestLag : -1;
}

function getClosestNote(freq) {
    let closest = "—";
    let minDiff = Infinity;
    for (let note in noteFrequencies) {
        const diff = Math.abs(freq - noteFrequencies[note]);
        if (diff < minDiff) {
            minDiff = diff;
            closest = note;
        }
    }
    return closest;
}

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

function toggleMetronomo() {
    if (isMetronomoRunning) stopMetronomo();
    else startMetronomo();
}

function startMetronomo() {
    isMetronomoRunning = true;
    const btn = document.getElementById('metronomoBtn');
    btn.textContent = "⏹ Parar";
    btn.style.background = "#ff3366";

    playTick();
    metronomoInterval = setInterval(playTick, 60000 / bpm);
}

function stopMetronomo() {
    isMetronomoRunning = false;
    clearInterval(metronomoInterval);
    const btn = document.getElementById('metronomoBtn');
    btn.textContent = "▶ Iniciar";
    btn.style.background = "";
}

function playTick() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.setValueAtTime(1000, ctx.currentTime);
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
}

// ==================== CHAT IA ====================
function abrirChatIA() {
    const modal = document.getElementById('chatModal');
    modal.style.display = 'flex';
    const chat = document.getElementById('chatMessages');
    chat.innerHTML = '<div class="message ia">Olá! 👋 Sou a IA de ajuda do MelodyAI. Como posso te ajudar hoje?</div>';
}

function fecharChat() {
    document.getElementById('chatModal').style.display = 'none';
}

function adicionarMensagem(texto, tipo) {
    const chat = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `message ${tipo}`;
    div.textContent = texto;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function enviarMensagem() {
    const input = document.getElementById('chatInput');
    const texto = input.value.trim();
    if (!texto) return;

    adicionarMensagem(texto, 'user');
    input.value = "";

    setTimeout(() => {
        let resposta = "Entendi! Me conte mais detalhes para eu te ajudar melhor.";
        const p = texto.toLowerCase();

        if (p.includes("fá") || p.includes("f ")) resposta = "Acorde de Fá: dedo 1 na 1ª casa (corda 2), dedo 2 na 2ª casa (corda 3), dedo 3 na 3ª casa (corda 4).";
        else if (p.includes("acorde")) resposta = "Qual acorde você quer aprender?";
        else if (p.includes("ritmo")) resposta = "Qual ritmo você quer praticar?";

        adicionarMensagem(resposta, 'ia');
    }, 700);
}

// ==================== ANÁLISE DE ENSAIO ====================
function fazerAnaliseDemo() {
    const modal = document.getElementById('analiseModal');
    modal.style.display = 'flex';

    document.getElementById('analiseResultado').innerHTML = `
        <h3>🎵 Análise: Bohemian Rhapsody</h3>
        <div class="nota-final">Nota Final: <strong>89/100</strong></div>
        <div class="metricas">
            <p><strong>Afinação:</strong> 94% ✅</p>
            <p><strong>Ritmo:</strong> 81% ⚠️</p>
            <p><strong>Tempo:</strong> 96% ✅</p>
            <p><strong>Precisão Geral:</strong> 88%</p>
        </div>
        <h4>Dicas de Melhoria:</h4>
        <ul>
            <li>✅ Excelente afinação nas harmonias vocais</li>
            <li>⚠️ Melhorar consistência rítmica no refrão</li>
            <li>💡 Praticar o trecho "Mama, just killed a man..." com metrônomo</li>
        </ul>
    `;
}

function fecharAnalise() {
    document.getElementById('analiseModal').style.display = 'none';
}

// ==================== FECHAR MODAIS COM ESC ====================
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
    if (e.key === "Enter") {
        const chatModal = document.getElementById('chatModal');
        if (chatModal.style.display === 'flex') enviarMensagem();
    }
});

console.log("%c🎸 MelodyAI - Protótipo Completo Carregado!", "color: #4a9eff; font-size: 16px;");