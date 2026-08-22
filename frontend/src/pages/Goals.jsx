import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Plus, 
  Target, 
  Edit3, 
  Trash2, 
  Calendar, 
  CheckCircle2, 
  TrendingUp, 
  X,
  PlusCircle,
  MinusCircle,
  Loader
} from 'lucide-react';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target: 100,
    currentProgress: 0,
    deadline: '',
    status: 'IN_PROGRESS',
  });

  const fetchGoals = async () => {
    try {
      const data = await api.goals.getAll();
      setGoals(data);
    } catch (err) {
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleOpenCreate = () => {
    setEditingGoal(null);
    setFormData({
      title: '',
      description: '',
      target: 100,
      currentProgress: 0,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days out
      status: 'IN_PROGRESS',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      target: goal.target,
      currentProgress: goal.currentProgress,
      deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
      status: goal.status,
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      const payload = {
        ...formData,
        target: parseInt(formData.target) || 100,
        currentProgress: parseInt(formData.currentProgress) || 0,
        deadline: formData.deadline ? new Date(formData.deadline) : null,
      };

      if (editingGoal) {
        await api.goals.update(editingGoal.id, payload);
      } else {
        await api.goals.create(payload);
      }
      setModalOpen(false);
      fetchGoals();
    } catch (err) {
      console.error('Error saving goal:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await api.goals.delete(id);
        fetchGoals();
      } catch (err) {
        console.error('Error deleting goal:', err);
      }
    }
  };

  const handleQuickProgressUpdate = async (goal, direction) => {
    const increment = 5;
    let nextProgress = goal.currentProgress;

    if (direction === 'up') {
      nextProgress = Math.min(goal.target, goal.currentProgress + increment);
    } else {
      nextProgress = Math.max(0, goal.currentProgress - increment);
    }

    const payload = {
      currentProgress: nextProgress,
      status: nextProgress >= goal.target ? 'COMPLETED' : 'IN_PROGRESS',
    };

    try {
      // Optimistic update
      setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, ...payload } : g));
      await api.goals.update(goal.id, payload);
    } catch (err) {
      console.error('Error updating progress:', err);
      fetchGoals(); // Revert
    }
  };

  const getPercent = (current, target) => {
    if (!target) return 0;
    return Math.round((current / target) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Milestones & Goals</h2>
          <p className="text-xs text-slate-500 font-medium">Track long-term productivity and set targets</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-indigo-600/10 transition-all text-xs"
        >
          <Plus size={16} />
          <span>New Goal</span>
        </button>
      </div>

      {/* Goal Cards Grid */}
      {goals.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <Target size={48} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-700">No active goals yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Setting clear targets is the first step to daily focus. Create your first goal now!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(goal => {
            const percent = getPercent(goal.currentProgress, goal.target);
            const isCompleted = goal.status === 'COMPLETED' || percent >= 100;

            return (
              <div 
                key={goal.id} 
                className={`bg-white border p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 ${
                  isCompleted ? 'border-emerald-200 bg-emerald-50/5' : 'border-slate-200/60'
                }`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className={`text-sm font-bold text-slate-950 leading-tight ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                      {goal.title}
                    </h3>
                    {isCompleted ? (
                      <span className="text-[9px] font-black text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded uppercase">DONE</span>
                    ) : (
                      <span className="text-[9px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded uppercase">TRACKING</span>
                    )}
                  </div>

                  {goal.description && (
                    <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">{goal.description}</p>
                  )}
                </div>

                {/* Progress Indicators */}
                <div className="space-y-3 pt-3 border-t border-slate-50">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>Progress: {percent}%</span>
                    <span>{goal.currentProgress} / {goal.target}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>

                  {/* Inline quick incrementers */}
                  {!isCompleted && (
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 pt-1">
                      <span>Quick adjust</span>
                      <div className="flex items-center space-x-1.5 text-slate-500">
                        <button 
                          onClick={() => handleQuickProgressUpdate(goal, 'down')}
                          className="hover:text-indigo-600"
                        >
                          <MinusCircle size={16} />
                        </button>
                        <button 
                          onClick={() => handleQuickProgressUpdate(goal, 'up')}
                          className="hover:text-indigo-600"
                        >
                          <PlusCircle size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer Details */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-[10px] font-bold text-slate-400 uppercase">
                  <span className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>
                      {goal.deadline ? new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Deadline'}
                    </span>
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEdit(goal)}
                      className="p-1 rounded hover:bg-slate-50 text-slate-400 hover:text-indigo-600"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="p-1 rounded hover:bg-slate-50 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Goal Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-black text-slate-950">
                {editingGoal ? 'Edit Goal' : 'Set New Goal'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Learn React, Workout"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white px-4 py-3 rounded-2xl text-slate-900 text-sm font-semibold outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  placeholder="Notes about this goal (optional)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="2"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white px-4 py-3 rounded-2xl text-slate-900 text-sm font-medium outline-none transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Target Value</label>
                  <input
                    type="number"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 outline-none"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Current Progress</label>
                  <input
                    type="number"
                    value={formData.currentProgress}
                    onChange={(e) => setFormData({ ...formData, currentProgress: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 outline-none"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Target Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 outline-none"
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
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
