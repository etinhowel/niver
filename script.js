// === ELEMENTOS ===
const target = document.getElementById('target');
const gameArea = document.getElementById('game-area');
const crosshair = document.getElementById('crosshair');

let gameOver = false;

// === SONS ===
const shotSound = new Audio('shot.mp3');
const hitSound = new Audio('hit.mp3');
const missSound = new Audio('erro.mp3');

// === MIRA EM CIMA DO MOUSE ===
document.addEventListener('mousemove', (e) => {
  crosshair.style.left = `${e.clientX}px`;
  crosshair.style.top = `${e.clientY}px`;
});

// === CLIQUE PARA ATIRAR ===
gameArea.addEventListener('click', (event) => {
  if (gameOver) return;

  shotSound.currentTime = 0;
  shotSound.play();

  crosshair.classList.add('shoot');
  setTimeout(() => crosshair.classList.remove('shoot'), 100);

  const clickX = event.clientX;
  const clickY = event.clientY;

  const rect = target.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const distance = Math.hypot(clickX - centerX, clickY - centerY);

  if (distance < rect.width / 2) {
    hitTarget();
  } else {
    missTarget();
  }
});

// === FUNÇÃO QUANDO ACERTA O ALVO ===
function hitTarget() {
  gameOver = true;
  document.body.classList.add('flash');

  hitSound.currentTime = 0;
  hitSound.play();

  setTimeout(() => {
    // === OVERLAY DO VÍDEO PRINCIPAL (fim.mp4) ===
    const videoOverlay = document.createElement('div');
    Object.assign(videoOverlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      background: 'black',
      zIndex: '9999',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    });

    const video = document.createElement('video');
    Object.assign(video.style, {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
      display: 'block',
    });
    video.autoplay = true;
    video.controls = true;

    const source = document.createElement('source');
    source.src = 'fim.mp4';
    source.type = 'video/mp4';
    video.appendChild(source);

    videoOverlay.appendChild(video);
    document.body.appendChild(videoOverlay);

    video.addEventListener('ended', () => {
      videoOverlay.remove();

      // === CARD CENTRALIZADO SEM FULLSCREEN ===
      const cardOverlay = document.createElement('div');
      Object.assign(cardOverlay.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '400px',
        background: 'linear-gradient(135deg, #000 0%, #111 100%)',
        padding: '15px',
        borderRadius: '16px',
        boxShadow: '0 0 30px #00ffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px',
        zIndex: '10000',
        color: '#fff',
        textAlign: 'center',
        fontFamily: '"Orbitron", sans-serif'
      });

      // === VÍDEO PEQUENO DO CARD ===
      const cardVideo = document.createElement('video');
      cardVideo.src = 'card.mp4';
      cardVideo.autoplay = true;
      cardVideo.loop = true;
      cardVideo.muted = true;
      cardVideo.playsInline = true;
      cardVideo.controls = false;
      cardVideo.style.width = '100%';
      cardVideo.style.maxWidth = '180px';
      cardVideo.style.height = 'auto';
      cardVideo.style.borderRadius = '12px';
      cardOverlay.style.boxShadow = '0 0 9px #fafafaff';

      cardVideo.style.objectFit = 'contain';
      cardVideo.style.display = 'block';

      const text = document.createElement('h2');
      text.textContent = 'Você desbloqueou seu cartão misterioso.';

      const button = document.createElement('button');
      button.textContent = 'Abrir Cartão';
      Object.assign(button.style, {
        background: '#00ffff',
        border: 'none',
        padding: '12px 25px',
        borderRadius: '10px',
        fontWeight: 'bold',
        color: '#000',
        cursor: 'pointer',
        transition: '0.3s',
      });
      button.onmouseover = () => (button.style.background = '#00ffaa');
      button.onmouseout = () => (button.style.background = '#00ffff');
      button.addEventListener('click', () => {
        window.location.href = 'cartao.html';
      });

      cardOverlay.appendChild(cardVideo);
      cardOverlay.appendChild(text);
      cardOverlay.appendChild(button);
      document.body.appendChild(cardOverlay);
    });
  }, 1500);
}

// === FUNÇÃO QUANDO ERRAR ===
function missTarget() {
  missSound.currentTime = 0;
  missSound.play();
}
