import express from 'express';
import prisma from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware
router.use(authenticateToken);

// Get all goals
router.get('/', async (req, res) => {
  const userId = req.user.id;
  try {
    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(goals);
  } catch (error) {
    console.error('Fetch Goals Error:', error);
    res.status(500).json({ error: 'Server error while fetching goals' });
  }
});

// Create a goal
router.post('/', async (req, res) => {
  const userId = req.user.id;
  const { title, description, target, currentProgress, deadline, status } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Goal title is required' });
  }

  try {
    const goal = await prisma.goal.create({
      data: {
        userId,
        title,
        description,
        target: target !== undefined ? parseInt(target) : 100,
        currentProgress: currentProgress !== undefined ? parseInt(currentProgress) : 0,
        deadline: deadline ? new Date(deadline) : null,
        status: status || 'IN_PROGRESS',
      },
    });
    res.status(201).json(goal);
  } catch (error) {
    console.error('Create Goal Error:', error);
    res.status(500).json({ error: 'Server error while creating goal' });
  }
});

// Update a goal
router.put('/:id', async (req, res) => {
  const userId = req.user.id;
  const goalId = req.params.id;
  const { title, description, target, currentProgress, deadline, status } = req.body;

  try {
    const existingGoal = await prisma.goal.findUnique({
      where: { id: goalId },
    });

    if (!existingGoal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    if (existingGoal.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedGoal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        title: title !== undefined ? title : existingGoal.title,
        description: description !== undefined ? description : existingGoal.description,
        target: target !== undefined ? parseInt(target) : existingGoal.target,
        currentProgress: currentProgress !== undefined ? parseInt(currentProgress) : existingGoal.currentProgress,
        deadline: deadline !== undefined ? (deadline ? new Date(deadline) : null) : existingGoal.deadline,
        status: status !== undefined ? status : existingGoal.status,
      },
    });
    res.json(updatedGoal);
  } catch (error) {
    console.error('Update Goal Error:', error);
    res.status(500).json({ error: 'Server error while updating goal' });
  }
});

// Delete a goal
router.delete('/:id', async (req, res) => {
  const userId = req.user.id;
  const goalId = req.params.id;

  try {
    const existingGoal = await prisma.goal.findUnique({
      where: { id: goalId },
    });

    if (!existingGoal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    if (existingGoal.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.goal.delete({
      where: { id: goalId },
    });
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete Goal Error:', error);
    res.status(500).json({ error: 'Server error while deleting goal' });
  }
});

export default router;
