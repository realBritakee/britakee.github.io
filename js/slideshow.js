// GTA 6 Background Slideshow
// Cycles through all character and location images from Backgrounds/People and Backgrounds/Places folders

// Configuration
const SLIDESHOW_CONFIG = {
    changeInterval: 30000, // 30 seconds per image
    fadeTransition: 1200,  // 1.2 second fade transition (reduced for snappier response)
    enablePreloader: true, // Preload next images
    enableKeyboardControls: true, // Allow manual navigation
    syncWithCountdown: false // Disabled - use simple interval instead
};

// Image folder structure
const IMAGE_FOLDERS = {
    people: [
        'Jason Duval',
        'Lucia Caminos', 
        'Cal Hampton',
        'Boobie Ike',
        'DreQuan Priest',
        'Real Dimez',
        'Raul Bautista',
        'Brian Heder'
    ],
    places: [
        'Vice City',
        'Leonida Keys',
        'Grassrivers', 
        'Port Gellhorn',
        'Ambrosia',
        'Mount Kalaga National Park'
    ]
};

// Common image file extensions (prioritizing PNG as requested)
const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'gif'];

// Slideshow state
let currentImageIndex = 0;
let allImages = [];
let preloadedImages = new Map();
let slideshowInterval = null;
let isInitialized = false;
let lastCountdownSync = null;
let recentImages = []; // Track recently shown images to avoid repetition
let randomSequence = []; // Pre-calculated random sequence for faster navigation
let randomSequenceIndex = 0;

// Discover all images in the folders
async function discoverImages() {
    const discoveredImages = [];
    
    console.log('Starting image discovery in Backgrounds folder...');
    
    // Try to discover images from Backgrounds/People folders
    for (const person of IMAGE_FOLDERS.people) {
        console.log(`Scanning Backgrounds/People/${person}...`);
        const personImages = await discoverImagesInFolder(`./images/Backgrounds/People/${person}`);
        console.log(`Found ${personImages.length} images in Backgrounds/People/${person}:`, personImages);
        discoveredImages.push(...personImages);
    }
    
    // Try to discover images from Backgrounds/Places folders
    for (const place of IMAGE_FOLDERS.places) {
        console.log(`Scanning Backgrounds/Places/${place}...`);
        const placeImages = await discoverImagesInFolder(`./images/Backgrounds/Places/${place}`);
        console.log(`Found ${placeImages.length} images in Backgrounds/Places/${place}:`, placeImages);
        discoveredImages.push(...placeImages);
    }
    
    console.log(`Total images discovered: ${discoveredImages.length}`);
    
    // Add detailed summary
    console.log('\n📋 DISCOVERY SUMMARY:');
    console.log('='.repeat(50));
    
    // Show images per folder
    for (const person of IMAGE_FOLDERS.people) {
        const folderImages = discoveredImages.filter(img => img.includes(`/People/${person}/`));
        console.log(`👤 ${person}: ${folderImages.length} images`);
        if (folderImages.length > 0) {
            folderImages.forEach(img => console.log(`    - ${img.split('/').pop()}`));
        }
    }
    
    for (const place of IMAGE_FOLDERS.places) {
        const folderImages = discoveredImages.filter(img => img.includes(`/Places/${place}/`));
        console.log(`🏙️ ${place}: ${folderImages.length} images`);
        if (folderImages.length > 0) {
            folderImages.forEach(img => console.log(`    - ${img.split('/').pop()}`));
        }
    }
    
    console.log('='.repeat(50));
    console.log(`🎯 TOTAL: ${discoveredImages.length} images ready for slideshow`);
    console.log('⚡ Manual controls: Left/Right arrows (random), Spacebar (random)');
    console.log('🔄 Auto slideshow: Sequential (every 30s) to ensure all images are shown');
    
    return discoveredImages;
}

