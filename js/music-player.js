// GTA 6 Countdown - Background Music Player
// Plays the GTA VI trailer song automatically after loading screen

// Immediately remove any music control buttons on script load
(() => {
    const cleanup = () => {
        // Remove by ID
        const button = document.getElementById('music-control-button');
        if (button) {
            button.remove();
        }
        
        // Remove any button with music-related content
        document.querySelectorAll('button').forEach(btn => {
            const text = btn.textContent || btn.innerHTML || '';
            const style = window.getComputedStyle(btn);
            
            // Remove if contains music emojis or text
            if (text.includes('🎵') || 
                text.includes('PLAY MUSIC') || 
                text.includes('CLICK TO PLAY') ||
                text.toLowerCase().includes('music') ||
                text.toLowerCase().includes('audio')) {
                btn.remove();
                console.log('🗑️ Removed music-related button:', text);
            }
            
            // Remove fixed position buttons in corners
            if (style.position === 'fixed' && 
                ((style.top === '20px' && style.right === '20px') ||
                 style.top.includes('20px') || style.right.includes('20px'))) {
                btn.remove();
                console.log('🗑️ Removed corner button');
            }
        });
        
        // Also check for any elements with music-related styling
        document.querySelectorAll('[style*="background"][style*="gradient"][style*="orange"]').forEach(el => {
            if (el.tagName === 'BUTTON' || el.onclick) {
                el.remove();
                console.log('🗑️ Removed orange gradient element');
            }
        });
    };
    
    // Run cleanup immediately and every 100ms for first 2 seconds
    cleanup();
    const cleanupInterval = setInterval(cleanup, 100);
    setTimeout(() => clearInterval(cleanupInterval), 2000);
    
    // Add MutationObserver to watch for new buttons being added
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Check if the added node is a button with music content
                    if (node.tagName === 'BUTTON') {
                        const text = node.textContent || node.innerHTML || '';
                        if (text.includes('🎵') || 
                            text.includes('PLAY MUSIC') || 
                            text.includes('CLICK TO PLAY') ||
                            text.toLowerCase().includes('music')) {
                            node.remove();
                            console.log('🗑️ Observer removed new music button:', text);
                        }
                    }
                    
                    // Check for buttons within the added node
                    if (node.querySelectorAll) {
                        node.querySelectorAll('button').forEach(btn => {
                            const text = btn.textContent || btn.innerHTML || '';
                            if (text.includes('🎵') || 
                                text.includes('PLAY MUSIC') || 
                                text.includes('CLICK TO PLAY') ||
                                text.toLowerCase().includes('music')) {
                                btn.remove();
                                console.log('🗑️ Observer removed nested music button:', text);
                            }
                        });
                    }
                }
            });
        });
    });
    
    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Stop observing after 10 seconds
    setTimeout(() => observer.disconnect(), 10000);
})();

class BackgroundMusicPlayer {
    constructor() {
        this.audio = document.getElementById('background-music');
        this.isPlaying = false;
        this.hasStarted = false;
        
        this.init();
    }

    init() {
        if (!this.audio) {
            console.log('❌ Background music audio element not found');
            return;
        }

        // Set audio properties for seamless looping
        this.audio.volume = 0.3; // Start at 30% volume
        this.audio.loop = true;
        this.audio.preload = 'auto';
        
        // Wait for main content to be shown before starting music
        this.waitForMainContent();
        
        // Add event listeners
        this.setupEventListeners();
        
        console.log('🎵 Background music player initialized');
    }

    waitForMainContent() {
        // Check if main content is already visible
        const mainContent = document.getElementById('main-content');
        if (mainContent && mainContent.classList.contains('show')) {
            this.startMusic();
            return;
        }

        // Otherwise wait for the main content to be shown
        const checkInterval = setInterval(() => {
            if (window.mainContentReady || (mainContent && mainContent.classList.contains('show'))) {
                clearInterval(checkInterval);
                // Add a small delay to let the transition finish
                setTimeout(() => {
                    this.startMusic();
                }, 1000);
            }
        }, 100);

        // Fallback timeout
        setTimeout(() => {
            clearInterval(checkInterval);
            if (!this.hasStarted) {
                this.startMusic();
            }
        }, 10000);
    }

    async startMusic() {
        if (this.hasStarted || !this.audio) {
            console.log('🔇 Cannot start music:', this.hasStarted ? 'Already started' : 'No audio element');
            return;
        }

        console.log('🎵 Attempting to start background music...');
        console.log('🎵 Audio source:', this.audio.src || this.audio.currentSrc);
        console.log('🎵 Audio ready state:', this.audio.readyState);

        try {
            // Ensure audio is loaded
            if (this.audio.readyState < 2) {
                console.log('🎵 Waiting for audio to load...');
                await new Promise((resolve) => {
                    const onCanPlay = () => {
                        this.audio.removeEventListener('canplaythrough', onCanPlay);
                        resolve();
                    };
                    this.audio.addEventListener('canplaythrough', onCanPlay);
                    this.audio.load(); // Force reload
                });
            }

            // Fade in the music
            this.audio.volume = 0;
            await this.audio.play();
            this.isPlaying = true;
            this.hasStarted = true;
            
            // Gradually fade in the volume
            this.fadeIn();
            
            console.log('🎵 Background music started playing successfully!');
        } catch (error) {
            console.log('🔇 Autoplay blocked - will start on user interaction');
            // Setup invisible interaction fallback - no buttons or visual indicators
            this.setupAutoplayFallback();
        }
    }

