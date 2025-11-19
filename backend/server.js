const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const notesRoutes = require('./routes/notes');
const imagesRoutes = require('./routes/images');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Create uploads directory for images
const uploadsDir = path.join(__dirname, 'data', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Routes
app.use('/api/notes', notesRoutes);
app.use('/api/images', imagesRoutes);

// Serve uploaded images
app.use('/uploads', express.static(uploadsDir));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

