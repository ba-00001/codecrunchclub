/**
 * main.js - Main JavaScript file for Code Crunch website
 * Contains all interactive functionality for the website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initScrollIndicator();
    initGameControls();
    initAnimations();
    initCodeTicker();
    initNavHighlighting();
    initPlayButton();
});

/**
 * Scroll Indicator Functionality
 * Shows/hides and updates the floating scroll indicator
 */
function initScrollIndicator() {
    const scrollIndicator = document.getElementById('scroll-indicator');
    const scrollText = document.getElementById('scroll-text');
    let lastScrollTop = 0;

    if (!scrollIndicator) return;

    // Update scroll indicator on scroll
    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;

        // Show/hide indicator based on position
        if (scrollTop > 200) {
            scrollIndicator.classList.remove('hidden');
        } else {
            scrollIndicator.classList.add('hidden');
        }

        // Update direction text based on scroll position
        if (scrollTop === 0) {
            // At the very top, only show "Scroll Down"
            scrollText.textContent = "Scroll Down";
            scrollIndicator.innerHTML = "⬇️ <span id='scroll-text'>Scroll Down</span> ⬇️";
        } else if (scrollTop + windowHeight >= scrollHeight - 10) {
            // At the bottom, only show "Scroll Up"
            scrollText.textContent = "Scroll Up";
            scrollIndicator.innerHTML = "⬆️ <span id='scroll-text'>Scroll Up</span> ⬆️";
        } else {
            // In the middle, dynamically update based on scroll direction
            if (scrollTop > lastScrollTop) {
                // Scrolling down
                scrollText.textContent = "Scroll Down";
                scrollIndicator.innerHTML = "⬇️ <span id='scroll-text'>Scroll Down</span> ⬇️";
            } else {
                // Scrolling up
                scrollText.textContent = "Scroll Up";
                scrollIndicator.innerHTML = "⬆️ <span id='scroll-text'>Scroll Up</span> ⬆️";
            }
        }

        lastScrollTop = scrollTop; // Store the previous scroll position
    });

    // Click event to scroll based on the current state
    scrollIndicator.addEventListener('click', function() {
        if (document.getElementById('scroll-text').textContent === "Scroll Up") {
            window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top smoothly
        } else {
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }); // Scroll to bottom
        }
    });
}

/**
 * Game Section Functionality
 * Handles the interactive game container and fullscreen toggle
 */
function initGameControls() {
    const gameContainer = document.getElementById('gameContainer');
    const playBtn = document.getElementById('playBtn');
    
    if (!gameContainer || !playBtn) return;
    
    playBtn.addEventListener('click', () => {
        if (!gameContainer.classList.contains('fullscreen')) {
            // Expand to fullscreen
            gameContainer.classList.add('fullscreen');
            document.body.classList.add('no-scroll'); // Prevent scrolling
        } else {
            // Exit fullscreen
            gameContainer.classList.remove('fullscreen');
            document.body.classList.remove('no-scroll'); // Restore scrolling
        }
    });
}

/**
 * Scroll Animations
 * Handles fade-in, slide-in, and other animations for elements
 */
function initAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .zoom-in');
    
    if (animatedElements.length === 0) return;

    // Function to check if element is in viewport and trigger animation
    const handleScrollAnimations = () => {
        animatedElements.forEach(element => {
            const position = element.getBoundingClientRect().top;
            // Trigger animation when element is 85% into the viewport
            if (position < window.innerHeight * 0.85) {
                element.classList.add('visible');
            }
        });
    };

    // Trigger animations when scrolling
    window.addEventListener('scroll', handleScrollAnimations);
    
    // Initial check for elements in viewport on page load
    handleScrollAnimations();
}

/**
 * Code Ticker Functionality
 * Creates and manages the scrolling code snippets
 */
