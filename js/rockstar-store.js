// PlayStation Store Link Management
// Updates store links based on user region and platform preferences

// PlayStation Store URLs for different regions
const playstationStoreUrls = {
    'global': 'https://store.playstation.com/concept/10000730',
    'us': 'https://store.playstation.com/en-us/concept/10000730',
    'uk': 'https://store.playstation.com/en-gb/concept/10000730',
    'gb': 'https://store.playstation.com/en-gb/concept/10000730',
    'de': 'https://store.playstation.com/de-de/concept/10000730',
    'fr': 'https://store.playstation.com/fr-fr/concept/10000730',
    'es': 'https://store.playstation.com/es-es/concept/10000730',
    'it': 'https://store.playstation.com/it-it/concept/10000730',
    'jp': 'https://store.playstation.com/ja-jp/concept/10000730',
    'au': 'https://store.playstation.com/en-au/concept/10000730',
    'ca': 'https://store.playstation.com/en-ca/concept/10000730'
};

// Function to detect user's region/language
function detectUserRegion() {
    const userLang = navigator.language || navigator.userLanguage;
    const region = userLang.split('-')[1]?.toLowerCase();
    const language = userLang.split('-')[0]?.toLowerCase();
    
    // Check if we have a specific region mapping
    if (region && playstationStoreUrls[region]) {
        return region;
    }
    
    // Check if we have a language mapping
    if (language && playstationStoreUrls[language]) {
        return language;
    }
    
    // Fallback to global
    return 'global';
}

// Function to get the appropriate PlayStation Store URL
function getPlayStationStoreUrl() {
    const region = detectUserRegion();
    return playstationStoreUrls[region] || playstationStoreUrls['global'];
}

// Function to handle PlayStation Store link click
function handlePlayStationStoreClick(event) {
    event.preventDefault();
    
    const storeUrl = getPlayStationStoreUrl();
    
    // Try to open in new tab
    const newWindow = window.open(storeUrl, '_blank', 'noopener,noreferrer');
    
    // Fallback if popup blocked
    if (!newWindow) {
        window.location.href = storeUrl;
    }
    
    // Track click event if analytics available
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            'event_category': 'playstation_store',
            'event_label': 'gta6_ps_store_link',
            'value': 1
        });
    }
    
    console.log(`PlayStation Store link clicked - Region: ${detectUserRegion()}, URL: ${storeUrl}`);
}

// Function to update Rockstar Games Store link based on country/region
async function updateRockstarStoreLink() {
    const linkElement = document.getElementById('rockstar-store-link');
    const defaultUrl = 'https://store.rockstargames.com/'; // Default Rockstar store
    const storageKey = 'userCountryCode';
    
    if (!linkElement) return;
    
    // Check localStorage first
    const storedCountry = localStorage.getItem(storageKey);
    
    if (storedCountry) {
        // Use stored country code to determine appropriate store link
        updateStoreLink(linkElement, storedCountry);
        return;
    }
    
    try {
        // Fetch user's country code using ipapi.co
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        // Get country code (lowercase) or use fallback
        const countryCode = (data && data.country) ? data.country.toLowerCase() : 'us';
        
        // Store in localStorage for future visits
        localStorage.setItem(storageKey, countryCode);
        
        // Update the link
        updateStoreLink(linkElement, countryCode);
        
    } catch (error) {
        console.error('Error fetching country code:', error);
        // Fallback to default Rockstar store
        linkElement.href = defaultUrl;
    }
}

