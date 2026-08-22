import express from 'express';
import prisma from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware
router.use(authenticateToken);

// Get all notifications for user
router.get('/', async (req, res) => {
  const userId = req.user.id;
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(notifications);
  } catch (error) {
    console.error('Fetch Notifications Error:', error);
    res.status(500).json({ error: 'Server error while fetching notifications' });
  }
});

// Mark single notification as read
router.put('/:id/read', async (req, res) => {
  const userId = req.user.id;
  const notificationId = req.params.id;

  try {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true }
    });

    res.json(updated);
  } catch (error) {
    console.error('Update Notification Error:', error);
    res.status(500).json({ error: 'Server error while updating notification' });
  }
});

// Mark all notifications as read
router.put('/read-all', async (req, res) => {
  const userId = req.user.id;
  try {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true }
    });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark All Read Error:', error);
    res.status(500).json({ error: 'Server error marking notifications as read' });
  }
});

// Delete a notification
router.delete('/:id', async (req, res) => {
  const userId = req.user.id;
  const notificationId = req.params.id;

  try {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.notification.delete({
      where: { id: notificationId }
    });

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete Notification Error:', error);
    res.status(500).json({ error: 'Server error deleting notification' });
  }
});

export default router;
