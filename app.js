const express = require('express');
const { connecttodb, getDb } = require('./db');
const { ObjectId } = require('mongodb');

const app = express();
app.use(express.json()); 

let db;

connecttodb((err) => {
    if (!err) {
        db = getDb();

        app.listen(3000, () => {
            console.log("App Started On Port 3000");
        });
    } else {
        console.log("Failed to connect to DB");
    }
});



// GET all student
app.get('/student', async (req, res) => {
    try {
        const student = await db.collection('student').find().toArray();
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch student' });
    }
});

// GET student by ID
app.get('/student/:id', async (req, res) => {
    try {
        const student = await db.collection('student').findOne({ _id: new ObjectId(req.params.id) });
        if (!student) return res.status(404).json({ error: 'student not found' });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: 'Invalid ID format or server error' });
    }
});

// POST new student
app.post('/student', async (req, res) => {
    try {
        const newstudent = req.body; // e.g. { title: "...", author: "..." }
        const result = await db.collection('student').insertOne(newstudent);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: 'Failed to insert student' });
    }
});

// PUT update student by ID
app.put('/student/:id', async (req, res) => {
    try {
        const updatedData = req.body;
        const result = await db.collection('student').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updatedData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'student not found' });
        }

        res.json({ message: 'student updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update student' });
    }
});
// DELETE student by ID
app.delete('/student/:id', async (req, res) => {
    try {
        const result = await db.collection('student').deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'student not found' });
        }

        res.json({ message: 'student deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete student' });
    }
});