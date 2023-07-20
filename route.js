const fs = require("fs").promises;
const uniqId = require("uniqid");
const express = require("express");
const router = express.Router();

// Route to get all notes
router.get('/api/notes', async (req, res) => {
    try {
        const data = await fs.readFile('./db/db.json', 'utf-8');
        const parsedData = JSON.parse(data);
        res.status(200).json(parsedData);
    } catch (error) {
        console.error('Error while reading the notes:', error);
        res.status(200).json({ message: 'Internal server error' });
    }
});

// Route to add a new note
router.post('/api/notes', async (req, res) => {
    try {
        const newNote = { ...req.body, id: uniqId() };
        const data = await fs.readFile("./db/db.json", "utf8");
        const notes = JSON.parse(data);
        notes.unshift(newNote);

        await fs.writeFile("./db/db.json", JSON.stringify(notes));
        console.log("Successfully added a new note.");
        res.json(notes);
    } catch (error) {
        console.error('Error while adding a new note:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to delete a note
router.delete('/api/notes/:id', async (req, res) => {
    try {
        const data = await fs.readFile("./db/db.json", "utf8");
        const notes = JSON.parse(data);

        const remainingNotes = notes.filter(note => note.id !== req.params.id);
        await fs.writeFile("./db/db.json", JSON.stringify(remainingNotes));

        res.status(200).json(remainingNotes);
    } catch (error) {
        console.error('Error while deleting a note:', error);
        res.status(200).json({ message: 'Internal server error' });
    }
});

module.exports = router;