function initCodeTicker() {
    const tickerTrack = document.querySelector('.ticker-track');
    
    if (!tickerTrack) return;
    
    // Programming languages and their code snippets
    const languages = [
        {
            name: 'Python',
            color: '#ffffff',
            bgColor: 'linear-gradient(135deg, #1a73e8, #004aad)',
            snippets: [
                'print("Hello, World!")',
                'for i in range(10): print(i)',
                'if "Python" in ["Java", "C++", "Python"]: print("Found it!")',
                'lambda x: x * 2',
                '[x**2 for x in range(10)]',
                'import this',
                'from datetime import datetime; print(datetime.now())'
            ]
        },
        {
            name: 'JavaScript',
            color: '#212121',
            bgColor: 'linear-gradient(135deg, #f7df1e, #ff9800)',
            snippets: [
                'console.log("Hello, World!");',
                'for(let i = 0; i < 10; i++) console.log(i);',
                'const nums = [1, 2, 3].map(x => x * 2);',
                'setTimeout(() => console.log("Delayed"), 1000);',
                'fetch("/api").then(res => res.json())'
            ]
        },
        {
            name: 'Java',
            color: '#ffd700',
            bgColor: 'linear-gradient(135deg, #004aad, #004aad)',
            snippets: [
                'System.out.println("Hello, World!");',
                'for (int i = 0; i < 10; i++) System.out.println(i);',
                'if(name.equals("Java")) System.out.println("Found it!");',
                'List<Integer> nums = Arrays.asList(1,2,3);'
            ]
        },
        {
            name: 'C++',
            color: '#00ffff',
            bgColor: 'linear-gradient(135deg, #005cb2, #003f7f)',
            snippets: [
                '#include <iostream>\nusing namespace std;',
                'cout << "Hello, World!" << endl;',
                'for(int i = 0; i < 10; i++) cout << i << endl;',
                'vector<int> nums = {1,2,3};'
            ]
        }
    ];

    // Generate ticker content
    let currentLanguageIndex = 0;
    
    // Function to update ticker with next language
    function updateTicker() {
        const language = languages[currentLanguageIndex];
        
        // Update ticker style
        tickerTrack.style.background = language.bgColor;
        
        // Create ticker content
        let tickerContent = '<div class="ticker-content" style="display: flex; animation: ticker-scroll 30s linear infinite;">';
        
        // Add snippets twice for seamless looping
        for (let i = 0; i < 2; i++) {
            tickerContent += '<div style="display: flex;">';
            language.snippets.forEach(snippet => {
                tickerContent += `<h4 style="color: ${language.color}; font-size: 18px; margin: 0 50px;"><code>${snippet}</code></h4>`;
            });
            tickerContent += '</div>';
        }
        
        tickerContent += '</div>';
        tickerTrack.innerHTML = tickerContent;
        
        // Move to next language
        currentLanguageIndex = (currentLanguageIndex + 1) % languages.length;
    }
    
    // Initial update
    updateTicker();
    
    // Change language every 15 seconds
    setInterval(updateTicker, 15000);
}

/**
 * Navigation Highlighting
 * Highlights the current page in the navigation menu
 */
function initNavHighlighting() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const currentPageUrl = window.location.pathname.split('/').pop();
    
    if (navLinks.length === 0) return;
    
    navLinks.forEach(link => {
        // Get the href attribute value
        const href = link.getAttribute('href');
        
        // Check if the link's href matches the current page URL
        if (href === currentPageUrl || 
            (currentPageUrl === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Form Validation
 * Validates form inputs before submission
 */
function validateForm(formId) {
    const form = document.getElementById(formId);
    
    if (!form) return true;
    
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    // Check each required field
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    // Validate email fields
    const emailFields = form.querySelectorAll('input[type="email"]');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    emailFields.forEach(field => {
        if (field.value.trim() && !emailRegex.test(field.value.trim())) {
            field.classList.add('is-invalid');
            isValid = false;
        }
    });
    
    return isValid;
}

function initPlayButton() {
    const playBtn = document.getElementById("playBtn");
    playBtn.addEventListener("click", toggleFullscreen);
}

function toggleFullscreen() {
    const gameContainer = document.getElementById("gameContainer");

    if (!gameContainer.classList.contains("fullscreen")) {
        gameContainer.classList.add("fullscreen");
        document.body.classList.add("no-scroll");
    } else {
        gameContainer.classList.remove("fullscreen");
        document.body.classList.remove("no-scroll");
    }
}