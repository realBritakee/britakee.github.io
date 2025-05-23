// Enhanced Timings functionality for GTA 6 Countdown
// Handles animated toggle between trailer view and timing information

class TimingsManager {
    constructor() {
        this.isTimingsVisible = false;
        this.isAnimating = false;
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupTimings());
        } else {
            this.setupTimings();
        }
    }

    setupTimings() {
        this.createTimingsDisplay();
        this.setupButton();
        this.updateTimingInfo();
        console.log('🕐 Timings manager initialized');
    }

    createTimingsDisplay() {
        // Create a dedicated timings container that replaces the trailer
        const trailerContainer = document.querySelector('.trailer-hero-container');
        if (!trailerContainer) return;

        const timingsContainer = document.createElement('div');
        timingsContainer.className = 'timings-display-container';
        timingsContainer.style.display = 'none';
        
        // Insert after trailer container
        trailerContainer.parentNode.insertBefore(timingsContainer, trailerContainer.nextSibling);
    }

    setupButton() {
        const button = document.getElementById('show-timings-btn');
        if (!button) return;

        // Update button content
        this.updateButtonContent(button);

        // Add click handler
        button.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleTimings();
        });
    }

    updateButtonContent(button) {
        const icon = button.querySelector('.button-icon');
        const text = button.querySelector('span');
        
        if (this.isTimingsVisible) {
            if (text) text.textContent = 'Show Trailer';
            // Change icon to play/video icon
            if (icon) {
                icon.innerHTML = `<path d="M8 5v14l11-7z"/>`;
            }
        } else {
            if (text) text.textContent = 'Show Timings';
            // Keep clock icon
            if (icon) {
                icon.innerHTML = `<path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8 s8,3.59,8,8S16.41,20,12,20z M12.5,7H11v6l5.25,3.15l0.75-1.23l-4.5-2.67V7z"/>`;
            }
        }
    }

    toggleTimings() {
        if (this.isAnimating) return;
        
        this.isTimingsVisible = !this.isTimingsVisible;
        
        if (this.isTimingsVisible) {
            this.showTimingsWithAnimation();
        } else {
            this.showTrailerWithAnimation();
        }
    }

    showTimingsWithAnimation() {
        this.isAnimating = true;
        const trailerContainer = document.querySelector('.trailer-hero-container');
        const timingsContainer = document.querySelector('.timings-display-container');
        const button = document.getElementById('show-timings-btn');

        // Phase 1: Fade out trailer
        if (trailerContainer) {
            trailerContainer.style.transition = 'all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)';
            trailerContainer.style.transform = 'scale(0.95) translateY(10px)';
            trailerContainer.style.opacity = '0.3';
            trailerContainer.style.filter = 'blur(2px)';
        }

        // Phase 2: Update button text
        setTimeout(() => {
            this.updateButtonContent(button);
            this.animateButton(button);
        }, 200);

        // Phase 3: Hide trailer, show timings
        setTimeout(() => {
            if (trailerContainer) trailerContainer.style.display = 'none';
            if (timingsContainer) {
                timingsContainer.style.display = 'block';
                timingsContainer.style.opacity = '0';
                timingsContainer.style.transform = 'scale(0.95) translateY(10px)';
                timingsContainer.style.filter = 'blur(2px)';
            }
        }, 300);

        // Phase 4: Fade in timings
        setTimeout(() => {
            if (timingsContainer) {
                timingsContainer.style.transition = 'all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)';
                timingsContainer.style.transform = 'scale(1) translateY(0)';
                timingsContainer.style.opacity = '1';
                timingsContainer.style.filter = 'blur(0px)';
            }
        }, 400);

        // Phase 5: Subtle pop effect
        setTimeout(() => {
            if (timingsContainer) {
                timingsContainer.style.transition = 'all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                timingsContainer.style.transform = 'scale(1.02)';
                
                setTimeout(() => {
                    timingsContainer.style.transform = 'scale(1)';
                    this.isAnimating = false;
                }, 150);
            }
        }, 600);

        console.log('🕐 Switched to timings view');
    }

    showTrailerWithAnimation() {
        this.isAnimating = true;
        const trailerContainer = document.querySelector('.trailer-hero-container');
        const timingsContainer = document.querySelector('.timings-display-container');
        const button = document.getElementById('show-timings-btn');

        // Phase 1: Fade out timings
        if (timingsContainer) {
            timingsContainer.style.transition = 'all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)';
            timingsContainer.style.transform = 'scale(0.95) translateY(10px)';
            timingsContainer.style.opacity = '0.3';
            timingsContainer.style.filter = 'blur(2px)';
        }

        // Phase 2: Update button text
        setTimeout(() => {
            this.updateButtonContent(button);
            this.animateButton(button);
        }, 200);

        // Phase 3: Hide timings, show trailer
        setTimeout(() => {
            if (timingsContainer) timingsContainer.style.display = 'none';
            if (trailerContainer) {
                trailerContainer.style.display = 'block';
                trailerContainer.style.opacity = '0';
                trailerContainer.style.transform = 'scale(0.95) translateY(10px)';
                trailerContainer.style.filter = 'blur(2px)';
            }
        }, 300);

        // Phase 4: Fade in trailer
        setTimeout(() => {
            if (trailerContainer) {
                trailerContainer.style.transition = 'all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)';
                trailerContainer.style.transform = 'scale(1) translateY(0)';
                trailerContainer.style.opacity = '1';
                trailerContainer.style.filter = 'blur(0px)';
            }
        }, 400);

        // Phase 5: Subtle pop effect
        setTimeout(() => {
            if (trailerContainer) {
                trailerContainer.style.transition = 'all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                trailerContainer.style.transform = 'scale(1.02)';
                
                setTimeout(() => {
                    trailerContainer.style.transform = 'scale(1)';
                    this.isAnimating = false;
                }, 150);
            }
        }, 600);

        console.log('🎬 Switched to trailer view');
    }

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

    updateTimingInfo() {
        const timingsContainer = document.querySelector('.timings-display-container');
        if (!timingsContainer) return;
        
        // Calculate release date in different timezones
        const releaseDate = new Date("May 26, 2026 00:00:00 UTC-4");
        
        // Get user's timezone
        const userTimezone = this.getUserTimezone();
        const userLocalTime = releaseDate.toLocaleString('en-US', { 
            timeZone: userTimezone,
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        });

        // Create beautiful timing display
        timingsContainer.innerHTML = `
            <div class="timings-content">
                <h3 class="timings-title">🗓️ GTA VI Release Schedule</h3>
                <div class="primary-timing">
                    <div class="main-date">Tuesday, May 26, 2026</div>
                    <div class="main-time">12:00 AM Eastern (UTC-4)</div>
                </div>
                
                <div class="user-timing">
                    <h4>📍 Your Local Time</h4>
                    <div class="user-time">${userLocalTime}</div>
                </div>
                
                <div class="worldwide-timings">
                    <h4>🌍 Worldwide Release Times</h4>
                    <div class="timezone-grid">
                        <div class="timezone-item">
                            <span class="flag">🇺🇸</span>
                            <span class="zone">EST</span>
                            <span class="time">${releaseDate.toLocaleString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div class="timezone-item">
                            <span class="flag">🇺🇸</span>
                            <span class="zone">PST</span>
                            <span class="time">${releaseDate.toLocaleString('en-US', { timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div class="timezone-item">
                            <span class="flag">🇬🇧</span>
                            <span class="zone">GMT</span>
                            <span class="time">${releaseDate.toLocaleString('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div class="timezone-item">
                            <span class="flag">🇩🇪</span>
                            <span class="zone">CET</span>
                            <span class="time">${releaseDate.toLocaleString('en-DE', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div class="timezone-item">
                            <span class="flag">🇯🇵</span>
                            <span class="zone">JST</span>
                            <span class="time">${releaseDate.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div class="timezone-item">
                            <span class="flag">🇦🇺</span>
                            <span class="zone">AEST</span>
                            <span class="time">${releaseDate.toLocaleString('en-AU', { timeZone: 'Australia/Sydney', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getUserTimezone() {
        try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch (error) {
            console.error('Could not detect user timezone:', error);
            return 'UTC';
        }
    }
}

// Initialize timings manager
window.timingsManager = new TimingsManager(); 