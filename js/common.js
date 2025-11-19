// Common functionality shared across all pages

// Initialize theme on page load
function initTheme() {
    const theme = getTheme();
    document.body.className = 'theme-' + theme;
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        themeSelect.value = theme;
    }
}

// Change theme from navigation
function changeThemeFromNav(themeName) {
    setTheme(themeName);
}

// Initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}

