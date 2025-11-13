// Menu functionality
    const menuBtn = document.getElementById("menu__btn");
    const closeBtn = document.getElementById("close__btn");
    const menuLinksSection = document.getElementById("menu__links__section");

    let menuTimeout;

    menuBtn.addEventListener("click", () => {
        clearTimeout(menuTimeout);
        menuLinksSection.style.display = "inline";
    });

    closeBtn.addEventListener("click", () => {
        menuLinksSection.style.display = "none";
    });

    menuLinksSection.addEventListener("mouseleave", () => {
        menuTimeout = setTimeout(() => {
            menuLinksSection.style.display = "none";
        }, 300);
    });

    menuLinksSection.addEventListener("mouseenter", () => {
        clearTimeout(menuTimeout);
    });

    document.addEventListener('click', (e) => {
        if (!menuLinksSection.contains(e.target) && !menuBtn.contains(e.target)) {
            menuLinksSection.style.display = "none";
        }
    });

// THEME MANIPULATION LOGIC
    const themeBtn = document.getElementById("theme__choice");
    const lightMode = document.getElementById("light__theme");
    const darkMode = document.getElementById("dark__theme");

    // Check current theme from localStorage
    const savedTheme = localStorage.getItem("confessoraiDarkmode");
    const isDarkMode = savedTheme === "active";

    // Apply initial theme
    function applyTheme() {
        if (isDarkMode) {
            document.body.classList.add("darkmode");
            lightMode.style.display = "block";
            darkMode.style.display = "none";
        } else {
            document.body.classList.remove("darkmode");
            lightMode.style.display = "none";
            darkMode.style.display = "block";
        }
    }

    // Apply theme on page load
    applyTheme();

    // Event listener on the parent button
    themeBtn.addEventListener("click", () => {
        const isCurrentlyDark = document.body.classList.contains("darkmode");

        if (isCurrentlyDark) {
            // Switch to light mode
            document.body.classList.remove("darkmode");
            localStorage.setItem("confessoraiDarkmode", "inactive");
            lightMode.style.display = "none";
            darkMode.style.display = "block";
        } else {
            // Switch to dark mode
            document.body.classList.add("darkmode");
            localStorage.setItem("confessoraiDarkmode", "active");
            lightMode.style.display = "block";
            darkMode.style.display = "none";
        }
    });

// NEWLY ADDED LOGIC
        // Enhanced user experience
        document.addEventListener('DOMContentLoaded', function() {
            const printBtn = document.getElementById('printBtn');
            const shareBtn = document.getElementById('shareBtn');
            const envelope = document.getElementById('envelope');
            const seal = document.getElementById('seal');

            // Envelope opening animation
            if (envelope) {
                setTimeout(() => {
                    envelope.classList.add('opened');
                }, 1000);
            }

            // Print functionality
            printBtn.addEventListener('click', function() {
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

                if (isMobile) {
                    if (window.chrome) {
                        window.print();
                    } else if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                        alert('To print: Tap Share → Scroll down → Tap Print 📱');
                    } else {
                        window.print();
                    }
                } else {
                    window.print();
                }
            });

            // Share functionality
            shareBtn.addEventListener('click', function() {
                const confessionText = document.querySelector('.result__paragraph')?.textContent || 'A beautiful confession was created with Confessor AI 💌';

                if (navigator.share) {
                    navigator.share({
                        title: 'My Heartfelt Confession 💕',
                        text: confessionText,
                        url: window.location.href
                    }).catch(() => {
                        fallbackShare(confessionText);
                    });
                } else {
                    fallbackShare(confessionText);
                }
            });

            function fallbackShare(text) {
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(text).then(() => {
                        alert('Confession copied to clipboard!');
                    }).catch(() => {
                        prompt('Copy this confession to share:', text);
                    });
                } else {
                    prompt('Copy this confession to share:', text);
                }
            }

            // Keyboard shortcuts
            document.addEventListener('keydown', function(e) {
                if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                    e.preventDefault();
                    window.print();
                }
            });

            // Add some interactive magic
            seal?.addEventListener('click', function() {
                this.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 300);
            });
        });
        
const copyBtn = document.getElementById('copy__btn');
const textToCopy = document.getElementById('confession__result__copy');

// Check if elements exist
if (copyBtn && textToCopy) {
    copyBtn.addEventListener('click', async (e) => {
        const originalText = copyBtn.textContent;
        const originalBgColor = copyBtn.style.backgroundColor;

        try {
            // Fallback for older browsers
            if (!navigator.clipboard) {
                fallbackCopyTextToClipboard(textToCopy.textContent.trim());
            } else {
                await navigator.clipboard.writeText(textToCopy.textContent.trim());
            }
            
            // Success state
            copyBtn.textContent = "Copied!";
            copyBtn.style.backgroundColor = "lightgreen";
            
        } catch (err) {
            // Error state
            copyBtn.textContent = "Failed!";
            copyBtn.style.backgroundColor = "lightred";
        } finally {
            // Reset after 1.5 seconds
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.backgroundColor = originalBgColor;
            }, 1500);
        }
    });
} else {
    console.error('Copy button or text element not found!');
}

// Fallback method for older browsers
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
    } catch (err) {
        throw new Error('Fallback copy failed');
    }
    document.body.removeChild(textArea);
}