// Function to update store link based on country code
function updateStoreLink(linkElement, countryCode) {
    // Rockstar Games Store URLs by region
    const storeUrls = {
        'us': 'https://store.rockstargames.com/',
        'uk': 'https://store.rockstargames.com/',
        'gb': 'https://store.rockstargames.com/',
        'ca': 'https://store.rockstargames.com/',
        'au': 'https://store.rockstargames.com/',
        'de': 'https://store.rockstargames.com/',
        'fr': 'https://store.rockstargames.com/',
        'es': 'https://store.rockstargames.com/',
        'it': 'https://store.rockstargames.com/',
        'jp': 'https://store.rockstargames.com/',
        'br': 'https://store.rockstargames.com/',
        'mx': 'https://store.rockstargames.com/',
        'ru': 'https://store.rockstargames.com/',
        'cn': 'https://store.rockstargames.com/',
        'kr': 'https://store.rockstargames.com/',
        'in': 'https://store.rockstargames.com/',
        // Add more regions as needed
    };
    
    // Get appropriate store URL or use default
    const storeUrl = storeUrls[countryCode] || storeUrls['us'];
    
    // Update the link
    linkElement.href = storeUrl;
    linkElement.target = '_blank';
    linkElement.rel = 'noopener noreferrer';
    
    console.log(`Updated Rockstar store link for country: ${countryCode}`);
}

// Function to handle platform-specific store links
function updatePlatformLinks() {
    const linkElement = document.getElementById('rockstar-store-link');
    if (!linkElement) return;
    
    // You can enhance this to show different platforms based on user preference
    // For now, we'll keep it generic to Rockstar Games Store
    
    // Add click tracking for analytics if needed
    linkElement.addEventListener('click', function() {
        console.log('Rockstar Games Store link clicked');
        
        // Show notification
        if (typeof showNotif === 'function') {
            showNotif('Opening Rockstar Games Store... 🎮');
        }
    });
}

// Function to check if GTA 6 is available for purchase
async function checkGTA6Availability() {
    // This would be enhanced with actual API calls to check availability
    // For now, we'll prepare the structure
    
    try {
        // Placeholder for future API integration
        const isAvailable = false; // GTA 6 not yet released
        
        if (isAvailable) {
            // Update UI to show "Buy Now" instead of just store link
            updateUIForAvailableGame();
        } else {
            // Show as "Coming Soon" or wishlist option
            updateUIForUpcomingGame();
        }
        
    } catch (error) {
        console.error('Error checking GTA 6 availability:', error);
    }
}

function updateUIForAvailableGame() {
    const linkElement = document.getElementById('rockstar-store-link');
    if (linkElement) {
        linkElement.textContent = 'Buy Now on Rockstar Games Store';
        linkElement.style.fontWeight = 'bold';
        linkElement.style.color = '#00ff00'; // Green for available
    }
}

function updateUIForUpcomingGame() {
    const linkElement = document.getElementById('rockstar-store-link');
    if (linkElement) {
        linkElement.textContent = 'PlayStation 5'; // Keep original text for now
        // Could be enhanced to show "Pre-order" when available
    }
}

// Initialize store link functionality
function initializeStoreLinks() {
    updateRockstarStoreLink();
    updatePlatformLinks();
    checkGTA6Availability();
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeStoreLinks();
});

// Export functions for global access
window.updateRockstarStoreLink = updateRockstarStoreLink;
window.updatePlatformLinks = updatePlatformLinks;
window.checkGTA6Availability = checkGTA6Availability;

// Initialize PlayStation Store link functionality
document.addEventListener('DOMContentLoaded', function() {
    const storeLink = document.getElementById('rockstar-store-link');
    
    if (storeLink) {
        // Set the initial href to the detected region's store
        storeLink.href = getPlayStationStoreUrl();
        
        // Add click handler
        storeLink.addEventListener('click', handlePlayStationStoreClick);
        
        // Update link text to be more descriptive
        if (storeLink.textContent.includes('PlayStation')) {
            storeLink.title = 'Pre-order GTA 6 on PlayStation Store';
        }
        
        console.log('PlayStation Store link initialized');
    }
});

// Export functions for debugging
window.playstationStoreDebug = {
    detectUserRegion,
    getPlayStationStoreUrl,
    playstationStoreUrls
}; 