const target = document.getElementById('target');
const gameArea = document.getElementById('game-area');
const message = document.getElementById('message');
const retryBtn = document.getElementById('retry');
const crosshair = document.getElementById('crosshair');


let gameOver = false;

// === sons===
const shotSound = new Audio('shot.mp3');
const hitSound = new Audio('hit.mp3');
const missSound = new Audio('erro.mp3');

// === correção bug da mouse ===
if (crosshair.parentElement !== document.body) {
  document.body.appendChild(crosshair);
}
Object.assign(crosshair.style, {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: '2147483647', 
});

// === "mira"em cima do mouse ===
document.addEventListener('mousemove', (e) => {
  crosshair.style.left = `${e.clientX}px`;
  crosshair.style.top = `${e.clientY}px`;
});

// === clique para atirar ===
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

// === acertou o alvo ===
function hitTarget() {
  gameOver = true;
  document.body.classList.add('flash');

  hitSound.currentTime = 0;
  hitSound.play();

  setTimeout(() => {
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

    // Cria o vídeo centralizado e responsivo
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

    // === Quando o vídeo terminar ===
    video.addEventListener('ended', () => {
      // Remove o vídeo
      videoOverlay.remove();

      // Cria o "cartão presente"
      const cardOverlay = document.createElement('div');
      Object.assign(cardOverlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #000 0%, #111 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        zIndex: '10000',
        color: '#fff',
        textAlign: 'center',
        fontFamily: '"Orbitron", sans-serif'
      });

// === Cartão em vídeo pequeno ===
const cardVideo = document.createElement('video');
Object.assign(cardVideo.style, {
  width: '180px',            // tamanho reduzido para não atrapalhar o botão
  height: 'auto',
  borderRadius: '16px',
  boxShadow: '0 0 20px #00ffff',
  objectFit: 'contain',      // mantém proporção original
  display: 'block',
  marginBottom: '10px',      // espaçamento entre vídeo e botão/texto
});
cardVideo.autoplay = true;
cardVideo.loop = true;        
cardVideo.muted = true;       
cardVideo.controls = false;  

const cardSource = document.createElement('source');
cardSource.src = 'card.mp4'; 
cardSource.type = 'video/mp4';
cardVideo.appendChild(cardSource);


      // Mensagem
      const text = document.createElement('h2');
      text.textContent = 'Você desbloqueou seu cartão misterioso.';

      // Botão para avançar
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

      // Ao clicar, vai para outra página (você cria depois)
      button.addEventListener('click', () => {
        window.location.href = 'cartao.html'; // troque pelo nome da sua próxima tela
      });

      cardOverlay.appendChild(cardVideo);
      cardOverlay.appendChild(text);
      cardOverlay.appendChild(button);
      document.body.appendChild(cardOverlay);
    });

    videoOverlay.appendChild(video);
    document.body.appendChild(videoOverlay);
  }, 1500);
}
