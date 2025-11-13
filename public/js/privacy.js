// Check current theme from localStorage
const savedTheme = localStorage.getItem("confessoraiDarkmode");
const isDarkMode = savedTheme === "active";

// Apply initial theme
function applyTheme() {
    if (isDarkMode) {
        document.body.classList.add("darkmode");
    } else {
        document.body.classList.remove("darkmode");
    }
}

// Apply theme on page load
applyTheme();