// Discover images in a specific folder
async function discoverImagesInFolder(folderPath) {
    const images = [];
    const folderName = folderPath.split('/').pop();
    const folderNameUnderscore = folderName.replace(/\s+/g, '_');
    
    console.log(`🔍 Scanning folder: ${folderName}`);
    
    // Primary pattern that matches user's exact file structure
    const primaryPatterns = [];
    
    // Try the exact naming pattern: FolderName_01.jpg, FolderName_02.jpg, etc.
    for (let i = 1; i <= 15; i++) {
        primaryPatterns.push(`${folderNameUnderscore}_${String(i).padStart(2, '0')}.jpg`);
        primaryPatterns.push(`${folderNameUnderscore}_${i}.jpg`);
    }
    
    // Secondary fallback patterns
    const fallbackPatterns = [
        // Try numbered files (1-20 for comprehensive coverage)
        ...Array.from({length: 20}, (_, i) => `${i + 1}.jpg`),
        ...Array.from({length: 20}, (_, i) => `${String(i + 1).padStart(2, '0')}.jpg`),
        
        // Try other extensions with the main pattern
        ...Array.from({length: 10}, (_, i) => `${folderNameUnderscore}_${String(i + 1).padStart(2, '0')}.png`),
        ...Array.from({length: 10}, (_, i) => `${folderNameUnderscore}_${String(i + 1).padStart(2, '0')}.webp`),
    ];
    
    // Test primary patterns first
    console.log(`  🎯 Testing primary pattern: ${folderNameUnderscore}_XX.jpg`);
    for (const pattern of primaryPatterns) {
        const imagePath = `${folderPath}/${pattern}`;
        const exists = await imageExists(imagePath);
        if (exists) {
            images.push(imagePath);
            console.log(`  ✅ Found: ${pattern}`);
        }
    }
    
    // If no primary patterns found, try fallbacks
    if (images.length === 0) {
        console.log(`  🔄 No primary patterns found, trying fallbacks...`);
        for (const pattern of fallbackPatterns) {
            const imagePath = `${folderPath}/${pattern}`;
            const exists = await imageExists(imagePath);
            if (exists) {
                images.push(imagePath);
                console.log(`  ✅ Found (fallback): ${pattern}`);
            }
        }
    }
    
    console.log(`  📊 Total found in ${folderName}: ${images.length} images`);
    return images;
}

// Check if an image exists by trying to load it
function imageExists(imagePath) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = imagePath;
        
        // Timeout after 1 second (faster discovery)
        setTimeout(() => resolve(false), 1000);
    });
}

// Generate pre-calculated random sequence for smooth navigation
function generateRandomSequence() {
    if (allImages.length <= 1) return;
    
    // Create a sequence that cycles through all images in random order
    // We'll create multiple cycles to ensure variety
    const sequenceLength = allImages.length * 3; // 3 full cycles
    randomSequence = [];
    
    for (let cycle = 0; cycle < 3; cycle++) {
        const shuffledIndices = Array.from({length: allImages.length}, (_, i) => i);
        
        // Shuffle using Fisher-Yates
        for (let i = shuffledIndices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
        }
        
        randomSequence.push(...shuffledIndices);
    }
    
    randomSequenceIndex = 0;
    console.log(`🎲 Generated random sequence with ${randomSequence.length} entries for smooth navigation`);
}

// Get next random image index from pre-calculated sequence
function getNextRandomIndex() {
    if (randomSequence.length === 0) {
        generateRandomSequence();
    }
    
    // Find next index that's different from current
    let attempts = 0;
    let nextIndex;
    
    do {
        nextIndex = randomSequence[randomSequenceIndex];
        randomSequenceIndex = (randomSequenceIndex + 1) % randomSequence.length;
        attempts++;
        
        // If we've tried the whole sequence, just use any index
        if (attempts >= randomSequence.length) break;
        
    } while (nextIndex === currentImageIndex && allImages.length > 1);
    
    return nextIndex;
}

