// YouTube-style Like/Dislike System for GTA 6 Countdown
// Handles voting with local storage persistence

// Configuration
const LIKE_SYSTEM_CONFIG = {
    storageKey: 'gta6_countdown_votes',
    initialLikes: 0, // Starting at 0
    initialDislikes: 0, // Starting at 0
    enableLocalStorage: true,
    enableAnimations: true
};

// System state
let currentVote = null; // 'like', 'dislike', or null
let likeCount = LIKE_SYSTEM_CONFIG.initialLikes;
let dislikeCount = LIKE_SYSTEM_CONFIG.initialDislikes;

// Initialize like/dislike system
function initializeLikeSystem() {
    console.log('Initializing like/dislike system...');
    
    // Load saved data
    loadVoteData();
    
    // Update UI
    updateVoteDisplay();
    
    // Add event listeners
    addVoteEventListeners();
    
    console.log('Like system initialized - Likes:', likeCount, 'Dislikes:', dislikeCount);
}

// Load vote data from localStorage
function loadVoteData() {
    if (!LIKE_SYSTEM_CONFIG.enableLocalStorage) return;
    
    try {
        const savedData = localStorage.getItem(LIKE_SYSTEM_CONFIG.storageKey);
        if (savedData) {
            const data = JSON.parse(savedData);
            currentVote = data.userVote || null;
            likeCount = data.likeCount || LIKE_SYSTEM_CONFIG.initialLikes;
            dislikeCount = data.dislikeCount || LIKE_SYSTEM_CONFIG.initialDislikes;
        }
    } catch (error) {
        console.warn('Error loading vote data:', error);
    }
}

// Save vote data to localStorage
function saveVoteData() {
    if (!LIKE_SYSTEM_CONFIG.enableLocalStorage) return;
    
    try {
        const data = {
            userVote: currentVote,
            likeCount: likeCount,
            dislikeCount: dislikeCount,
            lastVoted: Date.now()
        };
        localStorage.setItem(LIKE_SYSTEM_CONFIG.storageKey, JSON.stringify(data));
    } catch (error) {
        console.warn('Error saving vote data:', error);
    }
}

// Add event listeners to vote buttons
function addVoteEventListeners() {
    const likeBtn = document.getElementById('like-btn');
    const dislikeBtn = document.getElementById('dislike-btn');
    
    if (likeBtn) {
        likeBtn.addEventListener('click', handleLikeClick);
    }
    
    if (dislikeBtn) {
        dislikeBtn.addEventListener('click', handleDislikeClick);
    }
}

// Handle like button click
function handleLikeClick() {
    if (currentVote === 'like') {
        // Remove like
        currentVote = null;
        likeCount--;
        showNotif('Like removed');
    } else {
        if (currentVote === 'dislike') {
            // Switch from dislike to like
            dislikeCount--;
        }
        currentVote = 'like';
        likeCount++;
        showNotif('Thanks for liking! 👍');
    }
    
    updateVoteDisplay();
    saveVoteData();
    
    // Add animation
    if (LIKE_SYSTEM_CONFIG.enableAnimations) {
        animateButton('like-btn');
    }
}

// Handle dislike button click
function handleDislikeClick() {
    if (currentVote === 'dislike') {
        // Remove dislike
        currentVote = null;
        dislikeCount--;
        showNotif('Dislike removed');
    } else {
        if (currentVote === 'like') {
            // Switch from like to dislike
            likeCount--;
        }
        currentVote = 'dislike';
        dislikeCount++;
        showNotif('Feedback noted 👎');
    }
    
    updateVoteDisplay();
    saveVoteData();
    
    // Add animation
    if (LIKE_SYSTEM_CONFIG.enableAnimations) {
        animateButton('dislike-btn');
    }
}

// Update vote display
function updateVoteDisplay() {
    const likeBtn = document.getElementById('like-btn');
    const dislikeBtn = document.getElementById('dislike-btn');
    const likeCountElement = document.getElementById('like-count');
    const dislikeCountElement = document.getElementById('dislike-count');
    
    // Update counts
    if (likeCountElement) {
        likeCountElement.textContent = formatNumber(likeCount);
    }
    
    if (dislikeCountElement) {
        dislikeCountElement.textContent = formatNumber(dislikeCount);
    }
    
    // Update button states
    if (likeBtn) {
        likeBtn.classList.toggle('liked', currentVote === 'like');
    }
    
    if (dislikeBtn) {
        dislikeBtn.classList.toggle('disliked', currentVote === 'dislike');
    }
}

// Format number for display (e.g., 1000 -> 1K)
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1).replace('.0', '') + 'K';
    }
    return num.toString();
}

// Animate button press
function animateButton(buttonId) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    
    // Add animation class
    button.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
}

// Show notification (reusing existing notification system)
function showNotif(message) {
    const toastElement = document.getElementById('toastNotif');
    const toastSpan = toastElement?.querySelector('span');
    
    if (toastElement && toastSpan) {
        toastSpan.textContent = message;
        toastElement.classList.remove('hidden');
        
        setTimeout(() => {
            toastElement.classList.add('hidden');
        }, 2000);
    }
}

// Get vote statistics
function getVoteStats() {
    const total = likeCount + dislikeCount;
    const likePercentage = total > 0 ? ((likeCount / total) * 100).toFixed(1) : 0;
    const dislikePercentage = total > 0 ? ((dislikeCount / total) * 100).toFixed(1) : 0;
    
    return {
        likes: likeCount,
        dislikes: dislikeCount,
        total: total,
        likePercentage: likePercentage,
        dislikePercentage: dislikePercentage,
        userVote: currentVote
    };
}

// Reset votes (for testing)
function resetVotes() {
    currentVote = null;
    likeCount = LIKE_SYSTEM_CONFIG.initialLikes;
    dislikeCount = LIKE_SYSTEM_CONFIG.initialDislikes;
    updateVoteDisplay();
    saveVoteData();
    showNotif('Votes reset');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLikeSystem();
});

// Export functions for debugging and external use
window.likeSystem = {
    getLikeCount: () => likeCount,
    getDislikeCount: () => dislikeCount,
    getCurrentVote: () => currentVote,
    getStats: getVoteStats,
    reset: resetVotes,
    like: handleLikeClick,
    dislike: handleDislikeClick
}; 