(function() {
  // --- DATOS DE LOS ÍTEMS DE LA MARQUESINA (proyectos y habilidades JS) ---
  const itemsData = [
    { icon: "📘", title: "Calculadora JS", detail: "HTML/CSS/JS · Funcional", tech: "DOM" },
    { icon: "🎯", title: "To-Do List App", detail: "LocalStorage · Tareas", tech: "Eventos" },
    { icon: "🌤️", title: "Clima Widget", detail: "Fetch API · JSON", tech: "Asincronía" },
    { icon: "🎨", title: "Editor de Estilos", detail: "Manipulación CSS", tech: "Style DOM" },
    { icon: "📊", title: "Gráficas Dinámicas", detail: "Canvas · Chart.js", tech: "Visual Data" },
    { icon: "🕹️", title: "Mini Juego", detail: "Eventos teclado", tech: "Game Loop" },
    { icon: "🔐", title: "Validador Forms", detail: "Regex · Validación", tech: "Seguridad" },
    { icon: "📂", title: "Explorador Archivos", detail: "Drag & Drop", tech: "File API" },
    { icon: "⚛️", title: "SPA Simulador", detail: "Routing Nativo", tech: "History API" },
    { icon: "💬", title: "Chat Simulado", detail: "WebSocket mock", tech: "Eventos" }
  ];

  // Elementos del DOM
  const marqueeContent = document.getElementById('marqueeContent');
  const trackContainer = document.getElementById('marqueeTrack');
  let animationId = null;
  let currentPosition = 0;
  let isPlaying = true;
  let direction = 1;                 // 1 = derecha (hacia la izquierda visual) / -1 = izquierda
  let speed = 1.8;
  
  let totalWidth = 0;
  let containerWidth = 0;
  
  // Referencias UI
  const playPauseBtn = document.getElementById('playPauseBtn');
  const directionBtn = document.getElementById('directionBtn');
  const speedRange = document.getElementById('speedRange');
  const speedValSpan = document.getElementById('speedVal');
  const directionStatusSpan = document.getElementById('directionStatus');
  
  // Función para generar los elementos HTML a partir de los datos
  function buildMarqueeItems() {
    marqueeContent.innerHTML = '';
    // Creamos los items originales
    itemsData.forEach(item => {
      const div = document.createElement('div');
      div.className = 'marquee-item';
      div.innerHTML = `
        <div class="item-icon">${item.icon}</div>
        <div class="item-title">${item.title}</div>
        <div class="item-detail">
          <span>${item.detail}</span>
          <span class="tech-badge">${item.tech}</span>
        </div>
      `;
      marqueeContent.appendChild(div);
    });
    
    // Clonar los items para lograr efecto infinito
    const originalChildren = Array.from(marqueeContent.children);
    originalChildren.forEach(child => {
      const clone = child.cloneNode(true);
      marqueeContent.appendChild(clone);
    });
    
    // Duplicar otra vez para mayor suavidad
    const currentChildrenCount = marqueeContent.children.length;
    if (currentChildrenCount < 18) {
      const originalSet = Array.from(marqueeContent.children);
      originalSet.forEach(child => {
        const extraClone = child.cloneNode(true);
        marqueeContent.appendChild(extraClone);
      });
    }
    return Array.from(marqueeContent.children);
  }
  
  // Actualizar dimensiones totales
  function updateDimensions() {
    if (!marqueeContent) return;
    let total = 0;
    const children = Array.from(marqueeContent.children);
    if (children.length === 0) return;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const style = window.getComputedStyle(child);
      const marginLeft = parseFloat(style.marginLeft) || 0;
      const marginRight = parseFloat(style.marginRight) || 0;
      const outerWidth = child.offsetWidth + marginLeft + marginRight;
      total += outerWidth;
    }
    totalWidth = total;
    const trackRect = trackContainer.getBoundingClientRect();
    containerWidth = trackRect.width;
  }
  
  // Obtener ancho total de un único set de items original (sin clones)
  function getSingleSetWidth() {
    const allChildren = Array.from(marqueeContent.children);
    const originalCount = itemsData.length;
    if (allChildren.length === 0 || originalCount === 0) return 0;
    let sum = 0;
    for (let i = 0; i < originalCount && i < allChildren.length; i++) {
      const child = allChildren[i];
      const style = window.getComputedStyle(child);
      const marginLeft = parseFloat(style.marginLeft) || 0;
      const marginRight = parseFloat(style.marginRight) || 0;
      sum += child.offsetWidth + marginLeft + marginRight;
    }
    return sum;
  }
  
  // Función para resetear posición de manera inteligente cuando sobrepasa umbral
  function manageInfiniteScroll() {
    if (totalWidth === 0) return;
    const singleSetWidth = getSingleSetWidth();
    if (singleSetWidth === 0) return;
    
    if (direction === 1) {
      if (currentPosition <= -singleSetWidth) {
        currentPosition += singleSetWidth;
        applyTransform();
      } else if (currentPosition > 0) {
        if (direction === 1 && currentPosition > 0) {
          currentPosition -= singleSetWidth;
          applyTransform();
        }
      }
    } else {
      if (currentPosition >= singleSetWidth) {
        currentPosition -= singleSetWidth;
        applyTransform();
      } else if (currentPosition < 0 && (currentPosition + singleSetWidth) < 0) {
        if (currentPosition < -singleSetWidth) {
          currentPosition += singleSetWidth;
          applyTransform();
        }
      }
    }
    
    if (direction === -1 && currentPosition > (singleSetWidth * 0.5)) {
      currentPosition -= singleSetWidth;
      applyTransform();
    }
    if (direction === 1 && currentPosition < -singleSetWidth * 1.5) {
      currentPosition += singleSetWidth;
      applyTransform();
    }
  }
  
  function applyTransform() {
    marqueeContent.style.transform = `translateX(${currentPosition}px)`;
  }
  
  // Bucle de animación con requestAnimationFrame
  function animateMarquee() {
    if (!isPlaying) {
      animationId = requestAnimationFrame(animateMarquee);
      return;
    }
    
    let step = speed;
    if (direction === 1) {
      currentPosition -= step;
    } else {
      currentPosition += step;
    }
    
    manageInfiniteScroll();
    applyTransform();
    
    animationId = requestAnimationFrame(animateMarquee);
  }
  
  // reiniciar dimensiones al resize
  function refreshLayoutAndPosition() {
    updateDimensions();
    const singleWidth = getSingleSetWidth();
    if (singleWidth > 0) {
      while (currentPosition <= -singleWidth) currentPosition += singleWidth;
      while (currentPosition > 0) currentPosition -= singleWidth;
      applyTransform();
    }
  }
  
  // Inicializar marquesina
  function initMarquee() {
    buildMarqueeItems();
    updateDimensions();
    currentPosition = 0;
    applyTransform();
    if (animationId) cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(animateMarquee);
    
    window.addEventListener('resize', () => {
      refreshLayoutAndPosition();
    });
  }
  
  // ---- Controles UI ----
  function togglePlayPause() {
    isPlaying = !isPlaying;
    playPauseBtn.innerHTML = isPlaying ? "⏸️" : "▶️";
    playPauseBtn.title = isPlaying ? "Pausar" : "Reanudar";
  }
  
  function toggleDirection() {
    direction = direction === 1 ? -1 : 1;
    directionStatusSpan.innerHTML = direction === 1 ? "→ Dirección: DERECHA →" : "← Dirección: IZQUIERDA ←";
    directionBtn.style.transform = "scale(0.95)";
    setTimeout(() => { if(directionBtn) directionBtn.style.transform = ""; }, 120);
  }
  
  function updateSpeed() {
    speed = parseFloat(speedRange.value);
    speedValSpan.innerText = speed.toFixed(2) + "x";
  }
  
  // event listeners
  playPauseBtn.addEventListener('click', togglePlayPause);
  directionBtn.addEventListener('click', toggleDirection);
  speedRange.addEventListener('input', () => {
    updateSpeed();
  });
  
  // Inicializar cuando el DOM esté cargado
  window.addEventListener('DOMContentLoaded', () => {
    initMarquee();
    updateSpeed();
    setTimeout(() => {
      refreshLayoutAndPosition();
    }, 100);
    setTimeout(() => {
      refreshLayoutAndPosition();
    }, 400);
  });
  
  window.addEventListener('orientationchange', () => {
    setTimeout(refreshLayoutAndPosition, 50);
  });
  
})();