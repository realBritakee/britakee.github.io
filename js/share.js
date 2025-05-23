// Share functionality for GTA 6 Countdown

function shareButtonClick() {
    const shareData = {
        title: 'GTA 6 Countdown',
        text: 'GTA 6 Release Date Countdown - Check out how much time is left until GTA VI releases!',
        url: window.location.href
    };

    if (navigator.share) {
        // Native Web Share API is supported
        navigator.share(shareData)
            .then(() => {
                console.log('Shared successfully');
                if (typeof showNotif === 'function') {
                    showNotif('Content shared successfully! 📤');
                }
            })
            .catch((error) => {
                console.error('Error sharing:', error);
                fallbackShare();
            });
    } else {
        // Fallback for browsers that don't support Web Share API
        fallbackShare();
    }
}

function fallbackShare() {
    // Try to copy to clipboard as fallback
    const shareText = `GTA 6 Release Date Countdown - ${window.location.href}`;
    
    if (navigator.clipboard && window.isSecureContext) {
        // Modern clipboard API
        navigator.clipboard.writeText(shareText)
            .then(() => {
                if (typeof showNotif === 'function') {
                    showNotif('Link copied to clipboard! 📋');
                }
            })
            .catch(() => {
                legacyClipboardCopy(shareText);
            });
    } else {
        // Legacy clipboard copy method
        legacyClipboardCopy(shareText);
    }
}

function legacyClipboardCopy(text) {
    // Create a temporary text area element
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    
    try {
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        
        if (successful && typeof showNotif === 'function') {
            showNotif('Link copied to clipboard! 📋');
        } else if (typeof showNotif === 'function') {
            showNotif('Unable to share. Please copy the URL manually.');
        }
    } catch (err) {
        console.error('Could not copy text: ', err);
        if (typeof showNotif === 'function') {
            showNotif('Unable to share. Please copy the URL manually.');
        }
    } finally {
        document.body.removeChild(textArea);
    }
}

// Social media sharing functions
function shareToTwitter() {
    const text = encodeURIComponent('GTA 6 Release Date Countdown - Check out how much time is left until GTA VI releases!');
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

function shareToFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareToReddit() {
    const title = encodeURIComponent('GTA 6 Release Date Countdown');
    const url = encodeURIComponent(window.location.href);
    window.open(`https://reddit.com/submit?title=${title}&url=${url}`, '_blank');
}

// Hide share button if Web Share API is not supported and no clipboard access
document.addEventListener('DOMContentLoaded', function() {
    const shareButton = document.getElementById('shareB');
    
    if (!shareButton) return;
    
    // Check if any sharing method is available
    const canShare = navigator.share || 
                    (navigator.clipboard && window.isSecureContext) || 
                    document.queryCommandSupported('copy');
    
    if (!canShare) {
        // If no sharing methods available, hide the button
        shareButton.classList.add('hidden');
        console.log('No sharing methods available, hiding share button');
    }
});

// Export functions for global access
window.shareButtonClick = shareButtonClick;
window.shareToTwitter = shareToTwitter;
window.shareToFacebook = shareToFacebook;
window.shareToReddit = shareToReddit; 