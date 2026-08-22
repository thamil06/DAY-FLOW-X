import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus, 
  Calendar,
  AlertCircle,
  X
} from 'lucide-react';

const DailyPlanner = () => {
  const { tasks, refreshTasks, createTask } = useTasks();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [targetHour, setTargetHour] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    category: 'WORK',
    scheduledTime: '',
    durationMinutes: 60,
  });

  const dateString = selectedDate.toISOString().split('T')[0];

  useEffect(() => {
    refreshTasks({ date: dateString });
  }, [refreshTasks, dateString]);

  // List of hours from 07:00 AM to 10:00 PM
  const timeSlots = [
    { label: '07:00 AM', value: '07:00' },
    { label: '08:00 AM', value: '08:00' },
    { label: '09:00 AM', value: '09:00' },
    { label: '10:00 AM', value: '10:00' },
    { label: '11:00 AM', value: '11:00' },
    { label: '12:00 PM', value: '12:00' },
    { label: '01:00 PM', value: '13:00' },
    { label: '02:00 PM', value: '14:00' },
    { label: '03:00 PM', value: '15:00' },
    { label: '04:00 PM', value: '16:00' },
    { label: '05:00 PM', value: '17:00' },
    { label: '06:00 PM', value: '18:00' },
    { label: '07:00 PM', value: '19:00' },
    { label: '08:00 PM', value: '20:00' },
    { label: '09:00 PM', value: '21:00' },
    { label: '10:00 PM', value: '22:00' },
  ];

  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(selectedDate.getDate() - 1);
    setSelectedDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(selectedDate.getDate() + 1);
    setSelectedDate(next);
  };

  const handleSetToday = () => {
    setSelectedDate(new Date());
  };

  const handleTimeBlockClick = (hourValue) => {
    setTargetHour(hourValue);
    setFormData({
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      category: 'WORK',
      scheduledTime: hourValue,
      durationMinutes: 60,
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      await createTask({
        ...formData,
        dueDate: selectedDate,
      });
      setModalOpen(false);
    } catch (err) {
      console.error('Error creating scheduled task:', err);
    }
  };

  // Helper to check if task falls under a specific hourly time slot
  // A task matches if its scheduledTime (e.g. "09:30") is in the hour range [09:00, 10:00)
  const getTasksForHour = (hourVal) => {
    return tasks.filter(task => {
      if (!task.scheduledTime) return false;
      const [taskHr] = task.scheduledTime.split(':');
      const targetHr = hourVal.split(':')[0];
      return taskHr === targetHr;
    });
  };

  const getPriorityColor = (p) => {
    if (p === 'HIGH') return 'bg-red-500 text-white';
    if (p === 'MEDIUM') return 'bg-amber-500 text-white';
    return 'bg-slate-400 text-white';
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Date Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white border border-slate-100 p-5 rounded-3xl shadow-sm gap-4">
        <div className="flex items-center space-x-2">
          <button 
            onClick={handlePrevDay} 
            className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={handleSetToday} 
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all"
          >
            Today
          </button>
          <button 
            onClick={handleNextDay} 
            className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="flex items-center space-x-3 text-slate-800 font-black">
          <Calendar size={18} className="text-indigo-600" />
          <span className="text-sm md:text-base tracking-tight">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Hourly Timeline Sheet */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <div className="space-y-4">
          {timeSlots.map((slot) => {
            const slotTasks = getTasksForHour(slot.value);

            return (
              <div key={slot.value} className="flex group min-h-[64px] border-b border-slate-50 last:border-0 pb-3">
                {/* Time Indicator */}
                <div className="w-24 text-slate-400 text-xs font-extrabold flex items-center pr-4 border-r border-slate-100">
                  {slot.label}
                </div>

                {/* Tasks Container */}
                <div className="flex-1 pl-6 flex flex-col md:flex-row gap-3 items-stretch justify-start min-w-0">
                  {slotTasks.length > 0 ? (
                    slotTasks.map(task => (
                      <div 
                        key={task.id} 
                        className={`flex-1 md:max-w-md p-3.5 rounded-2xl flex flex-col justify-between border border-slate-200/40 shadow-sm transition-all hover:shadow-md ${
                          task.status === 'COMPLETED' 
                            ? 'bg-slate-50/80 border-slate-100 opacity-60' 
                            : 'bg-indigo-50/40 border-indigo-100/50'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`text-xs font-bold leading-tight ${task.status === 'COMPLETED' ? 'line-through text-slate-400 font-semibold' : 'text-slate-900'}`}>
                              {task.title}
                            </h4>
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                          {task.description && (
                            <p className="text-[10px] text-slate-500 font-medium truncate mt-1">{task.description}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-3 text-[9px] text-slate-400 font-extrabold uppercase">
                          <span>{task.category}</span>
                          <span className="flex items-center space-x-1">
                            <Clock size={10} />
                            <span>{task.scheduledTime} ({task.durationMinutes}m)</span>
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <button 
                      onClick={() => handleTimeBlockClick(slot.value)}
                      className="flex-1 py-3 text-left rounded-xl text-slate-300 hover:text-indigo-500 hover:bg-slate-50/60 transition-all text-xs font-bold flex items-center space-x-2 border border-transparent hover:border-indigo-100/55 px-4"
                    >
                      <Plus size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">Block this time...</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hourly Quick Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-black text-slate-950">Schedule Time Block: {targetHour}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Task or Event title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white px-4 py-3 rounded-2xl text-slate-900 text-sm font-semibold outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  placeholder="Details (optional)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="2"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white px-4 py-3 rounded-2xl text-slate-900 text-sm font-medium outline-none transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 outline-none"
                  >
                    <option value="WORK">Work</option>
                    <option value="STUDY">Study</option>
                    <option value="PERSONAL">Personal</option>
                    <option value="HEALTH">Health</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Duration (Minutes)</label>
                <input
                  type="number"
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white px-4 py-3 rounded-2xl text-slate-900 text-sm font-semibold outline-none transition-all"
                  min="5"
                />
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow-md"
                >
                  Schedule Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyPlanner;
