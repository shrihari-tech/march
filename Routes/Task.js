const express = require('express');
const router = express.Router();
const Task = require('../Schema/Task');
const User = require('../Schema/User');

// Create a new task
router.post('/add', async (req, res) => {
    try {
        const { title, description, status, priority, createdBy } = req.body;
        const newTask = new Task({ title, description, status, priority, createdBy });
        await newTask.save();
        res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
});

// Get all tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().populate('createdBy', 'name email');
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
});

// Get task by userId
router.get('/task/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const tasks = await Task.find({ createdBy: userId }).populate('createdBy', 'name email');
        if (tasks.length > 0) {
            res.status(200).json(tasks);
        } else {
            res.status(404).json({ message: 'No tasks found for this user' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
}
);

// Update a task by if user is the creator of the task
router.put('/task/:userId/:taskId', async (req, res) => {
    try {
        const { userId, taskId } = req.params;
        const { title, description, status, priority } = req.body;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.createdBy.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to update this task' });
        }

        task.title = title;
        task.description = description;
        task.status = status;
        task.priority = priority;

        await task.save();
        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
});

// Delete a task by if user is the creator of the task
router.delete('/task/:userId/:taskId', async (req, res) => {
    try {
        const { userId, taskId } = req.params;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (task.createdBy.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this task' });
        }
        await Task.findByIdAndDelete(taskId);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
});

module.exports = router;
