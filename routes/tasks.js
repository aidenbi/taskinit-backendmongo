const express = require('express');
const router = express.Router();
const Task = require('../models/Task')



//GETS BACK ALL THE POSTS
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.json({ message: err });
    }
});

//SUBMITS A POST
router.post('/', async (req, res) => {
    const task = new Task({
        text: req.body.text,
        day: req.body.day,
        reminder: req.body.reminder,
        Difficulty: req.body.Difficulty,
        Completion: req.body.Completion,
        Username: req.body.Username
    });

    try {
        const savedTask = await task.save()
        res.json(savedTask)
    } catch (err) {
        res.json({ message: err });
    }
});


//SPECIFIC POST
router.get('/:taskId', async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        res.json(task);
    } catch (err) {
        res.json({ message: err });
    }
});

//Delete specific post
router.delete('/:taskId', async (req, res) => {
    try {
        const removedTask = await Task.remove({ _id: req.params.taskId });
        res.json(removedTask)
    } catch (err) {
        res.json({ message: err });
    }
});

//updates a post
router.patch('/:taskId', async (req, res) => {
    try {
        const updatedTask = await Task.updateOne({ _id: req.params.taskId }, {
            $set: {
                text: req.body.text,
                day: req.body.day,
                reminder: req.body.reminder,
                Difficulty: req.body.Difficulty,
                Completion: req.body.Completion,
                Username: req.body.Username
            }
        })
        res.json(updatedTask);
    } catch (err) {
        res.json({ message: err });
    }
})

module.exports = router;