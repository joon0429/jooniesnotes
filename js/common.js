// Common functionality shared across all pages

// Theme configuration
const themes = {
    light: {
        '--bg-primary': '#fff',
        '--bg-secondary': '#f8f8f8',
        '--bg-tertiary': '#f0f0f0',
        '--text-primary': '#000',
        '--text-secondary': '#333',
        '--text-tertiary': '#666',
        '--accent-color': '#333',
        '--accent-hover': '#555',
        '--border-color': '#ccc',
        '--border-thickness': '1px',
        '--nav-bg': '#fff',
        '--nav-border': '#e0e0e0',
        '--button-bg': '#f0f0f0',
        '--button-hover': '#e0e0e0',
        '--button-text': '#333',
        '--button-bold': 'normal',
        '--nav-link-bold': 'normal'
    },
    'dark-mode': {
        '--bg-primary': '#1a1a1a',
        '--bg-secondary': '#252525',
        '--bg-tertiary': '#2a2a2a',
        '--text-primary': '#fff',
        '--text-secondary': '#fff',
        '--text-tertiary': '#ccc',
        '--accent-color': '#FF10F0',
        '--accent-hover': '#FF69B4',
        '--border-color': '#FF10F0',
        '--border-thickness': '2px',
        '--nav-bg': '#0f0f0f',
        '--nav-border': '#FF10F0',
        '--button-bg': '#FF10F0',
        '--button-hover': '#FF69B4',
        '--button-text': '#1a1a1a',
        '--button-bold': 'bold',
        '--nav-link-bold': 'normal'
    },
    blue: {
        '--bg-primary': '#1a1a1a',
        '--bg-secondary': '#252525',
        '--bg-tertiary': '#2a2a2a',
        '--text-primary': '#fff',
        '--text-secondary': '#fff',
        '--text-tertiary': '#90caf9',
        '--accent-color': '#2196f3',
        '--accent-hover': '#64b5f6',
        '--border-color': '#2196f3',
        '--border-thickness': '2px',
        '--nav-bg': '#0f0f0f',
        '--nav-border': '#2196f3',
        '--button-bg': '#2196f3',
        '--button-hover': '#64b5f6',
        '--button-text': '#fff',
        '--button-bold': 'bold',
        '--nav-link-bold': 'normal'
    },
    green: {
        '--bg-primary': '#1a1a1a',
        '--bg-secondary': '#252525',
        '--bg-tertiary': '#2a2a2a',
        '--text-primary': '#fff',
        '--text-secondary': '#fff',
        '--text-tertiary': '#a5d6a7',
        '--accent-color': '#4caf50',
        '--accent-hover': '#66bb6a',
        '--border-color': '#4caf50',
        '--border-thickness': '2px',
        '--nav-bg': '#0f0f0f',
        '--nav-border': '#4caf50',
        '--button-bg': '#4caf50',
        '--button-hover': '#66bb6a',
        '--button-text': '#fff',
        '--button-bold': 'bold',
        '--nav-link-bold': 'normal'
    },
    purple: {
        '--bg-primary': '#1a1a1a',
        '--bg-secondary': '#252525',
        '--bg-tertiary': '#2a2a2a',
        '--text-primary': '#fff',
        '--text-secondary': '#fff',
        '--text-tertiary': '#ce93d8',
        '--accent-color': '#9c27b0',
        '--accent-hover': '#ba68c8',
        '--border-color': '#9c27b0',
        '--border-thickness': '2px',
        '--nav-bg': '#0f0f0f',
        '--nav-border': '#9c27b0',
        '--button-bg': '#9c27b0',
        '--button-hover': '#ba68c8',
        '--button-text': '#fff',
        '--button-bold': 'bold',
        '--nav-link-bold': 'normal'
    }
};

// Apply theme by setting CSS variables
function applyTheme(themeName) {
    const theme = themes[themeName] || themes.light;
    const root = document.documentElement;
    
    Object.keys(theme).forEach(key => {
        root.style.setProperty(key, theme[key]);
    });
    
    localStorage.setItem('selectedTheme', themeName);
}

// Initialize theme on page load
function initTheme() {
    const theme = getTheme();
    applyTheme(theme);
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        themeSelect.value = theme;
    }
}

// Change theme from navigation
function changeThemeFromNav(themeName) {
    applyTheme(themeName);
}

// Initialize footer with contact links
function initFooter() {
    const emailLink = document.getElementById('footer-email');
    const phoneLink = document.getElementById('footer-phone');
    const instagramLink = document.getElementById('footer-instagram');
    const linkedinLink = document.getElementById('footer-linkedin');
    const youtubeLink = document.getElementById('footer-youtube');
    
    if (emailLink) emailLink.href = 'mailto:jkwon0429@gmail.com';
    if (phoneLink) phoneLink.href = 'tel:+16782312182';
    if (instagramLink) instagramLink.href = 'https://www.instagram.com/joonkwonn/';
    if (linkedinLink) linkedinLink.href = 'https://www.linkedin.com/in/joonkwonn/';
    if (youtubeLink) youtubeLink.href = 'https://www.youtube.com/@joonkwonn';
}

// Initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        initFooter();
    });
} else {
    initTheme();
    initFooter();
}