// Initialize slideshow
async function initializeSlideshow() {
    if (isInitialized) return;
    
    console.log('Discovering images in Backgrounds/People and Backgrounds/Places folders...');
    
    // Discover all available images
    allImages = await discoverImages();
    
    if (allImages.length === 0) {
        console.warn('No slideshow images found in Backgrounds folders');
        console.warn('Please add images to the Backgrounds/People and Backgrounds/Places folders');
        // No fallback image - slideshow will not run
        return;
    }
    
    // Shuffle for variety
    allImages = shuffleArray(allImages);
    
    // Generate pre-calculated random sequence for smooth manual navigation
    generateRandomSequence();
    
    console.log(`Slideshow initialized with ${allImages.length} images:`, allImages);
    
    console.log('⏰ Auto slideshow: Images change every 30 seconds');
    console.log('⌨️ Keyboard controls: Left/Right arrows and Spacebar');
    
    // Start preloading images
    if (SLIDESHOW_CONFIG.enablePreloader) {
        preloadImages();
    }
    
    // Check if background is already set by preloader
    const bgElement = document.getElementById('bg-imageHome');
    const hasExistingBackground = bgElement && bgElement.style.backgroundImage && bgElement.style.backgroundImage !== 'none';
    
    if (!hasExistingBackground) {
        // Set initial background only if none exists
        setBackgroundImage(allImages[currentImageIndex]);
        
        // Ensure initial opacity is set correctly
        if (bgElement) {
            bgElement.style.opacity = '0.4';
            bgElement.style.transition = `opacity ${SLIDESHOW_CONFIG.fadeTransition}ms ease-in-out`;
        }
    } else {
        console.log('🎬 Background already set by preloader, starting from next image');
        
        // Start from the second image to create variety
        currentImageIndex = 1 % allImages.length;
        
        // Just ensure transition is set up for future changes
        if (bgElement) {
            bgElement.style.transition = `opacity ${SLIDESHOW_CONFIG.fadeTransition}ms ease-in-out`;
        }
    }
    
    // Start slideshow timer
    startSlideshow();
    
    // Add keyboard controls
    if (SLIDESHOW_CONFIG.enableKeyboardControls) {
        addKeyboardControls();
    }
    
    isInitialized = true;
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Preload images for smooth transitions
function preloadImages() {
    const preloadCount = Math.min(5, allImages.length); // Preload next 5 images
    
    for (let i = 0; i < preloadCount; i++) {
        const index = (currentImageIndex + i) % allImages.length;
        const imagePath = allImages[index];
        
        if (!preloadedImages.has(imagePath)) {
            const img = new Image();
            img.onload = () => {
                preloadedImages.set(imagePath, img);
                console.log(`Preloaded: ${imagePath}`);
            };
            img.onerror = () => {
                console.warn(`Failed to preload: ${imagePath}`);
            };
            img.src = imagePath;
        }
    }
}

// Set background image with smooth transition
function setBackgroundImage(imagePath) {
    const bgElement = document.getElementById('bg-imageHome');
    if (!bgElement) return;
    
    // Set background properties without changing opacity immediately
    bgElement.style.backgroundImage = `url('${imagePath}')`;
    bgElement.style.backgroundPosition = 'center';
    bgElement.style.backgroundSize = 'cover';
    bgElement.style.backgroundRepeat = 'no-repeat';
    
    // Ensure opacity is properly set (only if not set already)
    if (bgElement.style.opacity === '' || bgElement.style.opacity === '0') {
        bgElement.style.opacity = '0.4';
    }
    
    console.log(`Background changed to: ${imagePath}`);
}

// Start slideshow interval
function startSlideshow() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
    }

    console.log('▶️ Slideshow started - first auto-change in 30 seconds');
    
    // Simple interval-based slideshow with smooth transitions
    slideshowInterval = setInterval(() => {
        console.log('🔄 Auto: Changing to next image');
        nextImageAuto(); // Use sequential progression for auto slideshow
    }, SLIDESHOW_CONFIG.changeInterval);
}

// Restart slideshow timer (used when manual navigation occurs)
function restartSlideshowTimer() {
    console.log('⏰ Restarting slideshow timer due to manual navigation');
    startSlideshow(); // This will clear existing interval and start fresh
}

// Move to next image with smooth transition
function nextImageWithTransition() {
    if (allImages.length === 0) return;
    
    const bgElement = document.getElementById('bg-imageHome');
    if (!bgElement) return;
    
    // Use pre-calculated random sequence for instant response
    const nextIndex = getNextRandomIndex();
    
    // Set up transition for smooth fade
    bgElement.style.transition = `opacity ${SLIDESHOW_CONFIG.fadeTransition}ms ease-in-out`;
    
    // Start smooth fade out
    bgElement.style.opacity = '0';
    
    // Change image during fade
    setTimeout(() => {
        currentImageIndex = nextIndex;
        setBackgroundImage(allImages[currentImageIndex]);
        
        // Fade back in
        setTimeout(() => {
            bgElement.style.opacity = '0.4';
        }, 50); // Small delay to ensure image is loaded
        
        // Preload next batch if needed
        if (SLIDESHOW_CONFIG.enablePreloader && currentImageIndex % 3 === 0) {
            preloadImages();
        }
    }, SLIDESHOW_CONFIG.fadeTransition / 2);
}

