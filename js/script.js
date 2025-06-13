document.addEventListener("DOMContentLoaded", function() {

    // --- LÓGICA DO MODO ESCURO ---
    const themeSwitch = document.getElementById('theme-switch-checkbox');
    const htmlElement = document.documentElement;
    const applyTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        themeSwitch.checked = theme === 'dark';
    };
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    themeSwitch.addEventListener('change', function() {
        const newTheme = this.checked ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- NAVBAR COM SOMBRA AO ROLAR ---
    const navbar = document.getElementById('main-nav');
    if (navbar) {
        const handleScroll = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
    }

    // --- ANIMAÇÃO DE FADE-IN E CONTADORES (INTERSECTION OBSERVER) ---
    const animatedElements = document.querySelectorAll('.fade-in, .animate-hero, .stat-item');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('fade-in')) {
                    entry.target.classList.add('visible');
                }
                if (entry.target.classList.contains('animate-hero')) {
                    const delay = entry.target.dataset.delay || '0s';
                    const animationName = entry.target.dataset.animation || 'fadeInUp';
                    entry.target.style.animationDelay = delay;
                    entry.target.style.animationName = animationName;
                }
                const counter = entry.target.querySelector('.counter');
                if (counter && !counter.classList.contains('animated')) {
                    animateCounter(counter);
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(element => observer.observe(element));

    function animateCounter(element) {
        element.classList.add('animated');
        const target = +element.getAttribute('data-target');
        const duration = 2000;
        let start = 0;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            element.innerText = Math.floor(progress * target).toLocaleString('pt-BR');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.innerText = target.toLocaleString('pt-BR');
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // --- INICIALIZAÇÃO DO GLIGHTBOX (GALERIA) ---
    const lightbox = GLightbox({ selector: '.glightbox' });

    // --- CONTROLE DE VÍDEO NO CARROSSEL ---
    const videoWrappers = document.querySelectorAll('.video-wrapper');
    videoWrappers.forEach(wrapper => {
        const video = wrapper.querySelector('video');
        const playOverlay = wrapper.querySelector('.play-button-overlay');
        const togglePlay = (e) => {
            e.stopPropagation();
            video.paused ? video.play() : video.pause();
        };
        if (playOverlay) playOverlay.addEventListener('click', togglePlay);
        video.addEventListener('click', togglePlay);
        video.addEventListener('play', () => wrapper.classList.add('playing'));
        video.addEventListener('pause', () => wrapper.classList.remove('playing'));
        video.addEventListener('ended', () => wrapper.classList.remove('playing'));
    });
    const videoCarousel = document.getElementById('video-carousel');
    if (videoCarousel) {
        videoCarousel.addEventListener('slide.bs.carousel', () => {
            videoWrappers.forEach(wrapper => wrapper.querySelector('video').pause());
        });
    }

    // --- ATIVAÇÃO DO LINK DA NAVBAR (SCROLLSPY) ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const activateNavlink = () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 150) {
                currentSectionId = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', activateNavlink);
    activateNavlink();

    // --- ATUALIZAR ANO NO FOOTER ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // === NOVO: LÓGICA DE ANIMAÇÃO PARA O CARROSSEL ANGOTIC ===
    const angoticCarousel = document.getElementById('angotic-carousel');
    if (angoticCarousel) {
        // Função para manipular as classes de animação
        const handleAnimation = (item) => {
            const textElements = item.querySelectorAll('.caption-tag, .caption-title, .caption-text');
            textElements.forEach(el => {
                // Remove e adiciona a classe para forçar o reinício da animação
                el.classList.remove('animated');
                void el.offsetWidth; // Truque para forçar o reflow do browser
                el.classList.add('animated');
            });
        };

        angoticCarousel.addEventListener('slid.bs.carousel', function (event) {
            // event.relatedTarget é o slide que se tornou ativo
            const activeItem = event.relatedTarget;
            const captionContent = activeItem.querySelectorAll('.caption-tag, .caption-title, .caption-text');
            
            // Adiciona um pequeno atraso para garantir que a transição do slide terminou
            setTimeout(() => {
                captionContent.forEach(el => el.style.animation = 'none');
                void activeItem.offsetWidth; // Reflow
                captionContent.forEach(el => el.style.animation = '');
            }, 50);
        });
    }
});