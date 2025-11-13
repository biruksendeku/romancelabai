const menuSection = document.getElementById("menu__section");
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
// Prevent hiding if mouse moves back into menu during timeout
menuLinksSection.addEventListener("mouseenter", () => {
    clearTimeout(menuTimeout);
});

// Hide menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuLinksSection.contains(e.target) && !menuBtn.contains(e.target)) {
        menuLinksSection.style.display = "none";
    }
});

// THEME MANIPULATION LOGIC - FIXED VERSION
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
