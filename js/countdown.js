// GTA 6 Release Date Countdown
// Release date: May 26, 2026 00:00:00 UTC-4

// Get countdown elements
const countdownContainer = document.querySelector('#countdown');
const daysElem = document.querySelector('#days');
const hoursElem = document.querySelector('#hours');
const minutesElem = document.querySelector('#minutes');
const secondsElem = document.querySelector('#seconds');

// Get individual countdown divs for hiding when countdown ends
const dayDiv = document.querySelector('#day-div');
const hourDiv = document.querySelector('#hour-div');
const minuteDiv = document.querySelector('#minute-div');

// Set the countdown target date (May 26, 2026 00:00:00 UTC-4)
// Note: Month is 0-indexed in JavaScript (4 = May)
const releaseTime = new Date(2026, 4, 26, 0, 0, 0).getTime();

// Alternative date setup for UTC-4 timezone
const countdownDate = new Date("May 26, 2026 00:00:00 UTC-4").getTime();

// Flag for triggering special effects only once per countdown
let confettiTriggered = false;
let countdownInterval;

// Function to show notification
function showNotif(message) {
    const notifEl = document.getElementById('toastNotif');
    notifEl.innerHTML = `<span>${message}</span>`;
    notifEl.classList.remove('hidden');
    
    // Clear existing timeout if any
    if (showNotif.timeoutId) {
        clearTimeout(showNotif.timeoutId);
    }
    
    // Hide notification after 7 seconds
    showNotif.timeoutId = setTimeout(() => {
        notifEl.classList.add('hidden');
    }, 7000);
}

// Main countdown update function
function updateCountdown() {
    if (countdownContainer && daysElem && hoursElem && minutesElem && secondsElem) {
        const currentTime = new Date().getTime();
        const timeRemaining = countdownDate - currentTime;
        
        let days, hours, minutes, seconds;
        
        if (timeRemaining <= 0) {
            // Countdown has ended
            clearInterval(countdownInterval);
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
            
            // Hide countdown elements and show release message
            dayDiv.classList.add('hidden');
            dayDiv.innerHTML = '';
            hourDiv.classList.add('hidden');
            hourDiv.innerHTML = '';
            minuteDiv.classList.add('hidden');
            minuteDiv.innerHTML = '';
            
            // Update region display to show released status
            const regionDisplay = document.getElementById("display-region");
            if (regionDisplay) {
                regionDisplay.innerHTML += ' <span class="liveSignal">[Released]</span>';
            }
            
            // Show notification
            showNotif("GTA 6 has been released! 🎉");
            
            // Trigger confetti if available
            if (typeof triggerConfetti === 'function' && !confettiTriggered) {
                triggerConfetti();
                confettiTriggered = true;
            }
        } else {
            // Calculate remaining time
            days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
            hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        }
        
        // Update countdown display
        daysElem.textContent = days;
        hoursElem.textContent = hours;
        minutesElem.textContent = minutes;
        secondsElem.textContent = seconds;
        
        // Ensure countdown container is visible
        countdownContainer.style.opacity = '1';
    }
}

// Function to format time with leading zeros
function padZero(num) {
    return num < 10 ? '0' + num : num;
}

// Enhanced update function with better formatting
function updateCountdownFormatted() {
    if (countdownContainer && daysElem && hoursElem && minutesElem && secondsElem) {
        const currentTime = new Date().getTime();
        const timeRemaining = countdownDate - currentTime;
        
        if (timeRemaining <= 0) {
            // Countdown ended
            updateCountdown(); // Use the main function for end logic
            return;
        }
        
        // Calculate time components
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        // Update display
        daysElem.textContent = days;
        hoursElem.textContent = padZero(hours);
        minutesElem.textContent = padZero(minutes);
        secondsElem.textContent = padZero(seconds);
        
        // Ensure countdown is visible
        countdownContainer.style.opacity = '1';
    }
}

// Initialize countdown
function initCountdown() {
    // Run initial update
    updateCountdownFormatted();
    
    // Start interval to update every second
    countdownInterval = setInterval(updateCountdownFormatted, 1000);
}

// Start countdown when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
});

// Additional interval for release status check (from original code)
const releaseCheckInterval = setInterval(function() {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    if (distance <= 0) {
        clearInterval(releaseCheckInterval);
        const regionDisplay = document.getElementById("display-region");
        if (regionDisplay && !regionDisplay.innerHTML.includes('[Released]')) {
            regionDisplay.innerHTML += ' <span class="liveSignal">[Released]</span>';
        }
    }
}, 1000);

// Export functions for potential external use
window.updateCountdown = updateCountdown;
window.showNotif = showNotif; 