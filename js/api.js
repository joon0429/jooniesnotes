// Local storage API - no backend connection
// All data is stored in browser localStorage

const notesAPI = {
    async getNotes(type) {
        const key = type === 'public' ? 'publicNotes' : 'privateNotes';
        const notes = localStorage.getItem(key);
        return notes ? JSON.parse(notes) : [];
    },
    
    async getNote(type, id) {
        const notes = await this.getNotes(type);
        return notes.find(n => n.id === id);
    },
    
    async saveNote(type, note) {
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
    },
    
    async deleteNote(type, id) {
        const key = type === 'public' ? 'publicNotes' : 'privateNotes';
        const notes = JSON.parse(localStorage.getItem(key) || '[]');
        const filtered = notes.filter(n => n.id !== id);
        localStorage.setItem(key, JSON.stringify(filtered));
        return { success: true };
    }
};

const imagesAPI = {
    async getImages(tag = null) {
        const images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
        if (tag) {
            return images.filter(img => img.tags && img.tags.includes(tag));
        }
        return images;
    },
    
    async getImage(id) {
        const images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
        return images.find(img => img.id === id);
    },
    
    async uploadImage(file, caption, tags) {
        // Convert file to data URL and store in localStorage
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
    },
    
    async updateImage(id, caption, tags) {
        const images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
        const index = images.findIndex(img => img.id === id);
        if (index >= 0) {
            if (caption) images[index].caption = caption;
            if (tags) images[index].tags = tags.split(',').map(t => t.trim()).filter(t => t);
            localStorage.setItem('galleryImages', JSON.stringify(images));
            return images[index];
        }
        return null;
    },
    
    async deleteImage(id) {
        const images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
        const filtered = images.filter(img => img.id !== id);
        localStorage.setItem('galleryImages', JSON.stringify(filtered));
        return { success: true };
    },
    
    async getAllTags() {
        const images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
        const allTags = new Set();
        images.forEach(img => {
            if (img.tags) {
                img.tags.forEach(tag => allTags.add(tag));
            }
        });
        return Array.from(allTags);
    }
};
