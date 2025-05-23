// GTA 6 Countdown - Background Music Player
// Plays the GTA VI trailer song automatically after loading screen

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

        // Set audio properties
        this.audio.volume = 0.3; // Start at 30% volume
        this.audio.loop = true;
        
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
            console.log('🔇 Autoplay blocked - user interaction required:', error.message);
            // Create a play button for user interaction
            this.createPlayButton();
            // Also setup general interaction fallback
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
                console.log('🎵 User interaction detected, trying to start music...');
                await this.startMusic();
                // Remove listeners after successful start
                document.removeEventListener('click', startOnInteraction);
                document.removeEventListener('keydown', startOnInteraction);
                document.removeEventListener('scroll', startOnInteraction);
                // Remove play button if it exists
                this.removePlayButton();
            } catch (error) {
                console.log('🔇 Still cannot play music:', error.message);
            }
        };

        document.addEventListener('click', startOnInteraction, { once: false });
        document.addEventListener('keydown', startOnInteraction, { once: false });
        document.addEventListener('scroll', startOnInteraction, { once: false });
        
        console.log('🎵 Autoplay fallback listeners added - music will start on user interaction');
    }

    createPlayButton() {
        // Don't create multiple buttons
        if (document.getElementById('music-play-button')) return;

        const button = document.createElement('button');
        button.id = 'music-play-button';
        button.innerHTML = '🎵 Click to Play Music';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffa726 100%);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            font-family: 'Hitmarker', Arial, sans-serif;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
        `;

        button.addEventListener('mouseover', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)';
        });

        button.addEventListener('mouseout', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.3)';
        });

        button.addEventListener('click', async () => {
            try {
                console.log('🎵 Play button clicked');
                button.innerHTML = '🎵 Starting...';
                button.disabled = true;
                
                // Force start music
                this.hasStarted = false; // Reset to allow restart
                await this.startMusic();
                
                this.removePlayButton();
            } catch (error) {
                console.log('🔇 Manual play failed:', error.message);
                button.innerHTML = '❌ Failed to Play';
                setTimeout(() => {
                    button.innerHTML = '🎵 Click to Play Music';
                    button.disabled = false;
                }, 2000);
            }
        });

        document.body.appendChild(button);
        console.log('🎵 Play button created');
    }

    removePlayButton() {
        const button = document.getElementById('music-play-button');
        if (button) {
            button.remove();
            console.log('🎵 Play button removed');
        }
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