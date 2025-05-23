// GTA 6 Countdown - Rockstar-Style Scroll Animations
// Inspired by the official Rockstar Games GTA VI website

class ScrollAnimations {
    constructor() {
        this.elements = [];
        this.bgImage = document.getElementById('bg-imageHome');
        this.countdownSection = document.getElementById('countdown');
        this.mainContent = document.querySelector('.main-content');
        
        this.init();
    }

    init() {
        // Wait for content to be loaded
        window.addEventListener('load', () => {
            this.setupScrollListener();
        });
    }

    setupScrollListener() {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateAnimations();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Initial call
        this.updateAnimations();
    }

    updateAnimations() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Background image fade animation
        this.animateBackground(scrollY, windowHeight);
        
        // Countdown section fade and scale animation
        this.animateCountdownSection(scrollY, windowHeight);

        this.elements.forEach(item => {
            if (!item.element) return;

            const rect = item.element.getBoundingClientRect();
            const elementTop = rect.top + scrollY;
            const elementHeight = rect.height;
            
            // Calculate scroll progress for this element
            const startTrigger = elementTop - windowHeight;
            const endTrigger = elementTop + elementHeight;
            const totalDistance = endTrigger - startTrigger;
            const currentProgress = Math.max(0, Math.min(1, (scrollY - startTrigger) / totalDistance));

            this.applyTransform(item, currentProgress);
        });
    }

    animateBackground(scrollY, windowHeight) {
        if (!this.bgImage) return;

        // Keep background always visible - no fade out
        // The overlay gradient handles the visual transition
        this.bgImage.style.opacity = 0.4; // Always maintain original opacity
    }

    animateCountdownSection(scrollY, windowHeight) {
        if (!this.countdownSection) return;

        // Target only the content inside the countdown section, not the background
        const countdownContent = this.countdownSection.querySelector('.content');
        if (!countdownContent) return;

        const sectionRect = this.countdownSection.getBoundingClientRect();
        const sectionTop = sectionRect.top + scrollY;
        const sectionHeight = sectionRect.height;
        const sectionCenter = sectionTop + (sectionHeight / 2);
        
        // Calculate if section is centered in viewport
        const viewportCenter = scrollY + (windowHeight / 2);
        const distanceFromCenter = Math.abs(viewportCenter - sectionCenter);
        
        // Much wider threshold for ultra-smooth step-by-step scaling
        const scaleThreshold = windowHeight * 0.7; // 70% of viewport height for very gradual transitions
        
        let opacity, scale;
        
        if (distanceFromCenter <= scaleThreshold) {
            // Section is near center - ultra smooth linear scaling
            const centerProgress = 1 - (distanceFromCenter / scaleThreshold);
            
            // Use simple linear progress for perfectly smooth animation - no easing to prevent jumps
            // More subtle ranges for smoother transitions
            opacity = 0.75 + (0.25 * centerProgress); // Range from 75% to 100% opacity (linear)
            scale = 0.92 + (0.16 * centerProgress); // Range from 92% to 108% scale (linear)
        } else {
            // Section is far from center - minimum values
            opacity = 0.75;
            scale = 0.92; // Smaller scale when not centered
        }
        
        // Apply smooth scroll-driven animation without CSS transitions to prevent jumping
        countdownContent.style.transition = 'none';
        countdownContent.style.opacity = opacity;
        countdownContent.style.transform = `scale(${scale})`;
        countdownContent.style.transformOrigin = 'center center';
    }

    registerElements() {
        // Register elements for scroll animations
        this.elements = [
            {
                element: document.querySelector('h1'),
                type: 'hero-title',
                startScale: 1,
                endScale: 0.8,
                startOpacity: 1,
                endOpacity: 0.7
            },
            {
                element: document.querySelector('.countdown'),
                type: 'countdown',
                startScale: 1,
                endScale: 0.9,
                startY: 0,
                endY: -20
            },
            {
                element: document.querySelector('.hero-release-section'),
                type: 'hero-release',
                startScale: 0.9,
                endScale: 1,
                startOpacity: 0.8,
                endOpacity: 1
            },
            {
                element: document.querySelector('.platform-section'),
                type: 'platform',
                startScale: 0.9,
                endScale: 1,
                startOpacity: 0.7,
                endOpacity: 1
            },
            {
                element: document.querySelector('.trailer-hero-section'),
                type: 'trailer-hero',
                startScale: 0.8,
                endScale: 1.1,
                startOpacity: 0.8,
                endOpacity: 1
            },
            {
                element: document.querySelector('.interaction-container'),
                type: 'interaction',
                startScale: 0.95,
                endScale: 1,
                startOpacity: 0.8,
                endOpacity: 1
            }
        ].filter(item => item.element); // Remove null elements
    }

    bindEvents() {
        // Throttled scroll event for performance
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateAnimations();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Update on resize
        window.addEventListener('resize', () => {
            this.updateAnimations();
        });
    }

    applyTransform(item, progress) {
        const element = item.element;
        let transform = '';
        let opacity = 1;

        // Scale animation
        if (item.startScale !== undefined && item.endScale !== undefined) {
            const scale = this.lerp(item.startScale, item.endScale, progress);
            transform += `scale(${scale}) `;
        }

        // Y translation animation
        if (item.startY !== undefined && item.endY !== undefined) {
            const translateY = this.lerp(item.startY, item.endY, progress);
            transform += `translateY(${translateY}px) `;
        }

        // Opacity animation
        if (item.startOpacity !== undefined && item.endOpacity !== undefined) {
            opacity = this.lerp(item.startOpacity, item.endOpacity, progress);
        }

        // Apply specific animations based on element type
        switch (item.type) {
            case 'hero-title':
                // Epic title zoom-out effect like Rockstar
                const heroScale = 1 - (progress * 0.3);
                transform = `scale(${heroScale}) translateY(${progress * -30}px)`;
                opacity = 1 - (progress * 0.4);
                break;

            case 'countdown':
                // Countdown scaling completely disabled - now handled by center-based animation only
                break;

            case 'trailer-hero':
                // Trailer section zooms in dramatically
                const trailerScale = 0.8 + (progress * 0.4);
                transform = `scale(${trailerScale})`;
                opacity = 0.7 + (progress * 0.3);
                break;

            case 'platform':
                // Platform section slides up and scales
                const platformScale = 0.9 + (progress * 0.1);
                transform = `scale(${platformScale}) translateY(${(1 - progress) * 20}px)`;
                break;
        }

        // Apply the transformations
        element.style.transform = transform;
        element.style.opacity = opacity;
        element.style.transition = 'none'; // Disable CSS transitions for smooth scroll
    }

    // Linear interpolation function
    lerp(start, end, progress) {
        return start + (end - start) * progress;
    }

    // Easing function for smoother animations
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    easeInOutQuart(t) {
        return t < 0.5 ? 16 * t * t * t * t : 1 - 16 * Math.pow(t - 1, 4);
    }
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimations();
}); 