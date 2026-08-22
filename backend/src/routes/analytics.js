import express from 'express';
import prisma from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware
router.use(authenticateToken);

// Get current date string in YYYY-MM-DD format (local time)
const getLocalDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Calculate Streak Helper
const calculateStreak = (logs) => {
  if (logs.length === 0) return 0;
  
  // Sort logs by date descending
  const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));
  
  const todayStr = getLocalDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // If the most recent log isn't today or yesterday, streak is broken
  const latestLogDate = sortedLogs[0].date;
  if (latestLogDate !== todayStr && latestLogDate !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  let currentDateToCheck = new Date(latestLogDate);

  for (let i = 0; i < sortedLogs.length; i++) {
    const expectedStr = currentDateToCheck.toISOString().split('T')[0];
    const log = sortedLogs.find(l => l.date === expectedStr);

    if (log && (log.completedTasks > 0 || log.focusMinutes > 0)) {
      streak++;
      // Move to the previous day
      currentDateToCheck.setDate(currentDateToCheck.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

// GET /api/analytics/summary
router.get('/summary', async (req, res) => {
  const userId = req.user.id;

  try {
    const tasks = await prisma.task.findMany({ where: { userId } });
    const logs = await prisma.productivityLog.findMany({ where: { userId } });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
    const pendingTasks = totalTasks - completedTasks;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Calculate total focus hours
    const totalFocusMinutes = logs.reduce((sum, log) => sum + log.focusMinutes, 0);
    const focusHours = parseFloat((totalFocusMinutes / 60).toFixed(1));

    // Calculate overall productivity score (weighted)
    let earnedPoints = 0;
    let potentialPoints = 0;
    tasks.forEach(task => {
      const weight = task.priority === 'HIGH' ? 30 : task.priority === 'MEDIUM' ? 20 : 10;
      potentialPoints += weight;
      if (task.status === 'COMPLETED') {
        earnedPoints += weight;
      }
    });
    const productivityScore = potentialPoints > 0 ? Math.round((earnedPoints / potentialPoints) * 100) : 0;

    // Streak calculation
    const currentStreak = calculateStreak(logs);

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      completionPercentage,
      productivityScore,
      focusHours,
      currentStreak,
    });
  } catch (error) {
    console.error('Summary Analytics Error:', error);
    res.status(500).json({ error: 'Server error fetching summary analytics' });
  }
});

// GET /api/analytics/weekly
router.get('/weekly', async (req, res) => {
  const userId = req.user.id;

  try {
    const weeklyTrend = [];
    const today = new Date();
    
    // Get all tasks to filter in memory
    const tasks = await prisma.task.findMany({ where: { userId } });

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

      const completedOnDay = tasks.filter(task => {
        if (task.status !== 'COMPLETED' || !task.dueDate) return false;
        const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
        return taskDate === dateString;
      }).length;

      const totalOnDay = tasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
        return taskDate === dateString;
      }).length;

      weeklyTrend.push({
        day: dayName,
        date: dateString,
        completed: completedOnDay,
        total: totalOnDay,
      });
    }

    res.json(weeklyTrend);
  } catch (error) {
    console.error('Weekly Analytics Error:', error);
    res.status(500).json({ error: 'Server error fetching weekly analytics' });
  }
});

// GET /api/analytics/categories
router.get('/categories', async (req, res) => {
  const userId = req.user.id;

  try {
    const tasks = await prisma.task.findMany({ where: { userId } });

    const categoryCounts = {
      WORK: 0,
      STUDY: 0,
      PERSONAL: 0,
      HEALTH: 0,
      OTHER: 0
    };

    tasks.forEach(task => {
      const cat = task.category.toUpperCase();
      if (categoryCounts[cat] !== undefined) {
        categoryCounts[cat]++;
      } else {
        categoryCounts['OTHER']++;
      }
    });

    const categoryDistribution = Object.keys(categoryCounts).map(name => ({
      name,
      value: categoryCounts[name],
    }));

    res.json(categoryDistribution);
  } catch (error) {
    console.error('Category Analytics Error:', error);
    res.status(500).json({ error: 'Server error fetching category analytics' });
  }
});

// POST /api/analytics/focus
// Endpoint to log focus minutes (Pomodoro finish)
router.post('/focus', async (req, res) => {
  const userId = req.user.id;
  const { minutes } = req.body;

  if (!minutes || isNaN(minutes)) {
    return res.status(400).json({ error: 'Valid focus minutes are required' });
  }

  const todayStr = getLocalDateString();

  try {
    // Count user's completed tasks for today to save in the log
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const completedTasksToday = await prisma.task.count({
      where: {
        userId,
        status: 'COMPLETED',
        dueDate: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    });

    // Compute productivity score for today
    const totalTasksToday = await prisma.task.count({
      where: {
        userId,
        dueDate: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    });

    const dailyScore = totalTasksToday > 0 ? Math.round((completedTasksToday / totalTasksToday) * 100) : 100;

    // Upsert productivity log for today
    const log = await prisma.productivityLog.upsert({
      where: {
        userId_date: {
          userId,
          date: todayStr,
        },
      },
      update: {
        focusMinutes: { increment: parseInt(minutes) },
        completedTasks: completedTasksToday,
        productivityScore: dailyScore,
      },
      create: {
        userId,
        date: todayStr,
        focusMinutes: parseInt(minutes),
        completedTasks: completedTasksToday,
        productivityScore: dailyScore,
      },
    });

    // Create a notification for achievement if user logs first focus session today
    if (log.focusMinutes === parseInt(minutes)) {
      await prisma.notification.create({
        data: {
          userId,
          title: 'First Focus Session!',
          message: `Congratulations on completing a ${minutes}-minute focus session today. Keep it up!`,
          type: 'ACHIEVEMENT',
        },
      });
    }

    res.json(log);
  } catch (error) {
    console.error('Record Focus Error:', error);
    res.status(500).json({ error: 'Server error logging focus minutes' });
  }
});

export default router;