// Move to previous image with smooth transition
function previousImageWithTransition() {
    if (allImages.length === 0) return;
    
    const bgElement = document.getElementById('bg-imageHome');
    if (!bgElement) return;
    
    // Use pre-calculated random sequence for instant response
    const nextIndex = getNextRandomIndex();
    
    // Set up transition for smooth fade
    bgElement.style.transition = `opacity ${SLIDESHOW_CONFIG.fadeTransition}ms ease-in-out`;
    
    // Start smooth fade out
    bgElement.style.opacity = '0';
    
    // Change image during fade
    setTimeout(() => {
        currentImageIndex = nextIndex;
        setBackgroundImage(allImages[currentImageIndex]);
        
        // Fade back in
        setTimeout(() => {
            bgElement.style.opacity = '0.4';
        }, 50); // Small delay to ensure image is loaded
    }, SLIDESHOW_CONFIG.fadeTransition / 2);
}

// Move to next image (for keyboard controls - no transition needed)
function nextImage() {
    if (allImages.length === 0) return;
    
    currentImageIndex = (currentImageIndex + 1) % allImages.length;
    setBackgroundImage(allImages[currentImageIndex]);
    
    // Preload next batch if needed
    if (SLIDESHOW_CONFIG.enablePreloader && currentImageIndex % 3 === 0) {
        preloadImages();
    }
}

// Move to previous image
function previousImage() {
    if (allImages.length === 0) return;
    
    currentImageIndex = currentImageIndex === 0 ? allImages.length - 1 : currentImageIndex - 1;
    setBackgroundImage(allImages[currentImageIndex]);
}

// Add keyboard controls
function addKeyboardControls() {
    console.log('⌨️ Slideshow.js keyboard controls: Enabled');
    
    document.addEventListener('keydown', (event) => {
        // Only work after slideshow is initialized
        if (!isInitialized) return;
        
        switch(event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                console.log('⬅️ Manual: Previous image via keyboard');
                previousImageWithTransition();
                restartSlideshowTimer(); // Reset timer after manual navigation
                break;
            case 'ArrowRight':
                event.preventDefault();
                console.log('➡️ Manual: Next image via keyboard');
                nextImageWithTransition();
                restartSlideshowTimer(); // Reset timer after manual navigation
                break;
            case ' ': // Spacebar
                event.preventDefault();
                console.log('⏭️ Manual: Next image via spacebar');
                nextImageWithTransition();
                restartSlideshowTimer(); // Reset timer after manual navigation
                break;
        }
    });
}

// Pause slideshow
function pauseSlideshow() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }
}

// Resume slideshow
function resumeSlideshow() {
    if (!slideshowInterval) {
        startSlideshow();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Re-enabled: Using slideshow.js as the main background system
    console.log('🎬 Slideshow.js: Waiting for main content to take over from preloader');
    
    // Wait for main content to be shown and preloader to signal readiness
    const checkMainContent = setInterval(() => {
        if (window.mainContentReady) {
            clearInterval(checkMainContent);
            console.log('🎬 Taking over background slideshow from preloader...');
            
            // Take over seamlessly from preloader
            takeOverFromPreloader();
        }
    }, 100);
    
    // Reduced fallback timeout - start after 3 seconds maximum
    setTimeout(() => {
        clearInterval(checkMainContent);
        if (!isInitialized) {
            console.log('🎬 Fallback: Starting slideshow after timeout');
            initializeSlideshow();
        }
    }, 3000);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        resumeSlideshow();
    } else {
        pauseSlideshow();
    }
});

