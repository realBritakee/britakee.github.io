// GTA 6 Trailer Selector
// Handles switching between different trailers with smooth animations

class TrailerSelector {
    constructor() {
        this.currentTrailer = 2; // Start with latest trailer (Trailer 2)
        this.isAnimating = false; // Prevent rapid clicking during animations
        this.trailers = {
            1: {
                title: 'Watch Trailer 1',
                embedUrl: 'https://www.youtube.com/embed/QdBZY2fkU-0?si=BWT8GHM0SybLgzR0'
            },
            2: {
                title: 'Watch Trailer 2',
                embedUrl: 'https://www.youtube.com/embed/VQRLujxTm3c?si=_9S29SixbMQGLSzb'
            }
        };
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupTrailer());
        } else {
            this.setupTrailer();
        }
    }

    setupTrailer() {
        // Set initial trailer (Trailer 2)
        this.updateTrailer(false); // No animation on initial load
        console.log('🎬 Trailer selector initialized with Trailer 2');
    }

    switchTrailer(direction) {
        // Prevent rapid clicking during animations
        if (this.isAnimating) return;
        
        if (direction === 'next') {
            this.currentTrailer = this.currentTrailer === 2 ? 1 : 2;
        } else if (direction === 'prev') {
            this.currentTrailer = this.currentTrailer === 1 ? 2 : 1;
        }
        
        this.updateTrailer(true); // With animation
    }

    updateTrailer(withAnimation = true) {
        const trailer = this.trailers[this.currentTrailer];
        const iframe = document.getElementById('trailer-iframe');
        const subtitle = document.getElementById('trailer-subtitle');
        const container = document.querySelector('.trailer-hero-container');

        if (withAnimation) {
            this.animateTrailerSwitch(iframe, subtitle, trailer);
        } else {
            // Initial setup without animation
            if (iframe) iframe.src = trailer.embedUrl;
            if (subtitle) subtitle.textContent = trailer.title;
        }
    }

    animateTrailerSwitch(iframe, subtitle, trailer) {
        this.isAnimating = true;
        const container = document.querySelector('.trailer-hero-container');

        // Phase 1: Fade out and scale down
        if (container) {
            container.style.transition = 'all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)';
            container.style.transform = 'scale(0.95) translateY(10px)';
            container.style.opacity = '0.3';
            container.style.filter = 'blur(2px)';
        }

        // Phase 2: Update subtitle with fade effect
        if (subtitle) {
            subtitle.style.transition = 'all 0.3s ease-out';
            subtitle.style.opacity = '0.5';
            subtitle.style.transform = 'translateY(-5px)';
            
            setTimeout(() => {
                subtitle.textContent = trailer.title;
                subtitle.style.opacity = '1';
                subtitle.style.transform = 'translateY(0)';
            }, 200);
        }

        // Phase 3: Update iframe source
        setTimeout(() => {
            if (iframe) {
                iframe.src = trailer.embedUrl;
            }
        }, 300);

        // Phase 4: Fade in and scale back to normal
        setTimeout(() => {
            if (container) {
                container.style.transform = 'scale(1) translateY(0)';
                container.style.opacity = '1';
                container.style.filter = 'blur(0px)';
            }
        }, 400);

        // Phase 5: Add a subtle "pop" effect at the end
        setTimeout(() => {
            if (container) {
                container.style.transition = 'all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                container.style.transform = 'scale(1.02)';
                
                setTimeout(() => {
                    container.style.transform = 'scale(1)';
                    this.isAnimating = false; // Re-enable clicking
                }, 150);
            }
        }, 600);

        console.log(`🔄 Switched to ${trailer.title}`);
    }

    // Add visual feedback for button interactions
    animateButton(button) {
        if (!button) return;
        
        button.style.transition = 'all 0.15s ease-out';
        button.style.transform = 'scale(0.95)';
        button.style.opacity = '0.8';
        
        setTimeout(() => {
            button.style.transform = 'scale(1.05)';
            button.style.opacity = '1';
            
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
        }, 75);
    }
}

// Enhanced global function for button onclick with button animation
function switchTrailer(direction) {
    if (window.trailerSelector) {
        // Find and animate the clicked button
        const button = event.target.closest('.trailer-arrow');
        if (button && window.trailerSelector.animateButton) {
            window.trailerSelector.animateButton(button);
        }
        
        window.trailerSelector.switchTrailer(direction);
    }
}

// Initialize trailer selector
window.trailerSelector = new TrailerSelector(); 