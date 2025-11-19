// Utility functions

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getMasterPassword() {
    const MASTER_PASSWORD = 'changeme';
    let stored = localStorage.getItem('masterPassword');
    if (!stored) {
        localStorage.setItem('masterPassword', MASTER_PASSWORD);
        return MASTER_PASSWORD;
    }
    return stored;
}

function setMasterPassword(password) {
    localStorage.setItem('masterPassword', password);
}

function getUserInfo() {
    const info = localStorage.getItem('userInfo');
    return info ? JSON.parse(info) : null;
}

function saveUserInfo(userInfo) {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
}

function getTheme() {
    return localStorage.getItem('selectedTheme') || 'light';
}

function setTheme(themeName) {
    localStorage.setItem('selectedTheme', themeName);
    document.body.className = 'theme-' + themeName;
}
