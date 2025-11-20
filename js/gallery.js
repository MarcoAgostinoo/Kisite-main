(function () {
    const root = document.querySelector('.ksg-root');
    if (!root) return;
    const gallery = root.querySelector('#ksg-gallery');
    const lightbox = root.querySelector('#ksg-lightbox');
    const lbPanel = root.querySelector('.ksg-lb-panel');
    const lbContent = root.querySelector('.ksg-lb-content');
    const lbImage = root.querySelector('#ksg-lb-image');
    const lbTitle = root.querySelector('#ksg-lb-title');
    const lbDesc = root.querySelector('#ksg-lb-desc');
    const lbMeta = root.querySelector('#ksg-lb-meta');
    // MODIFICADO: Seleciona o novo botão pelo novo ID
    const lbWebsiteLink = root.querySelector('#ksg-lb-website-link');
    const lbPrev = root.querySelector('.ksg-lb-prev');
    const lbNext = root.querySelector('.ksg-lb-next');
    const lbClose = root.querySelector('.ksg-lb-close');
    const lbBackdrop = root.querySelector('.ksg-lb-backdrop');
    const lbThumbs = root.querySelector('#ksg-lb-thumbs');
    const lbFullscreenBtn = root.querySelector('#ksg-lb-fullscreen');
    let items = Array.from(gallery.querySelectorAll('.ksg-card'));
    let currentIndex = 0;
    let lastFocused = null;
    let keydownHandler = null;
    items.forEach((el, i) => el.dataset.ksgIndex = i);
    function renderThumbs() {
    lbThumbs.innerHTML = '';
    items.forEach((el, idx) => {
    const thumb = document.createElement('img');
    thumb.src = el.querySelector('img').src;
    thumb.alt = el.querySelector('img').alt || el.dataset.ksgTitle || '';
    thumb.dataset.ksgIndex = idx;
    thumb.className = '';
    if (idx === currentIndex) thumb.classList.add('ksg-active');
    thumb.addEventListener('click', (e) => {
    e.stopPropagation();
    openLightbox(Number(thumb.dataset.ksgIndex));
    });
    lbThumbs.appendChild(thumb);
    });
    }
    function openLightbox(index) {
    const el = items[index];
    if (!el) return;
    lastFocused = document.activeElement;
    const img = el.querySelector('img');
    lbImage.src = img.src;
    lbImage.alt = img.alt || el.dataset.ksgTitle || '';
    lbTitle.textContent = el.dataset.ksgTitle || '';
    lbDesc.textContent = el.dataset.ksgDesc || '';
    lbMeta.textContent = `${el.dataset.ksgAuthor || ''} · ${el.dataset.ksgDate || ''}`;
    
    // --- LÓGICA MODIFICADA ---
    // Pega a URL do site do atributo data-ksg-url
    const siteUrl = el.dataset.ksgUrl;

    // Verifica se a URL foi fornecida no HTML
    if (siteUrl && siteUrl.trim() !== '') {
      lbWebsiteLink.href = siteUrl;
      lbWebsiteLink.style.display = 'inline-block'; // Garante que o botão esteja visível
    } else {
      lbWebsiteLink.style.display = 'none'; // Esconde o botão se não houver URL
    }
    // --- FIM DA LÓGICA MODIFICADA ---

    currentIndex = Number(index);
    renderThumbs();
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
    keydownHandler = function (e) {
    if (e.key === 'Escape') {
    e.preventDefault();
    closeLightbox();
    return;
    }
    if (e.key === 'ArrowRight') {
    e.preventDefault();
    showNext();
    return;
    }
    if (e.key === 'ArrowLeft') {
    e.preventDefault();
    showPrev();
    return;
    }
    if (e.key === 'Tab') {
    const focusables = Array.from(lbPanel.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])'))
    .filter(a => !a.hasAttribute('disabled'));
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
    }
    if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
    }
    }
    };
    lbContent.addEventListener('keydown', keydownHandler);
    lbContent.focus({ preventScroll: true });
    prefetchNextImage(currentIndex);
    }
    function closeLightbox() {
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    if (keydownHandler) {
    lbContent.removeEventListener('keydown', keydownHandler);
    keydownHandler = null;
    }
    }
    function showNext() {
    openLightbox((currentIndex + 1) % items.length);
    }
    function showPrev() {
    openLightbox((currentIndex - 1 + items.length) % items.length);
    }
    function prefetchNextImage(idx) {
    const nextIdx = (idx + 1) % items.length;
    const url = items[nextIdx].querySelector('img').src;
    const img = new Image();
    img.src = url;
    }
    gallery.addEventListener('click', function (ev) {
    const card = ev.target.closest('.ksg-card');
    if (!card || !gallery.contains(card)) return;
    openLightbox(Number(card.dataset.ksgIndex));
    });
    gallery.addEventListener('keydown', function (ev) {
    if (ev.key === 'Enter' || ev.key === ' ') {
    const card = ev.target.closest('.ksg-card');
    if (!card || !gallery.contains(card)) return;
    ev.preventDefault();
    openLightbox(Number(card.dataset.ksgIndex));
    }
    });
    lbClose.addEventListener('click', closeLightbox);
    lbBackdrop.addEventListener('click', closeLightbox);
    lbNext.addEventListener('click', function (e) {
    e.stopPropagation();
    showNext();
    });
    lbPrev.addEventListener('click', function (e) {
    e.stopPropagation();
    showPrev();
    });
    lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
    });
    (function addTouch() {
    let touchStartX = 0;
    let touchEndX = 0;
    function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    }
    function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
    if (diff < 0) showNext();
    else showPrev();
    }
    }
    lightbox.addEventListener('touchstart', handleTouchStart, { passive: true });
    lightbox.addEventListener('touchend', handleTouchEnd, { passive: true });
    })();
    async function toggleFullscreen() {
    if (!document.fullscreenElement) {
    try {
    await document.documentElement.requestFullscreen();
    } catch (e) {
    console.warn('Falha ao entrar em tela cheia', e);
    }
    } else {
    try {
    await document.exitFullscreen();
    } catch (e) {
    console.warn('Falha ao sair da tela cheia', e);
    }
    }
    }
    lbFullscreenBtn.addEventListener('click', toggleFullscreen);
    renderThumbs();
    root.ksgGallery = {
    open: (index = 0) => openLightbox(index),
    close: closeLightbox,
    next: showNext,
    prev: showPrev
    };
    })();