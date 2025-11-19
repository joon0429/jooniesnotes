// API client for backend communication
const API_BASE = 'http://localhost:3000/api';

const notesAPI = {
    async getNotes(type) {
        try {
            const response = await fetch(`${API_BASE}/notes/${type}`);
            if (!response.ok) throw new Error('Backend not available');
            return await response.json();
        } catch (error) {
            console.warn('Backend unavailable, using localStorage:', error);
            // Fallback to localStorage
            const key = type === 'public' ? 'publicNotes' : 'privateNotes';
            const notes = localStorage.getItem(key);
            return notes ? JSON.parse(notes) : [];
        }
    },
    
    async getNote(type, id) {
        try {
            const response = await fetch(`${API_BASE}/notes/${type}/${id}`);
            if (!response.ok) throw new Error('Backend not available');
            return await response.json();
        } catch (error) {
            console.warn('Backend unavailable, using localStorage:', error);
            // Fallback to localStorage
            const notes = this.getNotes(type);
            return (await notes).find(n => n.id === id);
        }
    },
    
    async saveNote(type, note) {
        try {
            const response = await fetch(`${API_BASE}/notes/${type}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(note)
            });
            if (!response.ok) throw new Error('Backend not available');
            return await response.json();
        } catch (error) {
            console.warn('Backend unavailable, using localStorage:', error);
            // Fallback to localStorage
            const key = type === 'public' ? 'publicNotes' : 'privateNotes';
            const notes = JSON.parse(localStorage.getItem(key) || '[]');
            const index = notes.findIndex(n => n.id === note.id);
            if (index >= 0) {
                notes[index] = note;
            } else {
                notes.push(note);
            }
            localStorage.setItem(key, JSON.stringify(notes));
            return note;
        }
    },
    
    async deleteNote(type, id) {
        try {
            const response = await fetch(`${API_BASE}/notes/${type}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Backend not available');
            return await response.json();
        } catch (error) {
            console.warn('Backend unavailable, using localStorage:', error);
            // Fallback to localStorage
            const key = type === 'public' ? 'publicNotes' : 'privateNotes';
            const notes = JSON.parse(localStorage.getItem(key) || '[]');
            const filtered = notes.filter(n => n.id !== id);
            localStorage.setItem(key, JSON.stringify(filtered));
            return { success: true };
        }
    }
};

const imagesAPI = {
    async getImages(tag = null) {
        try {
            const url = tag ? `${API_BASE}/images?tag=${encodeURIComponent(tag)}` : `${API_BASE}/images`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Backend not available');
            return await response.json();
        } catch (error) {
            console.warn('Backend unavailable, using localStorage:', error);
            // Fallback to localStorage
            const images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
            if (tag) {
                return images.filter(img => img.tags && img.tags.includes(tag));
            }
            return images;
        }
    },
    
    async getImage(id) {
        try {
            const response = await fetch(`${API_BASE}/images/${id}`);
            if (!response.ok) throw new Error('Backend not available');
            return await response.json();
        } catch (error) {
            console.warn('Backend unavailable, using localStorage:', error);
            const images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
            return images.find(img => img.id === id);
        }
    },
    
    async uploadImage(file, caption, tags) {
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('caption', caption || '');
            formData.append('tags', tags || '');
            
            const response = await fetch(`${API_BASE}/images/upload`, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) throw new Error('Backend not available');
            return await response.json();
        } catch (error) {
            console.warn('Backend unavailable, using localStorage:', error);
            // Fallback to localStorage - convert file to data URL
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageData = {
                        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
                        filename: file.name,
                        originalName: file.name,
                        path: e.target.result, // Data URL
                        caption: caption || '',
                        tags: tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [],
                        date: new Date().toISOString()
                    };
                    const images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
                    images.push(imageData);
                    localStorage.setItem('galleryImages', JSON.stringify(images));
                    resolve(imageData);
                };
                reader.readAsDataURL(file);
            });
        }
    },
    
    async updateImage(id, caption, tags) {
        try {
            const response = await fetch(`${API_BASE}/images/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ caption, tags })
            });
            if (!response.ok) throw new Error('Backend not available');
            return await response.json();
        } catch (error) {
            console.warn('Backend unavailable, using localStorage:', error);
            const images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
            const index = images.findIndex(img => img.id === id);
            if (index >= 0) {
                if (caption) images[index].caption = caption;
                if (tags) images[index].tags = tags.split(',').map(t => t.trim()).filter(t => t);
                localStorage.setItem('galleryImages', JSON.stringify(images));
                return images[index];
            }
            return null;
        }
    },
    
    async deleteImage(id) {
        try {
            const response = await fetch(`${API_BASE}/images/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Backend not available');
            return await response.json();
        } catch (error) {
            console.warn('Backend unavailable, using localStorage:', error);
            const images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
            const filtered = images.filter(img => img.id !== id);
            localStorage.setItem('galleryImages', JSON.stringify(filtered));
            return { success: true };
        }
    },
    
    async getAllTags() {
        try {
            const response = await fetch(`${API_BASE}/images/tags/all`);
            if (!response.ok) throw new Error('Backend not available');
            return await response.json();
        } catch (error) {
            console.warn('Backend unavailable, using localStorage:', error);
            const images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
            const allTags = new Set();
            images.forEach(img => {
                if (img.tags) {
                    img.tags.forEach(tag => allTags.add(tag));
                }
            });
            return Array.from(allTags);
        }
    }
};
