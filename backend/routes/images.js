const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '..', 'data', 'images.json');
const uploadsDir = path.join(__dirname, '..', 'data', 'uploads');

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify([]));
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Helper function to read images
function readImages() {
    try {
        const data = fs.readFileSync(dataFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Helper function to write images
function writeImages(images) {
    fs.writeFileSync(dataFile, JSON.stringify(images, null, 2));
}

// Get all images (with optional tag filter)
router.get('/', (req, res) => {
    const { tag } = req.query;
    let images = readImages();
    
    if (tag) {
        images = images.filter(img => 
            img.tags && img.tags.some(t => t.toLowerCase() === tag.toLowerCase())
        );
    }
    
    res.json(images);
});

// Get a specific image
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const images = readImages();
    const image = images.find(img => img.id === id);
    if (image) {
        res.json(image);
    } else {
        res.status(404).json({ error: 'Image not found' });
    }
});

// Upload an image
router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const { caption, tags } = req.body;
    const images = readImages();
    
    // Validate caption length (max 50 words)
    if (caption) {
        const wordCount = caption.trim().split(/\s+/).length;
        if (wordCount > 50) {
            return res.status(400).json({ error: 'Caption must be 50 words or less' });
        }
    }
    
    const imageData = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: `/uploads/${req.file.filename}`,
        caption: caption || '',
        tags: tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [],
        date: new Date().toISOString()
    };
    
    images.push(imageData);
    writeImages(images);
    
    res.json(imageData);
});

// Update an image (caption or tags)
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { caption, tags } = req.body;
    const images = readImages();
    const imageIndex = images.findIndex(img => img.id === id);
    
    if (imageIndex === -1) {
        return res.status(404).json({ error: 'Image not found' });
    }
    
    // Validate caption length
    if (caption) {
        const wordCount = caption.trim().split(/\s+/).length;
        if (wordCount > 50) {
            return res.status(400).json({ error: 'Caption must be 50 words or less' });
        }
        images[imageIndex].caption = caption;
    }
    
    if (tags) {
        images[imageIndex].tags = tags.split(',').map(t => t.trim()).filter(t => t);
    }
    
    writeImages(images);
    res.json(images[imageIndex]);
});

// Delete an image
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const images = readImages();
    const imageIndex = images.findIndex(img => img.id === id);
    
    if (imageIndex === -1) {
        return res.status(404).json({ error: 'Image not found' });
    }
    
    // Delete the file
    const image = images[imageIndex];
    const filePath = path.join(uploadsDir, image.filename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
    
    // Remove from array
    images.splice(imageIndex, 1);
    writeImages(images);
    
    res.json({ success: true });
});

// Get all unique tags
router.get('/tags/all', (req, res) => {
    const images = readImages();
    const allTags = new Set();
    
    images.forEach(img => {
        if (img.tags) {
            img.tags.forEach(tag => allTags.add(tag));
        }
    });
    
    res.json(Array.from(allTags));
});

module.exports = router;

