import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { api } from '../services/api';
import { 
  Zap, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Plus, 
  Calendar,
  ChevronRight,
  TrendingDown,
  Loader
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, refreshTasks, createTask, completeTask } = useTasks();

  const [summary, setSummary] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    completionPercentage: 0,
    productivityScore: 0,
    focusHours: 0,
    currentStreak: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCategory, setQuickCategory] = useState('WORK');
  const [quickPriority, setQuickPriority] = useState('MEDIUM');
  const [submittingTask, setSubmittingTask] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const fetchStats = async () => {
    try {
      const stats = await api.analytics.getSummary();
      setSummary(stats);
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Load tasks for today
    refreshTasks({ date: todayStr });
  }, [refreshTasks, todayStr]);

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    setSubmittingTask(true);
    try {
      await createTask({
        title: quickTitle,
        category: quickCategory,
        priority: quickPriority,
        dueDate: new Date(),
        status: 'TODO',
      });
      setQuickTitle('');
      fetchStats(); // Update stats
    } catch (err) {
      console.error('Quick add error:', err);
    } finally {
      setSubmittingTask(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeTask(id);
      fetchStats();
    } catch (err) {
      console.error('Error completing task:', err);
    }
  };

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 border border-indigo-950 shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl"></div>
        <div className="absolute right-20 -bottom-10 w-32 h-32 bg-violet-600/10 rounded-full blur-xl"></div>
        <div className="relative z-10">
          <p className="text-indigo-400 font-bold tracking-wider text-xs uppercase mb-1">PRODUCTIVITY ENGINE V2</p>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">{getGreeting()}, {user?.name || 'User'}!</h2>
          <p className="text-sm text-slate-300 font-medium mt-1">
            {summary.completionPercentage >= 75 
              ? "You're in your flow state today. Keep crushing it!" 
              : "Let's align your day. Check your schedule and block focus hours."}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Streak */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 rounded-xl bg-orange-50 text-orange-600">
            <Zap size={22} className="fill-orange-600/10" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Productivity Streak</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{loadingStats ? '—' : `${summary.currentStreak} Days`}</p>
          </div>
        </div>

        {/* Focus Hours */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 rounded-xl bg-indigo-50 text-indigo-600">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Focus Session Time</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{loadingStats ? '—' : `${summary.focusHours} Hrs`}</p>
          </div>
        </div>

        {/* Completion percentage */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Task Completion Rate</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{loadingStats ? '—' : `${summary.completionPercentage}%`}</p>
          </div>
        </div>

        {/* Productivity Score */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 rounded-xl bg-violet-50 text-violet-600">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Productivity Score</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{loadingStats ? '—' : `${summary.productivityScore} / 100`}</p>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-950">Today's Focus List</h3>
                <p className="text-xs text-slate-500 font-medium">Core tasks scheduled for today</p>
              </div>
              <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl">
                {tasks.filter(t => t.status === 'COMPLETED').length} / {tasks.length} Completed
              </span>
            </div>

            {/* List */}
            {tasks.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Calendar size={32} className="text-slate-400 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-600">No tasks on schedule for today</p>
                <p className="text-xs text-slate-400 mt-1">Use the quick add form or navigate to Tasks</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="group flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/60 rounded-2xl transition-all border border-slate-200/20">
                    <div className="flex items-center space-x-3.5 min-w-0">
                      <button 
                        onClick={() => task.status !== 'COMPLETED' && handleComplete(task.id)}
                        disabled={task.status === 'COMPLETED'}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          task.status === 'COMPLETED'
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-300 group-hover:border-indigo-600 text-transparent hover:text-indigo-600'
                        }`}
                      >
                        ✓
                      </button>
                      <div className="min-w-0">
                        <p className={`text-sm font-bold truncate text-slate-900 ${task.status === 'COMPLETED' ? 'line-through text-slate-400 font-medium' : ''}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center space-x-2.5 mt-1">
                          <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                            task.priority === 'HIGH' ? 'bg-red-50 text-red-600' :
                            task.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {task.priority}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{task.category}</span>
                          {task.scheduledTime && (
                            <span className="text-[10px] text-slate-400 font-medium flex items-center space-x-1">
                              <span>•</span> <span>{task.scheduledTime} ({task.durationMinutes} min)</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Widgets Column */}
        <div className="space-y-6">
          {/* Quick Add Task */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-950 mb-4">Quick Add Task</h3>
            <form onSubmit={handleQuickAdd} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="What are you working on?"
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white px-4 py-3 rounded-2xl text-slate-900 text-sm font-semibold outline-none transition-all"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={quickCategory}
                    onChange={(e) => setQuickCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 outline-none"
                  >
                    <option value="WORK">Work</option>
                    <option value="STUDY">Study</option>
                    <option value="PERSONAL">Personal</option>
                    <option value="HEALTH">Health</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Priority</label>
                  <select
                    value={quickPriority}
                    onChange={(e) => setQuickPriority(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={submittingTask || !quickTitle.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 text-xs transition-colors shadow-sm disabled:opacity-50"
              >
                {submittingTask ? <Loader className="animate-spin" size={14} /> : <Plus size={14} />}
                <span>Add to Today's List</span>
              </button>
            </form>
          </div>

          {/* Productivity Streak Visual */}
          <div className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute right-0 bottom-0 transform translate-x-4 translate-y-4 opacity-15">
              <Zap size={140} />
            </div>
            <h3 className="text-base font-extrabold text-white mb-2">Consistency Engine</h3>
            <p className="text-xs text-indigo-100 leading-relaxed font-medium">
              DAY-FLOW-X tracks logs daily. Complete at least one task or log focus minutes each day to maintain your streak multiplier!
            </p>
            <div className="mt-6 flex items-baseline space-x-2">
              <span className="text-4xl font-black">{summary.currentStreak}</span>
              <span className="text-sm font-bold text-indigo-200">days active streak</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
