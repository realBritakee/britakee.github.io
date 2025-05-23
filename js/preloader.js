// Preloader functionality for GTA 6 Countdown
// Handles loading screen with GTA 6 icon and smooth transition to main content

// Preloader elements
const preloader = document.getElementById('preloader');
const mainContent = document.getElementById('main-content');
const bgImageHome = document.getElementById('bg-imageHome');

// Track loading state
let assetsLoaded = false;
let minimumTimeElapsed = false;
let backgroundImagesLoaded = false;
let currentBackgroundImageIndex = 0;

// Minimum loading time to show the preloader (in milliseconds)
const MINIMUM_LOADING_TIME = 3000; // 3 seconds

// DISABLED: Background slideshow now handled by slideshow.js to avoid conflicts
// Background slideshow configuration removed

// DISABLED: Background slideshow state tracking removed

// Background images for preloading only (not for slideshow)
const backgroundImages = [
    './images/Backgrounds/People/Jason Duval/Jason_Duval_01.jpg',
    './images/Backgrounds/People/Lucia Caminos/Lucia_Caminos_01.jpg',
    './images/Backgrounds/Places/Vice City/Vice_City_01.jpg',
    './images/Backgrounds/Places/Leonida Keys/Leonida_Keys_01.jpg',
    './images/Backgrounds/People/Cal Hampton/Cal_Hampton_01.jpg',
    './images/Backgrounds/Places/Grassrivers/Grassrivers_01.jpg'
];

// Function to preload critical assets
function preloadAssets() {
    return new Promise((resolve) => {
        const imagesToPreload = [
            './images/rockstargames.gif',
            './images/PS5_logo.png',
            './images/Xbox_Series_X_S.png'
        ];
        
        let loadedCount = 0;
        const totalImages = imagesToPreload.length;
        
        if (totalImages === 0) {
            resolve();
            return;
        }
        
        imagesToPreload.forEach((src) => {
            const img = new Image();
            img.onload = img.onerror = () => {
                loadedCount++;
                console.log(`Loaded asset ${loadedCount}/${totalImages}: ${src}`);
                
                if (loadedCount === totalImages) {
                    assetsLoaded = true;
                    resolve();
                }
            };
            img.src = src;
        });
    });
}

// Function to preload background images
function preloadBackgroundImages() {
    return new Promise((resolve) => {
        let loadedCount = 0;
        const totalImages = backgroundImages.length;
        
        if (totalImages === 0) {
            backgroundImagesLoaded = true;
            resolve();
            return;
        }
        
        backgroundImages.forEach((src) => {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                console.log(`Loaded background ${loadedCount}/${totalImages}: ${src}`);
                
                if (loadedCount === totalImages) {
                    backgroundImagesLoaded = true;
                    resolve();
                }
            };
            img.onerror = () => {
                loadedCount++;
                console.log(`Failed to load background: ${src}`);
                
                if (loadedCount === totalImages) {
                    backgroundImagesLoaded = true;
                    resolve();
                }
            };
            img.src = src;
        });
    });
}

// Function to update loading progress text
function updateLoadingText() {
    const preloaderText = document.querySelector('.preloader-text');
    if (!preloaderText) return;
    
    const texts = [
        'Loading GTA VI Countdown...',
        'Preparing Vice City...',
        'Loading background images...',
        'Almost ready...'
    ];
    
    let textIndex = 0;
    const textInterval = setInterval(() => {
        if (textIndex < texts.length) {
            preloaderText.textContent = texts[textIndex];
            textIndex++;
        } else {
            clearInterval(textInterval);
        }
    }, 750);
    
    return textInterval;
}

// Function to show main content with smooth transition
function showMainContent() {
    console.log('Showing main content with smooth transition');
    
    // Fade out preloader
    preloader.classList.add('fade-out');
    
    // After preloader fade-out animation, show main content
    setTimeout(() => {
        preloader.style.display = 'none';
        mainContent.classList.add('show');
        
        // Background slideshow continues from preloader - no changes needed
        console.log('🎬 Main content displayed, background slideshow continues');
        
        // Signal that main content is ready for slideshow.js to take over
        window.mainContentReady = true;
        
        // Enable body scrolling
        document.body.style.overflow = '';
        
    }, 800); // Match CSS transition duration
}

