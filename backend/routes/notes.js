const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '..', 'data', 'notes.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ public: [], private: [] }, null, 2));
}

// Helper function to read notes
function readNotes() {
    try {
        const data = fs.readFileSync(dataFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { public: [], private: [] };
    }
}

// Helper function to write notes
function writeNotes(notes) {
    fs.writeFileSync(dataFile, JSON.stringify(notes, null, 2));
}

// Get all notes of a type
router.get('/:type', (req, res) => {
    const { type } = req.params;
    const notes = readNotes();
    res.json(notes[type] || []);
});

// Get a specific note
router.get('/:type/:id', (req, res) => {
    const { type, id } = req.params;
    const notes = readNotes();
    const note = (notes[type] || []).find(n => n.id === id);
    if (note) {
        res.json(note);
    } else {
        res.status(404).json({ error: 'Note not found' });
    }
});

// Create or update a note
router.post('/:type', (req, res) => {
    const { type } = req.params;
    const note = req.body;
    const notes = readNotes();
    
    if (!notes[type]) {
        notes[type] = [];
    }
    
    const index = notes[type].findIndex(n => n.id === note.id);
    if (index >= 0) {
        notes[type][index] = note;
    } else {
        if (!note.id) {
            note.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        }
        if (!note.date) {
            note.date = new Date().toISOString();
        }
        notes[type].push(note);
    }
    
    writeNotes(notes);
    res.json(note);
});

// Delete a note
router.delete('/:type/:id', (req, res) => {
    const { type, id } = req.params;
    const notes = readNotes();
    
    if (notes[type]) {
        notes[type] = notes[type].filter(n => n.id !== id);
        writeNotes(notes);
    }
    
    res.json({ success: true });
});

module.exports = router;

