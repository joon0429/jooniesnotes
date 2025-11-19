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
        '--accent-color': '#FFEB3B',
        '--accent-hover': '#FFD700',
        '--border-color': '#FFEB3B',
        '--border-thickness': '2px',
        '--nav-bg': '#0f0f0f',
        '--nav-border': '#FFEB3B',
        '--button-bg': '#FFEB3B',
        '--button-hover': '#FFD700',
        '--button-text': '#1a1a1a',
        '--button-bold': 'bold',
        '--nav-link-bold': 'normal'
    },
    blue: {
        '--bg-primary': '#fff',
        '--bg-secondary': '#c5e3f6',
        '--bg-tertiary': '#bbdefb',
        '--text-primary': '#1565c0',
        '--text-secondary': '#1565c0',
        '--text-tertiary': '#1976d2',
        '--accent-color': '#1976d2',
        '--accent-hover': '#1565c0',
        '--border-color': '#90caf9',
        '--border-thickness': '2px',
        '--nav-bg': '#e3f2fd',
        '--nav-border': '#90caf9',
        '--button-bg': '#2196f3',
        '--button-hover': '#1976d2',
        '--button-text': '#fff',
        '--button-bold': 'bold',
        '--nav-link-bold': 'normal'
    },
    green: {
        '--bg-primary': '#fff',
        '--bg-secondary': '#d4edda',
        '--bg-tertiary': '#c8e6c9',
        '--text-primary': '#2e7d32',
        '--text-secondary': '#2e7d32',
        '--text-tertiary': '#388e3c',
        '--accent-color': '#388e3c',
        '--accent-hover': '#2e7d32',
        '--border-color': '#a5d6a7',
        '--border-thickness': '2px',
        '--nav-bg': '#e8f5e9',
        '--nav-border': '#a5d6a7',
        '--button-bg': '#4caf50',
        '--button-hover': '#388e3c',
        '--button-text': '#fff',
        '--button-bold': 'bold',
        '--nav-link-bold': 'normal'
    },
    purple: {
        '--bg-primary': '#fff',
        '--bg-secondary': '#e8d5ed',
        '--bg-tertiary': '#e1bee7',
        '--text-primary': '#7b1fa2',
        '--text-secondary': '#7b1fa2',
        '--text-tertiary': '#9c27b0',
        '--accent-color': '#9c27b0',
        '--accent-hover': '#7b1fa2',
        '--border-color': '#ce93d8',
        '--border-thickness': '2px',
        '--nav-bg': '#f3e5f5',
        '--nav-border': '#ce93d8',
        '--button-bg': '#9c27b0',
        '--button-hover': '#7b1fa2',
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