// Export functions for debugging and external control
window.slideshowControls = {
    next: nextImageWithTransition, // Random selection
    previous: previousImageWithTransition, // Random selection
    nextAuto: nextImageAuto, // Sequential for auto slideshow
    nextInstant: nextImage, // For instant changes without transition
    previousInstant: previousImage, // For instant changes without transition
    pause: pauseSlideshow,
    resume: resumeSlideshow,
    getCurrentImage: () => allImages[currentImageIndex],
    getImageCount: () => allImages.length,
    getAllImages: () => allImages,
    getImageSummary: () => {
        console.log('\n📊 IMAGE SUMMARY:');
        for (const person of IMAGE_FOLDERS.people) {
            const folderImages = allImages.filter(img => img.includes(`/People/${person}/`));
            console.log(`👤 ${person}: ${folderImages.length} images`);
        }
        for (const place of IMAGE_FOLDERS.places) {
            const folderImages = allImages.filter(img => img.includes(`/Places/${place}/`));
            console.log(`🏙️ ${place}: ${folderImages.length} images`);
        }
        return `Total: ${allImages.length} images`;
    },
    goToImage: (index) => {
        if (index >= 0 && index < allImages.length) {
            currentImageIndex = index;
            setBackgroundImage(allImages[currentImageIndex]);
        }
    },
    goToRandomImage: () => {
        currentImageIndex = getNextRandomIndex();
        setBackgroundImage(allImages[currentImageIndex]);
        console.log(`Switched to random image: ${allImages[currentImageIndex]}`);
    },
    regenerateRandomSequence: () => {
        generateRandomSequence();
        console.log('🎲 Random sequence regenerated for fresh variety');
    },
    getRandomSequenceInfo: () => {
        console.log(`Random sequence: ${randomSequence.length} entries, current position: ${randomSequenceIndex}`);
        return {
            sequenceLength: randomSequence.length,
            currentPosition: randomSequenceIndex,
            totalImages: allImages.length
        };
    }
};

// Move to next image automatically (sequential for auto slideshow)
function nextImageAuto() {
    if (allImages.length === 0) return;
    
    const bgElement = document.getElementById('bg-imageHome');
    if (!bgElement) return;
    
    // Set up transition for smooth fade
    bgElement.style.transition = `opacity ${SLIDESHOW_CONFIG.fadeTransition}ms ease-in-out`;
    
    // Start smooth fade out
    bgElement.style.opacity = '0';
    
    // Change image during fade
    setTimeout(() => {
        // Sequential progression for auto slideshow to ensure all images are seen
        currentImageIndex = (currentImageIndex + 1) % allImages.length;
        setBackgroundImage(allImages[currentImageIndex]);
        
        // Fade back in
        setTimeout(() => {
            bgElement.style.opacity = '0.4';
        }, 50); // Small delay to ensure image is loaded
        
        // Preload next batch if needed
        if (SLIDESHOW_CONFIG.enablePreloader && currentImageIndex % 3 === 0) {
            preloadImages();
        }
    }, SLIDESHOW_CONFIG.fadeTransition / 2);
}

// Take over background slideshow from preloader seamlessly
async function takeOverFromPreloader() {
    if (isInitialized) return;
    
    console.log('🔄 Taking over background slideshow from preloader...');
    
    // Discover all available images
    allImages = await discoverImages();
    
    if (allImages.length === 0) {
        console.warn('No slideshow images found in Backgrounds folders');
        return;
    }
    
    // Shuffle for variety
    allImages = shuffleArray(allImages);
    
    // Generate pre-calculated random sequence
    generateRandomSequence();
    
    // Clear preloader interval and take over
    if (window.preloaderSlideInterval) {
        clearInterval(window.preloaderSlideInterval);
        console.log('🔄 Cleared preloader interval');
    }
    
    // Start from current preloader index or beginning
    currentImageIndex = window.currentPreloaderIndex || 0;
    
    console.log(`🎬 Slideshow took over at image ${currentImageIndex + 1}, continuing every 30 seconds`);
    
    // Start preloading images
    if (SLIDESHOW_CONFIG.enablePreloader) {
        preloadImages();
    }
    
    // Background is already set by preloader, just ensure transition is ready
    const bgElement = document.getElementById('bg-imageHome');
    if (bgElement) {
        bgElement.style.transition = `opacity ${SLIDESHOW_CONFIG.fadeTransition}ms ease-in-out`;
    }
    
    // Start slideshow timer
    startSlideshow();
    
    // Add keyboard controls
    if (SLIDESHOW_CONFIG.enableKeyboardControls) {
        addKeyboardControls();
    }
    
    isInitialized = true;
} 