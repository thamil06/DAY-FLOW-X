import express from 'express';
import prisma from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all task routes
router.use(authenticateToken);

// Get all tasks for the logged-in user with filters
router.get('/', async (req, res) => {
  const userId = req.user.id;
  const { status, priority, category, date } = req.query;

  try {
    const filter = { userId };

    if (status) {
      filter.status = status;
    }
    if (priority) {
      filter.priority = priority;
    }
    if (category) {
      filter.category = category;
    }
    if (date) {
      // Filter tasks where dueDate is on this specific day (disregarding time)
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      filter.dueDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const tasks = await prisma.task.findMany({
      where: filter,
      orderBy: [
        { dueDate: 'asc' },
        { scheduledTime: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    res.json(tasks);
  } catch (error) {
    console.error('Fetch Tasks Error:', error);
    res.status(500).json({ error: 'Server error while fetching tasks' });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  const userId = req.user.id;
  const { title, description, status, priority, category, dueDate, scheduledTime, durationMinutes } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  try {
    const task = await prisma.task.create({
      data: {
        userId,
        title,
        description,
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        category: category || 'General',
        dueDate: dueDate ? new Date(dueDate) : null,
        scheduledTime: scheduledTime || null,
        durationMinutes: durationMinutes !== undefined ? parseInt(durationMinutes) : 30,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Create Task Error:', error);
    res.status(500).json({ error: 'Server error while creating task' });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;
  const { title, description, status, priority, category, dueDate, scheduledTime, durationMinutes } = req.body;

  try {
    // Verify task ownership
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (existingTask.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this task' });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: title !== undefined ? title : existingTask.title,
        description: description !== undefined ? description : existingTask.description,
        status: status !== undefined ? status : existingTask.status,
        priority: priority !== undefined ? priority : existingTask.priority,
        category: category !== undefined ? category : existingTask.category,
        dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : existingTask.dueDate,
        scheduledTime: scheduledTime !== undefined ? scheduledTime : existingTask.scheduledTime,
        durationMinutes: durationMinutes !== undefined ? parseInt(durationMinutes) : existingTask.durationMinutes,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error('Update Task Error:', error);
    res.status(500).json({ error: 'Server error while updating task' });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;

  try {
    // Verify task ownership
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (existingTask.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this task' });
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete Task Error:', error);
    res.status(500).json({ error: 'Server error while deleting task' });
  }
});

export default router;
