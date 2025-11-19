// API client for backend communication
const API_BASE = 'http://localhost:3000/api';

const notesAPI = {
    async getNotes(type) {
        const response = await fetch(`${API_BASE}/notes/${type}`);
        return await response.json();
    },
    
    async getNote(type, id) {
        const response = await fetch(`${API_BASE}/notes/${type}/${id}`);
        return await response.json();
    },
    
    async saveNote(type, note) {
        const response = await fetch(`${API_BASE}/notes/${type}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note)
        });
        return await response.json();
    },
    
    async deleteNote(type, id) {
        const response = await fetch(`${API_BASE}/notes/${type}/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    }
};

const imagesAPI = {
    async getImages(tag = null) {
        const url = tag ? `${API_BASE}/images?tag=${encodeURIComponent(tag)}` : `${API_BASE}/images`;
        const response = await fetch(url);
        return await response.json();
    },
    
    async getImage(id) {
        const response = await fetch(`${API_BASE}/images/${id}`);
        return await response.json();
    },
    
    async uploadImage(file, caption, tags) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('caption', caption || '');
        formData.append('tags', tags || '');
        
        const response = await fetch(`${API_BASE}/images/upload`, {
            method: 'POST',
            body: formData
        });
        return await response.json();
    },
    
    async updateImage(id, caption, tags) {
        const response = await fetch(`${API_BASE}/images/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ caption, tags })
        });
        return await response.json();
    },
    
    async deleteImage(id) {
        const response = await fetch(`${API_BASE}/images/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    },
    
    async getAllTags() {
        const response = await fetch(`${API_BASE}/images/tags/all`);
        return await response.json();
    }
};
