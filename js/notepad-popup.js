// Popup Notepad Window Manager

export class NotepadPopup {
    constructor() {
        this.windows = [];
    }
    
    createWindow(noteId = null, noteType = 'private') {
        const windowId = 'notepad-' + Date.now();
        const window = this.createWindowElement(windowId, noteId, noteType);
        document.body.appendChild(window);
        this.windows.push(windowId);
        this.makeResizable(window);
        this.centerWindow(window);
        return window;
    }
    
    createWindowElement(windowId, noteId, noteType) {
        const window = document.createElement('div');
        window.className = 'notepad-popup-window';
        window.id = windowId;
        window.dataset.noteId = noteId || '';
        window.dataset.noteType = noteType;
        
        // Set initial size (1/3 of screen or full width, whichever is smaller)
        const screenWidth = window.innerWidth || document.documentElement.clientWidth;
        const screenHeight = window.innerHeight || document.documentElement.clientHeight;
        const width = Math.min(screenWidth * 0.33, screenWidth - 40);
        const height = Math.min(screenHeight * 0.5, screenHeight - 40);
        window.style.width = width + 'px';
        window.style.height = height + 'px';
        
        window.innerHTML = `
            <div class="notepad-popup-header">
                <div class="notepad-popup-title">Untitled - Notepad</div>
                <div class="notepad-popup-controls">
                    <button class="popup-btn minimize" onclick="notepadPopup.minimizeWindow('${windowId}')">_</button>
                    <button class="popup-btn close" onclick="notepadPopup.closeWindow('${windowId}')">×</button>
                </div>
            </div>
            <div class="notepad-popup-content">
                <div class="notepad-popup-menubar">
                    <div class="menu-item" onclick="togglePopupMenu('${windowId}', 'file-menu')">
                        File
                        <div id="${windowId}-file-menu" class="dropdown-menu">
                            <div onclick="notepadPopup.saveWindow('${windowId}')">Save</div>
                            <div onclick="notepadPopup.closeWindow('${windowId}')">Exit</div>
                        </div>
                    </div>
                    <div class="menu-item" onclick="togglePopupMenu('${windowId}', 'edit-menu')">
                        Edit
                        <div id="${windowId}-edit-menu" class="dropdown-menu">
                            <div onclick="notepadPopup.copyText('${windowId}')">Copy</div>
                            <div onclick="notepadPopup.pasteText('${windowId}')">Paste</div>
                            <div onclick="notepadPopup.selectAll('${windowId}')">Select All</div>
                        </div>
                    </div>
                    <div class="menu-item" onclick="togglePopupMenu('${windowId}', 'format-menu')">
                        Format
                        <div id="${windowId}-format-menu" class="dropdown-menu">
                            <div onclick="notepadPopup.applyFormat('${windowId}', 'bold')">Bold</div>
                            <div onclick="notepadPopup.applyFormat('${windowId}', 'italic')">Italic</div>
                            <div onclick="notepadPopup.applyFormat('${windowId}', 'underline')">Underline</div>
                        </div>
                    </div>
                </div>
                <div class="notepad-popup-toolbar">
                    <div class="formatting-buttons">
                        <button class="format-btn" onclick="notepadPopup.applyFormat('${windowId}', 'bold')" title="Bold"><strong>B</strong></button>
                        <button class="format-btn" onclick="notepadPopup.applyFormat('${windowId}', 'italic')" title="Italic"><em>I</em></button>
                        <button class="format-btn" onclick="notepadPopup.applyFormat('${windowId}', 'underline')" title="Underline"><u>U</u></button>
                    </div>
                    <div class="popup-save-options">
                        <label><input type="radio" name="${windowId}-save-type" value="private" ${noteType === 'private' ? 'checked' : ''}> Private</label>
                        <label><input type="radio" name="${windowId}-save-type" value="public" ${noteType === 'public' ? 'checked' : ''}> Public</label>
                    </div>
                </div>
                <textarea id="${windowId}-textarea" class="notepad-popup-textarea" placeholder="Start typing..."></textarea>
            </div>
        `;
        
        // Load note if editing
        if (noteId) {
            this.loadNote(windowId, noteId, noteType);
        }
        
        // Setup textarea handlers
        this.setupTextareaHandlers(windowId);
        
        return window;
    }
    
    setupTextareaHandlers(windowId) {
        const textarea = document.getElementById(`${windowId}-textarea`);
        
        // Tab key handler (2 spaces)
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const value = textarea.value;
                textarea.value = value.substring(0, start) + '  ' + value.substring(end);
                textarea.selectionStart = textarea.selectionEnd = start + 2;
            }
            