    fadeIn() {
        const targetVolume = 0.3;
        const fadeDuration = 2000; // 2 seconds
        const steps = 50;
        const volumeStep = targetVolume / steps;
        const timeStep = fadeDuration / steps;

        let currentStep = 0;
        const fadeInterval = setInterval(() => {
            if (currentStep >= steps || !this.audio) {
                clearInterval(fadeInterval);
                return;
            }

            this.audio.volume = Math.min(volumeStep * currentStep, targetVolume);
            currentStep++;
        }, timeStep);
    }

    setupAutoplayFallback() {
        // Try to start music on first user interaction
        const startOnInteraction = async () => {
            if (this.hasStarted) return;

            try {
                await this.startMusic();
                // Remove listeners after successful start
                document.removeEventListener('click', startOnInteraction);
                document.removeEventListener('keydown', startOnInteraction);
                document.removeEventListener('scroll', startOnInteraction);
            } catch (error) {
                console.log('🔇 Still cannot play music:', error.message);
            }
        };

        document.addEventListener('click', startOnInteraction, { once: false });
        document.addEventListener('keydown', startOnInteraction, { once: false });
        document.addEventListener('scroll', startOnInteraction, { once: false });
        
        console.log('🎵 Autoplay fallback listeners added - music will start on user interaction');
    }

    setupEventListeners() {
        if (!this.audio) return;

        this.audio.addEventListener('loadstart', () => {
            console.log('🎵 Background music loading started');
        });

        this.audio.addEventListener('loadedmetadata', () => {
            console.log('🎵 Background music metadata loaded');
            console.log('🎵 Duration:', this.audio.duration, 'seconds');
        });

        this.audio.addEventListener('canplay', () => {
            console.log('🎵 Background music ready to play');
            console.log('🎵 Ready state:', this.audio.readyState);
        });

        this.audio.addEventListener('canplaythrough', () => {
            console.log('🎵 Background music can play through completely');
        });

        this.audio.addEventListener('play', () => {
            console.log('🎵 Background music started playing');
        });

        this.audio.addEventListener('pause', () => {
            console.log('🎵 Background music paused');
        });

        this.audio.addEventListener('ended', () => {
            console.log('🎵 Background music ended (though it should loop)');
        });

        this.audio.addEventListener('error', (e) => {
            console.log('❌ Background music error:', e);
            console.log('❌ Error details:', {
                code: e.target?.error?.code,
                message: e.target?.error?.message,
                src: this.audio.src || this.audio.currentSrc
            });
        });

        this.audio.addEventListener('stalled', () => {
            console.log('🔄 Background music loading stalled');
        });

        this.audio.addEventListener('waiting', () => {
            console.log('⏳ Background music waiting for data');
        });

        // Test audio loading immediately
        console.log('🎵 Testing audio file access...');
        console.log('🎵 Audio source:', this.audio.src || this.audio.currentSrc);
        console.log('🎵 Audio element:', this.audio);
    }

    // Public methods for external control
    pause() {
        if (this.audio && this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
            console.log('🎵 Background music paused');
        }
    }

    resume() {
        if (this.audio && !this.isPlaying && this.hasStarted) {
            this.audio.play();
            this.isPlaying = true;
            console.log('🎵 Background music resumed');
        }
    }

    setVolume(volume) {
        if (this.audio) {
            this.audio.volume = Math.max(0, Math.min(1, volume));
            console.log(`🎵 Background music volume set to ${Math.round(volume * 100)}%`);
        }
    }
}

// Initialize the background music player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Remove any existing music control button (in case of browser cache)
    const existingButton = document.getElementById('music-control-button');
    if (existingButton) {
        existingButton.remove();
        console.log('🗑️ Removed cached music control button');
    }
    
    // Also remove any buttons in top-right corner that might be music controls
    const topRightButtons = document.querySelectorAll('button[style*="position: fixed"][style*="top:"]');
    topRightButtons.forEach(button => {
        if (button.style.position === 'fixed' && 
            (button.style.top.includes('20px') || button.style.right.includes('20px'))) {
            button.remove();
            console.log('🗑️ Removed potential cached music button');
        }
    });
    
    window.backgroundMusicPlayer = new BackgroundMusicPlayer();
});

// Handle page visibility change - pause music when tab is hidden
document.addEventListener('visibilitychange', () => {
    if (window.backgroundMusicPlayer) {
        if (document.visibilityState === 'hidden') {
            window.backgroundMusicPlayer.pause();
        } else if (document.visibilityState === 'visible') {
            window.backgroundMusicPlayer.resume();
        }
    }
});

console.log('🎬 Background music player module loaded'); 