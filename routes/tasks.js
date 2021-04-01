const express = require('express');
const { db } = require('../models/Task');
const router = express.Router();
const Task = require('../models/Task');
const { validateCookie } = require('./auth')

//GETS BACK ALL THE TASKS
router.get('/', validateCookie, async (req, res) => {
    if (req.protocol == 'http') {
        res.redirect('https://taskinit.herokuapp.com/');
    }
    try {
        console.log(res.locals.userid)
        const tasks = await Task.find({ UserID: res.locals.userid });
        res.json(tasks);
    } catch (err) {
        res.json({ msg: err });
    }
});

//SUBMITS A TASK
router.post('/', validateCookie, async (req, res) => {
    const task = new Task({
        text: req.body.text,
        day: req.body.day,
        reminder: req.body.reminder,
        Difficulty: req.body.Difficulty,
        Completion: req.body.Completion,
        UserID: res.locals.userid
    });

    try {
        const savedTask = await task.save()
        res.json(savedTask)
    } catch (err) {
        res.json({ msg: err });
    }
});


//SPECIFIC TASK
router.get('/:taskId', async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        res.json(task);
    } catch (err) {
        res.json({ msg: err });
    }
});

//Delete specific post
// TODO make delete request user specific
router.delete('/:taskId', async (req, res) => {
    try {
        const removedTask = await Task.deleteOne({ _id: req.params.taskId });
        res.json(removedTask)
    } catch (err) {
        res.json({ msg: err });
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
        res.json({ msg: err });
    }
})

module.exports = router;