// Function to check if ready to show main content
function checkReadyToShow() {
    if (assetsLoaded && minimumTimeElapsed && backgroundImagesLoaded) {
        showMainContent();
    }
}

// Function to initialize preloader
function initPreloader() {
    // Disable body scrolling during loading
    document.body.style.overflow = 'hidden';
    
    console.log('Preloader initialized');
    
    // Start background slideshow immediately during preloader
    setTimeout(() => {
        startPreloaderBackgroundSlideshow();
    }, 500); // Small delay to ensure elements are ready
    
    // Start loading text animation
    const textInterval = updateLoadingText();
    
    // Start preloading assets
    preloadAssets().then(() => {
        console.log('All assets preloaded');
        checkReadyToShow();
    });
    
    // Start preloading background images
    preloadBackgroundImages().then(() => {
        console.log('Background images preloaded');
        checkReadyToShow();
    });
    
    // Set minimum time timer
    setTimeout(() => {
        minimumTimeElapsed = true;
        console.log('Minimum loading time elapsed');
        checkReadyToShow();
    }, MINIMUM_LOADING_TIME);
    
    // Fallback: Show content after maximum time regardless of loading state
    setTimeout(() => {
        if (!mainContent.classList.contains('show')) {
            console.log('Fallback: Showing content after maximum wait time');
            showMainContent();
        }
    }, 8000); // 8 seconds maximum
}

// Function to handle fonts loading
function handleFontsLoading() {
    if ('fonts' in document) {
        document.fonts.ready.then(() => {
            console.log('Fonts loaded');
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting preloader');
    initPreloader();
    handleFontsLoading();
});

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible' && !mainContent.classList.contains('show')) {
        // If user comes back to tab and content isn't shown yet, check again
        setTimeout(checkReadyToShow, 100);
    }
});

// Export functions for debugging and external control
window.preloaderDebug = {
    showMainContent,
    checkReadyToShow,
    assetsLoaded: () => assetsLoaded,
    minimumTimeElapsed: () => minimumTimeElapsed
};

// DISABLED: Background slideshow controls moved to slideshow.js

// DISABLED: Keyboard controls and manual navigation functions moved to slideshow.js

// Function to start background slideshow during preloader
function startPreloaderBackgroundSlideshow() {
    if (!bgImageHome || backgroundImages.length === 0) {
        console.log('Background element not found or no images available');
        return;
    }

    let currentIndex = 0;
    
    // Ensure background stays behind preloader
    bgImageHome.style.zIndex = '-1';
    bgImageHome.style.position = 'fixed';
    
    // Set initial background immediately
    console.log('🎬 Starting background slideshow during preloader');
    bgImageHome.style.backgroundImage = `url('${backgroundImages[currentIndex]}')`;
    bgImageHome.style.backgroundSize = 'cover';
    bgImageHome.style.backgroundPosition = 'center';
    bgImageHome.style.backgroundRepeat = 'no-repeat';
    bgImageHome.style.opacity = '0.4';
    bgImageHome.style.transition = 'opacity 1200ms ease-in-out';
    
    // Update global index
    window.currentPreloaderIndex = currentIndex;
    
    // Start rotating backgrounds every 30 seconds during loading
    const preloaderSlideInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % backgroundImages.length;
        console.log(`🔄 Preloader: Switching to background ${currentIndex + 1}:`, backgroundImages[currentIndex]);
        
        // Update global index
        window.currentPreloaderIndex = currentIndex;
        
        // Smooth transition
        bgImageHome.style.opacity = '0';
        setTimeout(() => {
            bgImageHome.style.backgroundImage = `url('${backgroundImages[currentIndex]}')`;
            setTimeout(() => {
                bgImageHome.style.opacity = '0.4';
            }, 50);
        }, 600); // Half of 1200ms transition
        
    }, 30000); // 30 seconds
    
    // Store interval globally for slideshow.js to clear
    window.preloaderSlideInterval = preloaderSlideInterval;
    
    console.log('🎵 Preloader background slideshow started - changes every 30 seconds');
} 