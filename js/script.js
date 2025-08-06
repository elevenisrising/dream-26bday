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
        this.sampleWishes = [];  // Will be loaded from CSV
        this.currentWishIndex = 0;
        this.availableWishIndices = [];
        this.availableArtworkIndices = [];
        this.artworks = [];
        this.currentArtworkIndex = 0;
        this.thumbnailOffset = 0;
        this.thumbnailsPerPage = 4;
        this.availableArtworkIndices = [];  // For random selection without repeat
        this.hasUserInteractedWithGallery = false;  // Track user interaction
        this.phaseGifsPreloaded = false;  // Track GIF preloading
        
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
            this.preloadPhaseGifs();
            this.loadArtworksFromImport();
            this.initWishesDisplay(); // Show loading state first
            this.loadWishesFromImport(); // Load from imported JS data
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
        
        // Random wish display
        const nextWishBtn = document.getElementById('nextWishBtn');
        const addWishBtn = document.getElementById('addWishBtn');
        const submitWishBtn = document.getElementById('submitWishBtn');
        const cancelWishBtn = document.getElementById('cancelWishBtn');
        const wishInput = document.getElementById('wishInput');
        
        if (nextWishBtn) {
            nextWishBtn.addEventListener('click', () => {
                this.showNextWish();
            });
        }
        
        if (addWishBtn) {
            addWishBtn.addEventListener('click', () => {
                this.showWishForm();
            });
        }
        
        if (submitWishBtn) {
            submitWishBtn.addEventListener('click', () => {
                this.submitWish();
            });
        }
        
        if (cancelWishBtn) {
            cancelWishBtn.addEventListener('click', () => {
                this.hideWishForm();
            });
        }
        
        if (wishInput) {
            wishInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    this.submitWish();
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
        
        // Pull rope interaction - drag to activate
        const pullRope = document.querySelector('.pull-rope-container');
        if (pullRope) {
            let isDragging = false;
            let startY = 0;
            let currentY = 0;
            let pullDistance = 0;
            
            pullRope.addEventListener('mousedown', (e) => {
                isDragging = true;
                startY = e.clientY;
                pullRope.classList.add('pulling');
                e.preventDefault();
            });
            
            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                
                currentY = e.clientY;
                pullDistance = Math.max(0, currentY - startY);
                
                // Visual feedback while dragging
                if (pullDistance > 15) {
                    pullRope.style.transform = `translateY(${Math.min(pullDistance * 0.4, 20)}px)`;
                }
                
                // Trigger when pulled down 40px or more
                if (pullDistance > 40) {
                    this.pullRope();
                    isDragging = false;
                    pullRope.classList.remove('pulling');
                    pullRope.style.transform = '';
                }
            });
            
            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    pullRope.classList.remove('pulling');
                    pullRope.style.transform = '';
                }
            });
            
            // Touch events for mobile
            pullRope.addEventListener('touchstart', (e) => {
                isDragging = true;
                startY = e.touches[0].clientY;
                pullRope.classList.add('pulling');
                e.preventDefault();
            });
            
            document.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                
                currentY = e.touches[0].clientY;
                pullDistance = Math.max(0, currentY - startY);
                
                if (pullDistance > 15) {
                    pullRope.style.transform = `translateY(${Math.min(pullDistance * 0.4, 20)}px)`;
                }
                
                if (pullDistance > 40) {
                    this.pullRope();
                    isDragging = false;
                    pullRope.classList.remove('pulling');
                    pullRope.style.transform = '';
                }
                e.preventDefault();
            });
            
            document.addEventListener('touchend', () => {
                if (isDragging) {
                    isDragging = false;
                    pullRope.classList.remove('pulling');
                    pullRope.style.transform = '';
                }
            });
        }
        
        // Setup journey without starting autoplay yet
        this.setupJourneyInteractions();
        
        // Gallery interactions
        const nextArtworkBtn = document.getElementById('nextArtworkBtn');
        const visitArtistBtn = document.getElementById('visitArtistBtn');
        
        if (nextArtworkBtn) {
            nextArtworkBtn.addEventListener('click', () => {
                this.hasUserInteractedWithGallery = true;
                this.showNextArtwork();
            });
        }
        
        if (visitArtistBtn) {
            visitArtistBtn.addEventListener('click', () => {
                this.visitCurrentArtist();
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
        
        // Don't start automatic blob creation - only create blobs when rope is pulled
        console.log('🎯 Blob system initialized - waiting for rope pull');
    }
    
    createSingleBlob() {
        const container = document.getElementById('blobs-container');
        if (!container) return;
        
        const blob = document.createElement('img');
        blob.src = 'assets/Dreamblob.png';
        blob.className = 'blob dream-blob-image';
        blob.alt = 'Dream Blob';
        
        const x = Math.random() * (window.innerWidth - 40);
        const size = 35 + Math.random() * 15; // 35-50px
        
        blob.style.position = 'absolute';
        blob.style.left = `${x}px`;
        blob.style.top = '-60px';
        blob.style.width = `${size}px`;
        blob.style.height = `${size}px`;
        blob.style.animation = 'blobFall 10s linear forwards';
        blob.style.transform = `rotate(${Math.random() * 360}deg)`;
        blob.style.opacity = '0.8';
        blob.style.zIndex = '500';
        
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
    
    pullRope() {
        // Show blob alert message
        this.showBlobAlert();
        
        // Create LOTS of blobs falling from the rope - birthday explosion!
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createRopeBlob();
            }, i * 50); // Faster intervals for more intensity
        }
        
        // Add more blobs in waves
        setTimeout(() => {
            for (let i = 0; i < 15; i++) {
                setTimeout(() => {
                    this.createRopeBlob();
                }, i * 80);
            }
        }, 1000);
        
        // Final wave of blobs
        setTimeout(() => {
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    this.createRopeBlob();
                }, i * 120);
            }
        }, 2000);
        
        // Create confetti explosion too!
        this.createConfetti();
        
    }
    
    showBlobAlert() {
        // Create the alert element
        const alert = document.createElement('div');
        alert.className = 'blob-alert';
        alert.textContent = 'Blob Attack!';
        
        // Add to body
        document.body.appendChild(alert);
        
        // Remove after animation completes
        setTimeout(() => {
            if (alert && alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 3000);
    }
    
    createRopeBlob() {
        const container = document.getElementById('blobs-container');
        if (!container) return;
        
        const blob = document.createElement('img');
        blob.src = 'assets/Dreamblob.png';
        blob.className = 'blob rope-blob dream-blob-image';
        blob.alt = 'Dream Blob';
        
        // Random position across entire page width
        const x = Math.random() * (window.innerWidth - 40);
        
        // Random size for variety
        const size = 30 + Math.random() * 20; // 30-50px
        
        blob.style.position = 'absolute';
        blob.style.left = `${x}px`;
        blob.style.top = '-60px'; // Start from top of screen
        blob.style.width = `${size}px`;
        blob.style.height = `${size}px`;
        blob.style.animation = 'blobFall 4s linear forwards';
        blob.style.transform = `rotate(${Math.random() * 360}deg)`;
        blob.style.opacity = '1';
        blob.style.zIndex = '1000';
        
        container.appendChild(blob);
        this.blobs.push(blob);
        
        // Remove blob after animation
        setTimeout(() => {
            if (container.contains(blob)) {
                container.removeChild(blob);
                this.blobs = this.blobs.filter(b => b !== blob);
            }
        }, 4000);
    }
    
    setupJourneyInteractions() {
        this.currentPhase = 1;
        this.currentProgress = 0; // Start at 0% (Beginning of Phase 1)
        this.autoPlayTimer = null;
        this.smoothTimer = null;
        this.resumeTimeout = null;
        this.isUserInteracting = false;
        this.journeyObserver = null;
        this.availablePhaseGifs = new Set([1, 2, 3, 4]); // All phase GIFs are available
        
        // Immediately set initial progress bar state to 0%
        this.goToProgressPercentage(0, false);
        
        // Ensure phase content is updated on initial load
        this.updatePhaseContent(1);
        
        // Don't start autoplay immediately - wait for user to scroll to section
        this.setupJourneyVisibilityObserver();
        
        // Checkpoint clicks
        document.querySelectorAll('.checkpoint').forEach(checkpoint => {
            checkpoint.addEventListener('click', () => {
                this.pauseAutoPlay();
                const phase = parseInt(checkpoint.dataset.phase);
                const percentage = (phase - 1) * 25 + 12.5; // Center of each phase
                this.currentProgress = percentage;
                this.goToProgressPercentage(percentage);
                this.resumeAutoPlayAfterDelay();
            });
        });
        
        // Progress bar interactions
        const thinProgressBar = document.querySelector('.thin-progress-bar');
        const walkingCharacterProgress = document.querySelector('.walking-character-progress');
        
        // Progress bar click handling
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                // Don't trigger if clicking on the walking character
                if (e.target.closest('.walking-character-progress')) return;
                
                this.pauseAutoPlay();
                this.isUserInteracting = true;
                
                const rect = progressBar.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
                
                // Update current progress to clicked position
                this.currentProgress = percentage;
                this.goToProgressPercentage(percentage);
                
                // Resume autoplay after interaction
                this.isUserInteracting = false;
                this.startAutoPlay();
            });
        }
        
        // Walking character drag handling
        if (walkingCharacterProgress && progressBar) {
            let isDragging = false;
            
            // Mouse events
            walkingCharacterProgress.addEventListener('mousedown', (e) => {
                isDragging = true;
                this.pauseAutoPlay();
                this.isUserInteracting = true;
                walkingCharacterProgress.style.cursor = 'grabbing';
                e.preventDefault();
            });
            
            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                
                const rect = progressBar.getBoundingClientRect();
                const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
                const percentage = (x / rect.width) * 100;
                
                // Update current progress while dragging
                this.currentProgress = percentage;
                this.goToProgressPercentage(percentage, false); // Don't animate while dragging
            });
            
            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    this.isUserInteracting = false;
                    walkingCharacterProgress.style.cursor = 'grab';
                    // Resume autoplay from current position
                    this.startAutoPlay();
                }
            });
            
            // Touch events for mobile
            walkingCharacterProgress.addEventListener('touchstart', (e) => {
                isDragging = true;
                this.pauseAutoPlay();
                this.isUserInteracting = true;
                e.preventDefault();
            });
            
            document.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                
                const touch = e.touches[0];
                const rect = progressBar.getBoundingClientRect();
                const x = Math.max(0, Math.min(rect.width, touch.clientX - rect.left));
                const percentage = (x / rect.width) * 100;
                
                // Update current progress while dragging
                this.currentProgress = percentage;
                this.goToProgressPercentage(percentage, false);
                e.preventDefault();
            });
            
            document.addEventListener('touchend', () => {
                if (isDragging) {
                    isDragging = false;
                    this.isUserInteracting = false;
                    // Resume autoplay from current position
                    this.startAutoPlay();
                }
            });
        }
    }
    
    // New method for handling progress percentage
    goToProgressPercentage(percentage, animate = true) {
        this.currentProgress = Math.max(0, Math.min(100, percentage));
        
        // Determine phase based on exact boundary points
        let phase;
        if (percentage < 25) {
            phase = 1;
        } else if (percentage < 50) {
            phase = 2;
        } else if (percentage < 75) {
            phase = 3;
        } else {
            phase = 4;  // Stay at phase 4 even at 100%
        }
        
        // Update character position based on exact percentage
        this.updateCharacterPosition(percentage);
        
        // Update phase content only if phase changed
        if (phase !== this.currentPhase) {
            this.currentPhase = phase;
            this.updatePhaseContent(phase);
        }
        
        // Update progress bar
        this.updateProgressBar(percentage, animate);
    }
    
    
    updateCharacterPosition(percentage) {
        const character = document.querySelector('.walking-character-progress');
        if (character) {
            // Convert percentage to left position (0% to 100%)
            const leftPosition = Math.max(0, Math.min(100, percentage));
            character.style.left = `${leftPosition}%`;
            console.log(`🚶 Dream moved to ${leftPosition}%`);
        }
    }
    
    updatePhaseContent(phase) {
        // Update checkpoints
        document.querySelectorAll('.checkpoint').forEach(checkpoint => {
            checkpoint.classList.remove('active');
        });
        const activeCheckpoint = document.querySelector(`[data-phase="${phase}"]`);
        if (activeCheckpoint) {
            activeCheckpoint.classList.add('active');
        }
        
        // Update phase content (only for phases 1-4)
        document.querySelectorAll('.phase-item').forEach(item => {
            item.classList.remove('active');
        });
        if (phase <= 4) {
            const activePhaseItem = document.querySelector(`.phase-item[data-phase="${phase}"]`);
            if (activePhaseItem) {
                activePhaseItem.classList.add('active');
            }
        }
        
        // Update walking character animation based on phase
        const walkingDreamProgress = document.querySelector('.walking-dream-progress');
        if (walkingDreamProgress) {
            // Remove all phase classes
            walkingDreamProgress.classList.remove('phase-1', 'phase-2', 'phase-3', 'phase-4');
            
            // Try to use GIF for this phase, fall back to default if not available
            this.setPhaseAnimation(walkingDreamProgress, phase);
        }
        
        // Phase notifications disabled per user request
    }
    
    updateProgressBar(percentage, animate = true) {
        // Update progress fill and walking character
        const progressFill = document.querySelector('.progress-fill');
        const walkingCharacterProgress = document.querySelector('.walking-character-progress');
        
        // Update progress fill
        if (progressFill) {
            if (animate) {
                progressFill.style.width = `${percentage}%`;
            } else {
                progressFill.style.transition = 'none';
                progressFill.style.width = `${percentage}%`;
                
                // Re-enable transitions after a frame
                requestAnimationFrame(() => {
                    progressFill.style.transition = '';
                });
            }
        }
        
        // Update walking character position
        if (walkingCharacterProgress) {
            if (animate) {
                walkingCharacterProgress.style.left = `${percentage}%`;
            } else {
                walkingCharacterProgress.style.transition = 'none';
                walkingCharacterProgress.style.left = `${percentage}%`;
                
                // Re-enable transitions after a frame
                requestAnimationFrame(() => {
                    walkingCharacterProgress.style.transition = '';
                });
            }
        }
    }
    
    // Continuous video-like progress bar
    startAutoPlay() {
        // Clear any existing timer first
        this.pauseAutoPlay();
        
        // Start continuous movement like video progress bar
        this.autoPlayTimer = setInterval(() => {
            if (!this.isUserInteracting) {
                // Move forward by small increments continuously
                this.currentProgress += 0.125; // 0.125% every 100ms = 25% in 20 seconds
                
                // Stop at 100% instead of looping
                if (this.currentProgress >= 100) {
                    this.currentProgress = 100;
                    this.pauseAutoPlay();
                }
                
                this.goToProgressPercentage(this.currentProgress, false);
            }
        }, 100); // Update every 100ms for smooth movement
        
        console.log('▶️ Video-like auto-play started');
    }
    
    pauseAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
            console.log('⏸️ Video-like auto-play paused');
        }
    }
    
    resumeAutoPlayAfterDelay() {
        // Clear any existing resume timeout
        if (this.resumeTimeout) {
            clearTimeout(this.resumeTimeout);
        }
        
        this.resumeTimeout = setTimeout(() => {
            if (!this.isUserInteracting && !this.autoPlayTimer) {
                this.startAutoPlay();
                console.log('🔄 Auto-play resumed');
            }
            this.resumeTimeout = null;
        }, 5000); // Resume after 5 seconds of no interaction
    }
    
    setupJourneyVisibilityObserver() {
        const achievementsSection = document.getElementById('achievements');
        if (!achievementsSection) return;
        
        this.journeyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // User scrolled to achievements section - start autoplay
                    console.log('🎯 Journey section visible - starting autoplay');
                    if (!this.autoPlayTimer && !this.isUserInteracting) {
                        this.startAutoPlay();
                    }
                } else {
                    // User scrolled away - pause autoplay
                    console.log('🎯 Journey section hidden - pausing autoplay');
                    this.pauseAutoPlay();
                }
            });
        }, {
            threshold: 0.3, // Start when 30% of section is visible
            rootMargin: '0px'
        });
        
        this.journeyObserver.observe(achievementsSection);
    }
    
    // Set phase animation for walking character  
    setPhaseAnimation(walkingDreamProgress, phase) {
        // Always use GIF for phases 1-4
        if (phase >= 1 && phase <= 4) {
            walkingDreamProgress.classList.add(`phase-${phase}`);
            console.log(`✓ Using phase-${phase} GIF animation`);
        } else {
            console.log(`✓ Phase ${phase}: Using default avatar`);
        }
    }
    
    getPhaseTitle(phase) {
        const titles = {
            1: 'Early Days Era',
            2: 'Rise to Fame Era',
            3: 'Peak Success Era',
            4: 'Legacy Era'
        };
        return titles[phase] || 'Unknown Phase';
    }
    
    preloadPhaseGifs() {
        // Preload all phase GIFs to prevent loading gaps
        const phaseGifPaths = [
            'assets/phase1.gif',
            'assets/phase2.gif', 
            'assets/phase3.gif',
            'assets/phase4.gif'
        ];
        
        let loadedCount = 0;
        const totalGifs = phaseGifPaths.length;
        
        phaseGifPaths.forEach((path, index) => {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                console.log(`✓ Preloaded phase ${index + 1} GIF`);
                
                if (loadedCount === totalGifs) {
                    this.phaseGifsPreloaded = true;
                    console.log('✓ All phase GIFs preloaded successfully');
                }
            };
            img.onerror = () => {
                console.warn(`⚠️ Failed to preload phase ${index + 1} GIF: ${path}`);
                loadedCount++;
                
                if (loadedCount === totalGifs) {
                    this.phaseGifsPreloaded = true;
                }
            };
            img.src = path;
        });
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
    
    initWishesDisplay() {
        if (this.sampleWishes.length === 0) {
            this.displayLoadingWish();
        } else {
            this.showRandomWish();
            this.updateWishStats();
        }
    }
    
    displayLoadingWish() {
        const wishText = document.getElementById('wishText');
        const wishAuthor = document.getElementById('wishAuthor');
        
        if (wishText) wishText.textContent = '"Loading birthday wishes from fans..."';
        if (wishAuthor) wishAuthor.textContent = '- Please wait';
        
        // Add loading animation
        const currentWish = document.getElementById('currentWish');
        if (currentWish) {
            currentWish.style.opacity = '0.6';
            currentWish.style.animation = 'pulse 2s infinite';
        }
    }
    
    showRandomWish() {
        if (this.sampleWishes.length === 0) {
            console.log('No wishes loaded yet');
            return;
        }
        
        // Initialize available indices if empty or if all wishes have been shown
        if (this.availableWishIndices.length === 0) {
            this.availableWishIndices = Array.from({length: this.sampleWishes.length}, (_, i) => i);
        }
        
        // Get truly random index from available indices
        let randomIndex;
        if (window.crypto && window.crypto.getRandomValues) {
            const array = new Uint32Array(1);
            window.crypto.getRandomValues(array);
            randomIndex = array[0] % this.availableWishIndices.length;
        } else {
            randomIndex = Math.floor(Math.random() * this.availableWishIndices.length);
        }
        
        // Get the actual wish index and remove it from available indices
        const wishIndex = this.availableWishIndices.splice(randomIndex, 1)[0];
        const wish = this.sampleWishes[wishIndex];
        this.displayCurrentWish(wish);
    }
    
    showNextWish() {
        const currentWish = document.getElementById('currentWish');
        if (currentWish) {
            currentWish.classList.add('wish-changing');
            
            setTimeout(() => {
                this.showRandomWish();
                currentWish.classList.remove('wish-changing');
            }, 250);
        }
    }
    
    displayCurrentWish(wish) {
        const wishText = document.getElementById('wishText');
        const wishAuthor = document.getElementById('wishAuthor');
        
        if (wishText) wishText.textContent = `"${wish.text}"`;
        if (wishAuthor) wishAuthor.textContent = `- ${wish.author}`;
    }
    
    showWishForm() {
        const formContainer = document.querySelector('.wish-form-container');
        if (formContainer) {
            formContainer.style.display = 'block';
            const textarea = document.getElementById('wishInput');
            if (textarea) textarea.focus();
        }
    }
    
    hideWishForm() {
        const formContainer = document.querySelector('.wish-form-container');
        const textarea = document.getElementById('wishInput');
        
        if (formContainer) formContainer.style.display = 'none';
        if (textarea) textarea.value = '';
    }
    
    submitWish() {
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
            author: 'Anonymous Fan',
            example: false
        };
        
        this.wishes.unshift(wish);
        this.saveWishes();
        this.hideWishForm();
        this.updateWishStats();
        
        this.showNotification('Birthday wish added! 🎉 It may appear randomly!');
        
        // Create confetti at the button location
        const button = document.getElementById('submitWishBtn');
        if (button) {
            this.createMiniConfetti(button);
        }
    }
    
    updateWishStats() {
        const totalWishes = this.sampleWishes.length + this.wishes.length;
        const wishCount = document.getElementById('wishCount');
        if (wishCount) {
            wishCount.textContent = totalWishes;
        }
    }
    
    // Gallery Methods
    loadArtworksFromImport() {
        // Use imported artworks data directly - no CSV loading needed
        if (window.ARTWORKS_DATA && window.ARTWORKS_DATA.length > 0) {
            console.log('🎨 Loading artworks from imported data...');
            this.artworks = window.ARTWORKS_DATA.map(artwork => ({
                filename: artwork.filename,
                artist: artwork.artist,
                description: artwork.description,
                link: artwork.link,
                path: artwork.path
            }));
            console.log(`✅ Loaded ${this.artworks.length} artworks from artworks-data.js`);
            this.initGalleryDisplay();
        } else {
            console.error('❌ No artworks data found - artworks-data.js not loaded or empty');
            this.displayErrorArtwork();
        }
    }
    
    loadWishesFromImport() {
        // Use imported wishes data directly - no CSV loading needed
        if (window.WISHES_DATA && window.WISHES_DATA.length > 0) {
            console.log('📦 Loading wishes from imported data...');
            this.sampleWishes = window.WISHES_DATA.map(wish => ({
                author: wish.author,
                text: wish.text,
                example: false
            }));
            console.log(`✅ Loaded ${this.sampleWishes.length} wishes from wishes-data.js`);
            
            // Update display immediately
            this.showRandomWish();
            this.updateWishStats();
            
            // Remove loading animation
            const currentWish = document.getElementById('currentWish');
            if (currentWish) {
                currentWish.style.opacity = '1';
                currentWish.style.animation = '';
            }
        } else {
            console.error('❌ No wishes data found - wishes-data.js not loaded or empty');
            this.displayErrorWish();
        }
    }
    
    displayErrorWish() {
        const wishText = document.getElementById('wishText');
        const wishAuthor = document.getElementById('wishAuthor');
        
        if (wishText) wishText.textContent = '"Failed to load birthday wishes. Please refresh the page."';
        if (wishAuthor) wishAuthor.textContent = '- System';
        
        // Remove loading animation
        const currentWish = document.getElementById('currentWish');
        if (currentWish) {
            currentWish.style.opacity = '1';
            currentWish.style.animation = '';
        }
    }
    
    displayErrorArtwork() {
        const artworkImage = document.getElementById('artworkImage');
        const artworkPlaceholder = document.getElementById('artworkPlaceholder');
        const artworkAuthor = document.getElementById('artworkAuthor');
        const artworkDescription = document.getElementById('artworkDescription');
        
        if (artworkImage) artworkImage.style.display = 'none';
        if (artworkPlaceholder) {
            artworkPlaceholder.style.display = 'block';
            artworkPlaceholder.textContent = 'Failed to load artworks';
        }
        if (artworkAuthor) artworkAuthor.textContent = 'System Error';
        if (artworkDescription) artworkDescription.textContent = 'Failed to load artwork data. Please refresh the page.';
    }
    
    
    initGalleryDisplay() {
        this.buildThumbnailGallery();
        this.showRandomArtwork();  // Start with random artwork
        this.updateArtworkStats();
    }
    
    buildThumbnailGallery() {
        const thumbnailGrid = document.getElementById('thumbnailGrid');
        if (!thumbnailGrid) return;
        
        thumbnailGrid.innerHTML = '';
        
        this.artworks.forEach((artwork, index) => {
            const thumbnailItem = document.createElement('div');
            thumbnailItem.className = 'thumbnail-item';
            thumbnailItem.innerHTML = `
                <img src="${artwork.path}" alt="${artwork.description}" loading="lazy">
                <div class="thumbnail-overlay">${artwork.artist}</div>
            `;
            
            thumbnailItem.addEventListener('click', () => {
                this.showArtwork(index);
            });
            
            thumbnailGrid.appendChild(thumbnailItem);
        });
    }
    
    showArtwork(index) {
        if (index < 0 || index >= this.artworks.length) return;
        
        this.currentArtworkIndex = index;
        const artwork = this.artworks[index];
        
        // Update main display
        const artworkImage = document.getElementById('artworkImage');
        const artworkPlaceholder = document.getElementById('artworkPlaceholder');
        const artworkTitle = document.getElementById('artworkTitle');
        const artworkDescription = document.getElementById('artworkDescription');
        const artistName = document.getElementById('artistName');
        const artistHandle = document.getElementById('artistHandle');
        
        if (artworkImage && artworkPlaceholder) {
            artworkImage.src = artwork.path;
            artworkImage.style.display = 'block';
            artworkPlaceholder.style.display = 'none';
        }
        
        const artworkAuthor = document.getElementById('artworkAuthor');
        
        if (artworkAuthor) {
            artworkAuthor.innerHTML = `By <a href="${artwork.link}" target="_blank" class="artist-link">${artwork.artist}</a>`;
        }
        if (artworkDescription) {
            artworkDescription.textContent = artwork.description;
        }
        
        // Update active thumbnail
        document.querySelectorAll('.thumbnail-item').forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        
        // Only scroll to thumbnail if user has interacted with gallery
        if (this.hasUserInteractedWithGallery) {
            this.scrollToActiveThumbnail();
        }
        
        console.log(`🎨 Showing artwork ${index + 1}: ${artwork.description}`);
    }
    
    showRandomArtwork() {
        if (this.artworks.length === 0) return;
        
        // Initialize available indices if empty or if all artworks have been shown
        if (this.availableArtworkIndices.length === 0) {
            this.availableArtworkIndices = Array.from({length: this.artworks.length}, (_, i) => i);
        }
        
        // Get truly random index from available indices
        let randomIndex;
        if (window.crypto && window.crypto.getRandomValues) {
            const array = new Uint32Array(1);
            window.crypto.getRandomValues(array);
            randomIndex = array[0] % this.availableArtworkIndices.length;
        } else {
            randomIndex = Math.floor(Math.random() * this.availableArtworkIndices.length);
        }
        
        // Get the actual artwork index and remove it from available indices
        const artworkIndex = this.availableArtworkIndices.splice(randomIndex, 1)[0];
        this.showArtwork(artworkIndex);
    }

    showNextArtwork() {
        // For next button, use random selection
        this.showRandomArtwork();
    }
    
    scrollToActiveThumbnail() {
        const activeIndex = this.currentArtworkIndex;
        const thumbnailContainer = document.querySelector('.thumbnail-container');
        const activeThumbnail = document.querySelectorAll('.thumbnail-item')[activeIndex];
        
        if (thumbnailContainer && activeThumbnail) {
            // Scroll within the thumbnail container only, don't affect page scroll
            const containerRect = thumbnailContainer.getBoundingClientRect();
            const thumbnailRect = activeThumbnail.getBoundingClientRect();
            
            // Check if thumbnail is outside the visible area of the container
            if (thumbnailRect.left < containerRect.left || thumbnailRect.right > containerRect.right) {
                // Calculate scroll position to center the thumbnail
                const containerCenter = containerRect.width / 2;
                const thumbnailCenter = thumbnailRect.width / 2;
                const scrollLeft = thumbnailContainer.scrollLeft + (thumbnailRect.left - containerRect.left) - containerCenter + thumbnailCenter;
                
                thumbnailContainer.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
            }
        }
    }
    
    visitCurrentArtist() {
        if (this.artworks[this.currentArtworkIndex]) {
            const artwork = this.artworks[this.currentArtworkIndex];
            window.open(artwork.link, '_blank');
            this.showNotification('🎨 Visiting artist\'s link! Support our amazing creators!');
        }
    }
    
    updateArtworkStats() {
        const totalArtworks = this.artworks.length;
        const artworkCount = document.getElementById('artworkCount');
        if (artworkCount) {
            artworkCount.textContent = totalArtworks;
        }
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
        dreamApp.createRopeBlob();
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