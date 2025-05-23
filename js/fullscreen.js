// Fullscreen functionality for GTA 6 Countdown

// Function to toggle fullscreen mode
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        // Enter fullscreen
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen mode: ${err.message}`);
        });
    } else {
        // Exit fullscreen
        document.exitFullscreen().catch(err => {
            console.log(`Error attempting to exit fullscreen mode: ${err.message}`);
        });
    }
}

// Listen for fullscreen changes to update button appearance
document.addEventListener('fullscreenchange', function() {
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (document.fullscreenElement) {
        fullscreenBtn.textContent = '⛶'; // Minimize symbol when in fullscreen
        fullscreenBtn.title = 'Exit Fullscreen';
    } else {
        fullscreenBtn.textContent = '⛶'; // Maximize symbol when not in fullscreen
        fullscreenBtn.title = 'Enter Fullscreen';
    }
});

// Initialize fullscreen button
document.addEventListener('DOMContentLoaded', function() {
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.title = 'Enter Fullscreen';
    }
}); 