// Image Gallery Manager

const API_BASE = 'http://localhost:3000/api';

class GalleryManager {
    constructor() {
        this.images = [];
        this.tags = [];
        this.selectedTag = null;
    }
    
    async init() {
        await this.loadTags();
        await this.loadImages();
        this.renderGallery();
        this.renderTagFilter();
    }
    
    async loadTags() {
        try {
            this.tags = await imagesAPI.getAllTags();
        } catch (error) {
            console.error('Error loading tags:', error);
            this.tags = [];
        }
    }
    
    async loadImages(tag = null) {
        try {
            this.images = await imagesAPI.getImages(tag);
            this.renderGallery();
        } catch (error) {
            console.error('Error loading images:', error);
            this.images = [];
        }
    }
    
    renderTagFilter() {
        const filterContainer = document.getElementById('gallery-filters');
        if (!filterContainer) return;
        
        filterContainer.innerHTML = `
            <button class="filter-tag ${this.selectedTag === null ? 'active' : ''}" onclick="galleryManager.filterByTag(null)">
                All
            </button>
            ${this.tags.map(tag => `
                <button class="filter-tag ${this.selectedTag === tag ? 'active' : ''}" onclick="galleryManager.filterByTag('${tag}')">
                    ${tag}
                </button>
            `).join('')}
        `;
    }
    
    filterByTag(tag) {
        this.selectedTag = tag;
        this.loadImages(tag);
        this.renderTagFilter();
    }
    
    renderGallery() {
        const galleryContainer = document.getElementById('gallery-container');
        if (!galleryContainer) return;
        
        if (this.images.length === 0) {
            galleryContainer.innerHTML = '<p class="no-images">No images yet. Upload your first image!</p>';
            return;
        }
        
        galleryContainer.innerHTML = this.images.map(image => {
            // Handle both backend URLs and data URLs
            const imageSrc = image.path.startsWith('data:') || image.path.startsWith('http') 
                ? image.path 
                : `http://localhost:3000${image.path}`;
            
            return `
                <div class="gallery-item" data-image-id="${image.id}">
                    <img src="${imageSrc}" alt="${image.caption}" loading="lazy">
                    <div class="gallery-item-overlay">
                        <p class="gallery-caption">${image.caption || 'No caption'}</p>
                        <div class="gallery-tags">
                            ${image.tags && image.tags.length > 0 ? image.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    openUploadModal() {
        const modal = document.getElementById('upload-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }
    
    closeUploadModal() {
        const modal = document.getElementById('upload-modal');
        if (modal) {
            modal.style.display = 'none';
            document.getElementById('upload-form').reset();
        }
    }
    
    async handleUpload(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const file = formData.get('image');
        const caption = formData.get('caption');
        const tags = formData.get('tags');
        
        // Validate caption word count
        if (caption) {
            const wordCount = caption.trim().split(/\s+/).length;
            if (wordCount > 50) {
                alert('Caption must be 50 words or less');
                return;
            }
        }
        
        if (!file || file.size === 0) {
            alert('Please select an image file');
            return;
        }
        
        try {
            const uploadFormData = new FormData();
            uploadFormData.append('image', file);
            uploadFormData.append('caption', caption || '');
            uploadFormData.append('tags', tags || '');
            
            const image = await imagesAPI.uploadImage(file, caption, tags);
            this.images.unshift(image);
            await this.loadTags();
            this.renderGallery();
            this.renderTagFilter();
            this.closeUploadModal();
            alert('Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image. Please try again.');
        }
    }
}

// Initialize global gallery manager
window.galleryManager = new GalleryManager();

