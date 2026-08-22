import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Bell, 
  Check, 
  Trash2, 
  AlertCircle, 
  Award, 
  Calendar, 
  Timer, 
  Inbox,
  Loader
} from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await api.notifications.getAll();
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      await api.notifications.markRead(id);
    } catch (err) {
      console.error('Error marking read:', err);
      fetchNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      await api.notifications.markAllRead();
    } catch (err) {
      console.error('Error marking all read:', err);
      fetchNotifications();
    }
  };

  const handleDelete = async (id) => {
    try {
      setNotifications(prev => prev.filter(n => n.id !== id));
      await api.notifications.delete(id);
    } catch (err) {
      console.error('Error deleting notification:', err);
      fetchNotifications();
    }
  };

  const getIcon = (type) => {
    if (type === 'ACHIEVEMENT') return <Award className="text-amber-500" size={18} />;
    if (type === 'TASK_REMINDER') return <Calendar className="text-indigo-500" size={18} />;
    if (type === 'OVERDUE') return <AlertCircle className="text-red-500" size={18} />;
    return <Bell className="text-slate-500" size={18} />;
  };

  const getBGColor = (read) => {
    return read ? 'bg-white opacity-60 border-slate-100' : 'bg-white border-indigo-100 shadow-sm';
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 font-sans max-w-4xl mx-auto">
      {/* Control Panel Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Notification Center</h2>
          <p className="text-xs text-slate-500 font-medium">Keep track of your productivity alerts and schedules</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl transition-all text-xs"
          >
            <Check size={14} />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <Inbox size={48} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-700">Inbox is empty</h3>
          <p className="text-xs text-slate-400 mt-1">
            You'll get notifications here about streaks, focus milestones, and schedules.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(notif => (
            <div 
              key={notif.id} 
              className={`border p-4.5 rounded-2xl transition-all flex items-start justify-between gap-4 ${getBGColor(notif.read)}`}
            >
              <div className="flex items-start space-x-3.5 min-w-0">
                <div className={`p-2.5 rounded-xl ${notif.read ? 'bg-slate-100' : 'bg-indigo-50'} flex-shrink-0 mt-0.5`}>
                  {getIcon(notif.type)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline space-x-2">
                    <h4 className="text-sm font-bold text-slate-950 truncate">{notif.title}</h4>
                    {!notif.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 flex-shrink-0"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">{notif.message}</p>
                  <span className="text-[10px] text-slate-400 font-bold block mt-2">
                    {new Date(notif.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{' '}
                    {new Date(notif.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 flex-shrink-0">
                {!notif.read && (
                  <button
                    onClick={() => handleMarkRead(notif.id)}
                    className="p-1.5 rounded bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors"
                    title="Mark Read"
                  >
                    <Check size={14} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(notif.id)}
                  className="p-1.5 rounded bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
