/*
 * Dream Birthday Website - Enhanced Interactive Script
 * Handles all animations, particles, confetti, and user interactions
 */

class DreamBirthdayApp {
    constructor() {
        this.isInitialized = false;
        this.particles = [];
        this.blobs = [];
        this.confettiPieces = [];
        this.wishes = this.loadWishes();
        
        // Animation settings
        this.particleCount = 50;
        this.blobCount = 8;
        this.confettiCount = 150;
        
        // Colors based on Dream's theme
        this.colors = {
            primary: '#00ff41',
            secondary: '#ffed4e',
            accent: '#ff6b6b',
            purple: '#9b59b6',
            blue: '#3498db'
        };
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.createParticles();
            this.createBlobs();
            this.startAnimationLoop();
            this.setupScrollAnimations();
            this.displayWishes();
            this.setupNavigation();
            this.isInitialized = true;
            
            console.log('🎉 Dream Birthday App initialized!');
        });
    }
    
    setupEventListeners() {
        // Celebrate button
        const celebrateBtn = document.getElementById('celebrateBtn');
        if (celebrateBtn) {
            celebrateBtn.addEventListener('click', () => {
                this.startCelebration();
            });
        }
        
        // Wish form
        const addWishBtn = document.getElementById('addWishBtn');
        const clearWishesBtn = document.getElementById('clearWishesBtn');
        const wishInput = document.getElementById('wishInput');
        
        if (addWishBtn) {
            addWishBtn.addEventListener('click', () => {
                this.addWish();
            });
        }
        
        if (clearWishesBtn) {
            clearWishesBtn.addEventListener('click', () => {
                this.clearWishes();
            });
        }
        
        if (wishInput) {
            wishInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    this.addWish();
                }
            });
        }
        
        // Scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                document.getElementById('about').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            });
        }
        
        // Hamburger menu
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            });
        }
        
        // Social cards hover effects
        document.querySelectorAll('.social-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.createMiniConfetti(card);
            });
        });
        
        // Hero avatar click effect
        const heroAvatar = document.querySelector('.hero-avatar');
        if (heroAvatar) {
            heroAvatar.addEventListener('click', () => {
                this.avatarClickEffect();
            });
        }
    }
    
    setupNavigation() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Update navigation on scroll
        window.addEventListener('scroll', () => {
            this.updateNavigation();
        });
    }
    
    updateNavigation() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    createParticles() {
        const container = document.getElementById('particles-container');
        if (!container) return;
        
        // Clear existing particles
        container.innerHTML = '';
        this.particles = [];
        
        for (let i = 0; i < this.particleCount; i++) {
            const particle = this.createParticle();
            container.appendChild(particle.element);
            this.particles.push(particle);
        }
    }
    
    createParticle() {
        const element = document.createElement('div');
        element.className = 'particle';
        
        const size = Math.random() * 6 + 2;
        const color = this.getRandomColor();
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const vx = (Math.random() - 0.5) * 2;
        const vy = (Math.random() - 0.5) * 2;
        
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.backgroundColor = color;
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.style.opacity = Math.random() * 0.5 + 0.3;
        
        return {
            element,
            x, y, vx, vy, size
        };
    }
    
    createBlobs() {
        const container = document.getElementById('blobs-container');
        if (!container) return;
        
        // Clear existing blobs
        container.innerHTML = '';
        this.blobs = [];
        
        for (let i = 0; i < this.blobCount; i++) {
            setTimeout(() => {
                this.createSingleBlob();
            }, i * 1000);
        }
        
        // Continue creating blobs every 3 seconds
        setInterval(() => {
            if (this.blobs.length < this.blobCount) {
                this.createSingleBlob();
            }
        }, 3000);
    }
    
    createSingleBlob() {
        const container = document.getElementById('blobs-container');
        if (!container) return;
        
        const blob = document.createElement('div');
        blob.className = 'blob';
        
        const x = Math.random() * (window.innerWidth - 40);
        const colors = [this.colors.primary, this.colors.secondary, this.colors.accent];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        blob.style.left = `${x}px`;
        blob.style.backgroundColor = color;
        blob.style.boxShadow = `0 0 20px ${color}40`;
        
        container.appendChild(blob);
        this.blobs.push(blob);
        
        // Remove blob after animation
        setTimeout(() => {
            if (container.contains(blob)) {
                container.removeChild(blob);
                this.blobs = this.blobs.filter(b => b !== blob);
            }
        }, 10000);
    }
    
    startCelebration() {
        this.playBirthdayAudio();
        this.createConfetti();
        this.triggerScreenShake();
        this.showCelebrationMessage();
        
        // Create extra blobs for celebration
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createSingleBlob();
            }, i * 200);
        }
    }
    
    playBirthdayAudio() {
        const audio = document.getElementById('birthdayAudio');
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(err => {
                console.warn('Audio playback failed:', err);
            });
        }
    }
    
    createConfetti() {
        const container = document.getElementById('confetti-container');
        if (!container) return;
        
        // Clear existing confetti
        container.innerHTML = '';
        this.confettiPieces = [];
        
        for (let i = 0; i < this.confettiCount; i++) {
            setTimeout(() => {
                this.createConfettiPiece();
            }, i * 10);
        }
    }
    
    createConfettiPiece() {
        const container = document.getElementById('confetti-container');
        if (!container) return;
        
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        
        const shapes = ['square', 'circle', 'triangle'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const color = this.getRandomColor();
        const x = Math.random() * window.innerWidth;
        const size = Math.random() * 8 + 4;
        const duration = Math.random() * 2 + 2;
        
        piece.style.left = `${x}px`;
        piece.style.width = `${size}px`;
        piece.style.height = `${size}px`;
        piece.style.backgroundColor = color;
        piece.style.animationDuration = `${duration}s`;
        piece.style.animationDelay = `${Math.random() * 2}s`;
        
        if (shape === 'circle') {
            piece.style.borderRadius = '50%';
        } else if (shape === 'triangle') {
            piece.style.width = '0';
            piece.style.height = '0';
            piece.style.backgroundColor = 'transparent';
            piece.style.borderLeft = `${size/2}px solid transparent`;
            piece.style.borderRight = `${size/2}px solid transparent`;
            piece.style.borderBottom = `${size}px solid ${color}`;
        }
        
        container.appendChild(piece);
        this.confettiPieces.push(piece);
        
        // Remove confetti piece after animation
        setTimeout(() => {
            if (container.contains(piece)) {
                container.removeChild(piece);
                this.confettiPieces = this.confettiPieces.filter(p => p !== piece);
            }
        }, (duration + 2) * 1000);
    }
    
    createMiniConfetti(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 10; i++) {
            const piece = document.createElement('div');
            piece.style.position = 'fixed';
            piece.style.left = `${centerX}px`;
            piece.style.top = `${centerY}px`;
            piece.style.width = '4px';
            piece.style.height = '4px';
            piece.style.backgroundColor = this.getRandomColor();
            piece.style.borderRadius = '50%';
            piece.style.pointerEvents = 'none';
            piece.style.zIndex = '10000';
            
            document.body.appendChild(piece);
            
            // Animate the mini confetti
            const angle = (Math.PI * 2 * i) / 10;
            const velocity = 50 + Math.random() * 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            piece.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${vx}px, ${vy}px) scale(0)`, opacity: 0 }
            ], {
                duration: 600,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).addEventListener('finish', () => {
                document.body.removeChild(piece);
            });
        }
    }
    
    triggerScreenShake() {
        document.body.style.animation = 'screenShake 0.5s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
        
        // Add screen shake keyframes if not already present
        if (!document.querySelector('#screenShakeStyle')) {
            const style = document.createElement('style');
            style.id = 'screenShakeStyle';
            style.textContent = `
                @keyframes screenShake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
                    20%, 40%, 60%, 80% { transform: translateX(2px); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    showCelebrationMessage() {
        const message = document.createElement('div');
        message.innerHTML = '🎉 Happy Birthday Dream! 🎂';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, ${this.colors.primary}, ${this.colors.secondary});
            color: #0a0a0a;
            padding: 2rem 3rem;
            border-radius: 20px;
            font-size: 2rem;
            font-weight: 800;
            z-index: 10001;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            animation: celebrationPop 3s ease-out forwards;
        `;
        
        // Add animation keyframes
        if (!document.querySelector('#celebrationPopStyle')) {
            const style = document.createElement('style');
            style.id = 'celebrationPopStyle';
            style.textContent = `
                @keyframes celebrationPop {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                    20% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                    40% { transform: translate(-50%, -50%) scale(1); }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (document.body.contains(message)) {
                document.body.removeChild(message);
            }
        }, 3000);
    }
    
    avatarClickEffect() {
        const avatar = document.querySelector('.hero-avatar');
        if (!avatar) return;
        
        avatar.style.animation = 'none';
        setTimeout(() => {
            avatar.style.animation = 'avatarBounce 3s ease-in-out infinite, avatarSpin 1s ease-out';
        }, 10);
        
        // Add spin animation
        if (!document.querySelector('#avatarSpinStyle')) {
            const style = document.createElement('style');
            style.id = 'avatarSpinStyle';
            style.textContent = `
                @keyframes avatarSpin {
                    from { transform: rotate(0deg) scale(1); }
                    50% { transform: rotate(180deg) scale(1.1); }
                    to { transform: rotate(360deg) scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
        
        this.createMiniConfetti(avatar);
    }
    
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for scroll animations
        document.querySelectorAll('.feature-card, .timeline-item, .media-card, .social-card').forEach(el => {
            observer.observe(el);
        });
    }
    
    addWish() {
        const input = document.getElementById('wishInput');
        if (!input) return;
        
        const text = input.value.trim();
        if (text.length === 0) {
            this.showNotification('Please write a message first! ✨');
            return;
        }
        
        const wish = {
            id: Date.now(),
            text: text,
            timestamp: new Date().toLocaleString(),
            author: 'Anonymous Fan'
        };
        
        this.wishes.unshift(wish);
        this.saveWishes();
        this.displayWishes();
        input.value = '';
        
        this.showNotification('Birthday wish sent! 🎉');
        
        // Create confetti at the button location
        const button = document.getElementById('addWishBtn');
        if (button) {
            this.createMiniConfetti(button);
        }
    }
    
    clearWishes() {
        if (confirm('Are you sure you want to clear all wishes?')) {
            this.wishes = [];
            this.saveWishes();
            this.displayWishes();
            this.showNotification('All wishes cleared! 🧹');
        }
    }
    
    displayWishes() {
        const wishList = document.getElementById('wishList');
        if (!wishList) return;
        
        if (this.wishes.length === 0) {
            wishList.innerHTML = '<p style="text-align: center; opacity: 0.7;">No wishes yet. Be the first to send one! 💌</p>';
            return;
        }
        
        wishList.innerHTML = this.wishes.map(wish => `
            <div class=\"wish-item\" data-wish-id=\"${wish.id}\">
                <div class=\"wish-content\">
                    <p>\"${wish.text}\"</p>
                    <span class=\"wish-author\">- ${wish.author} (${wish.timestamp})</span>
                </div>
            </div>
        `).join('');
    }
    
    loadWishes() {
        try {
            const saved = localStorage.getItem('dreamBirthdayWishes');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.warn('Failed to load wishes:', error);
            return [];
        }
    }
    
    saveWishes() {
        try {
            localStorage.setItem('dreamBirthdayWishes', JSON.stringify(this.wishes));
        } catch (error) {
            console.warn('Failed to save wishes:', error);
        }
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.colors.primary};
            color: #0a0a0a;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            font-weight: 600;
            z-index: 10002;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 20px rgba(0, 255, 65, 0.3);
        `;
        
        document.body.appendChild(notification);
        
        // Slide in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Slide out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    startAnimationLoop() {
        const animate = () => {
            this.updateParticles();
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = window.innerWidth;
            if (particle.x > window.innerWidth) particle.x = 0;
            if (particle.y < 0) particle.y = window.innerHeight;
            if (particle.y > window.innerHeight) particle.y = 0;
            
            particle.element.style.left = `${particle.x}px`;
            particle.element.style.top = `${particle.y}px`;
        });
    }
    
    getRandomColor() {
        const colors = [
            this.colors.primary,
            this.colors.secondary,
            this.colors.accent,
            this.colors.purple,
            this.colors.blue
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Handle window resize
    handleResize() {
        this.createParticles();
    }
}

// Initialize the app
const dreamApp = new DreamBirthdayApp();

// Handle window resize
window.addEventListener('resize', () => {
    dreamApp.handleResize();
});

// Add some fun easter eggs
document.addEventListener('keydown', (e) => {
    // Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    if (!window.konamiSequence) window.konamiSequence = [];
    
    window.konamiSequence.push(e.code);
    if (window.konamiSequence.length > konamiCode.length) {
        window.konamiSequence.shift();
    }
    
    if (window.konamiSequence.join('') === konamiCode.join('')) {
        dreamApp.showNotification('🎮 Konami Code Activated! Extra celebration mode! 🎉');
        dreamApp.startCelebration();
        dreamApp.startCelebration(); // Double celebration!
        window.konamiSequence = [];
    }
    
    // Press 'D' for Dream
    if (e.key.toLowerCase() === 'd' && !e.target.matches('input, textarea')) {
        dreamApp.createSingleBlob();
    }
    
    // Press 'C' for confetti
    if (e.key.toLowerCase() === 'c' && !e.target.matches('input, textarea')) {
        dreamApp.createConfetti();
    }
});

// Add some CSS for active navigation
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        background: rgba(0, 255, 65, 0.2);
        color: var(--dream-green) !important;
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    @media (max-width: 768px) {
        .nav-menu.active {
            display: flex;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(10, 10, 10, 0.98);
            backdrop-filter: blur(20px);
            flex-direction: column;
            padding: 2rem;
            gap: 1rem;
            border-radius: 0 0 20px 20px;
        }
    }
`;
document.head.appendChild(style);

console.log('🎂 Dream Birthday Website loaded! Press D for blobs, C for confetti! 🎉');