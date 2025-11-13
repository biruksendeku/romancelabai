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

// NEWLY ADDED LOGIC
// Update year automatically
document.getElementById('currentYear').textContent = new Date().getFullYear();

/*
// Character counter for textarea
const textarea = document.getElementById('prompt');
const charCount = document.getElementById('charCount');

textarea.addEventListener('input', function() {
	const count = this.value.length;
	charCount.textContent = count;

	// Change color when approaching limit
	if (count > 240) {
		charCount.style.color = '#ff4d6d';
	} else if (count > 200) {
		charCount.style.color = '#ff8e9e';
	} else {
	charCount.style.color = '#ccffcc';
	}
});
*/

// Random confession count animation
function animateCounter() {
	const counter = document.getElementById('confessionCount');
	let count = 1247;
	const finalCount = 1247 + Math.floor(Math.random() * 50);
	const increment = Math.ceil((finalCount - count) / 50);

	const timer = setInterval(() => {
		count += increment;
		if (count >= finalCount) {
			count = finalCount;
			clearInterval(timer);
		}
		counter.textContent = count.toLocaleString() + '+';
	}, 30);
}

// Start animation when page loads
window.addEventListener('load', animateCounter);