            // Keyboard shortcuts
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                this.applyFormat(windowId, 'bold');
            }
            if (e.ctrlKey && e.key === 'i') {
                e.preventDefault();
                this.applyFormat(windowId, 'italic');
            }
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                this.applyFormat(windowId, 'underline');
            }
        });
    }
    
    async loadNote(windowId, noteId, noteType) {
        try {
            const note = await notesAPI.getNote(noteType, noteId);
            const textarea = document.getElementById(`${windowId}-textarea`);
            textarea.value = note.content || '';
            const window = document.getElementById(windowId);
            const titleDiv = window.querySelector('.notepad-popup-title');
            titleDiv.textContent = (note.title || 'Untitled') + ' - Notepad';
        } catch (error) {
            console.error('Error loading note:', error);
        }
    }
    
    async saveWindow(windowId) {
        const window = document.getElementById(windowId);
        const textarea = document.getElementById(`${windowId}-textarea`);
        const saveType = window.querySelector(`input[name="${windowId}-save-type"]:checked`).value;
        const noteId = window.dataset.noteId;
        const content = textarea.value;
        const title = window.querySelector('.notepad-popup-title').textContent.replace(' - Notepad', '');
        
        const note = {
            id: noteId || generateId(),
            title: title === 'Untitled' ? '' : title,
            content: content,
            type: saveType,
            date: noteId ? undefined : new Date().toISOString()
        };
        
        try {
            await notesAPI.saveNote(saveType, note);
            alert('Note saved!');
            // Reload the page that opened this window
            if (window.opener) {
                window.opener.location.reload();
            }
        } catch (error) {
            console.error('Error saving note:', error);
            alert('Error saving note. Please try again.');
        }
    }
    
    applyFormat(windowId, type) {
        const textarea = document.getElementById(`${windowId}-textarea`);
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        const beforeText = textarea.value.substring(0, start);
        const afterText = textarea.value.substring(end);
        
        let formattedText = '';
        let newCursorPos = start;
        
        if (type === 'bold') {
            formattedText = selectedText ? `**${selectedText}**` : '****';
            newCursorPos = selectedText ? start + formattedText.length : start + 2;
        } else if (type === 'italic') {
            formattedText = selectedText ? `*${selectedText}*` : '**';
            newCursorPos = selectedText ? start + formattedText.length : start + 1;
        } else if (type === 'underline') {
            formattedText = selectedText ? `<u>${selectedText}</u>` : '<u></u>';
            newCursorPos = selectedText ? start + formattedText.length : start + 3;
        }
        
        textarea.value = beforeText + formattedText + afterText;
        textarea.selectionStart = textarea.selectionEnd = newCursorPos;
        textarea.focus();
    }
    
    copyText(windowId) {
        const textarea = document.getElementById(`${windowId}-textarea`);
        textarea.select();
        document.execCommand('copy');
    }
    
    pasteText(windowId) {
        const textarea = document.getElementById(`${windowId}-textarea`);
        textarea.focus();
        document.execCommand('paste');
    }
    
    selectAll(windowId) {
        const textarea = document.getElementById(`${windowId}-textarea`);
        textarea.select();
    }
    
    minimizeWindow(windowId) {
        const window = document.getElementById(windowId);
        window.classList.toggle('minimized');
    }
    
    closeWindow(windowId) {
        const window = document.getElementById(windowId);
        window.remove();
        this.windows = this.windows.filter(id => id !== windowId);
    }
    
    makeResizable(window) {
        let isResizing = false;
        let isDragging = false;
        let startX, startY, startWidth, startHeight, startLeft, startTop;
        
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';
        window.appendChild(resizeHandle);
        
        // Make window draggable via header
        const header = window.querySelector('.notepad-popup-header');
        header.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('popup-btn')) return; // Don't drag when clicking buttons
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(window.style.left) || 0;
            startTop = parseInt(window.style.top) || 0;
            e.preventDefault();
        });
        
        // Resize handle
        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(window.offsetWidth);
            startHeight = parseInt(window.offsetHeight);
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                window.style.left = (startLeft + deltaX) + 'px';
                window.style.top = (startTop + deltaY) + 'px';
            }
            if (isResizing) {
                const width = startWidth + (e.clientX - startX);
                const height = startHeight + (e.clientY - startY);
                window.style.width = Math.max(300, width) + 'px';
                window.style.height = Math.max(200, height) + 'px';
            }
        });
        
        document.addEventListener('mouseup', () => {
            isResizing = false;
            isDragging = false;
        });
    }
    
    centerWindow(window) {
        const width = parseInt(window.style.width) || 600;
        const height = parseInt(window.style.height) || 400;
        const screenWidth = window.innerWidth || document.documentElement.clientWidth;
        const screenHeight = window.innerHeight || document.documentElement.clientHeight;
        window.style.left = (screenWidth / 2 - width / 2) + 'px';
        window.style.top = (screenHeight / 2 - height / 2) + 'px';
    }
}

// Global functions for menu toggling
window.togglePopupMenu = function(windowId, menuId) {
    const fullMenuId = `${windowId}-${menuId}`;
    document.querySelectorAll(`#${windowId} .dropdown-menu`).forEach(menu => {
        if (menu.id !== fullMenuId) {
            menu.style.display = 'none';
        }
    });
    const menu = document.getElementById(fullMenuId);
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
};

// Initialize global notepad popup instance
window.notepadPopup = new NotepadPopup();

