import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List as ListIcon, 
  Edit3, 
  Trash2, 
  Check, 
  Calendar, 
  Clock, 
  AlertCircle,
  X,
  PlusCircle,
  MoreVertical
} from 'lucide-react';

const TaskManagement = () => {
  const { tasks, refreshTasks, createTask, updateTask, deleteTask } = useTasks();

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('dueDate'); // dueDate, priority, title

  // Layout View State
  const [viewMode, setViewMode] = useState('kanban'); // kanban, list

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // null means creating
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    category: 'WORK',
    dueDate: '',
    scheduledTime: '',
    durationMinutes: 30,
  });

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  const handleOpenCreate = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      category: 'WORK',
      dueDate: new Date().toISOString().split('T')[0],
      scheduledTime: '09:00',
      durationMinutes: 30,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      scheduledTime: task.scheduledTime || '',
      durationMinutes: task.durationMinutes || 30,
    });
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'durationMinutes' ? parseInt(value) || 0 : value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      const taskPayload = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
      };

      if (editingTask) {
        await updateTask(editingTask.id, taskPayload);
      } else {
        await createTask(taskPayload);
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Error saving task:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTask(id, { status: newStatus });
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  // Filter and Sort Processing
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'ALL' || task.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'priority') {
      const weight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      return weight[b.priority] - weight[a.priority];
    }
    return 0;
  });

  const getPriorityBadgeColor = (p) => {
    if (p === 'HIGH') return 'bg-red-50 text-red-700 border-red-100';
    if (p === 'MEDIUM') return 'bg-amber-50 text-amber-700 border-amber-100';
    return 'bg-slate-50 text-slate-600 border-slate-100';
  };

  const getCategoryBadgeColor = (c) => {
    if (c === 'WORK') return 'bg-indigo-50 text-indigo-700 border-indigo-100';
    if (c === 'STUDY') return 'bg-purple-50 text-purple-700 border-purple-100';
    if (c === 'PERSONAL') return 'bg-blue-50 text-blue-700 border-blue-100';
    if (c === 'HEALTH') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Task Workspace</h2>
          <p className="text-xs text-slate-500 font-medium">Manage, categorize, and prioritize your workload</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-indigo-600/10 transition-all text-xs"
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col xl:flex-row gap-4 bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white pl-10 pr-4 py-3 rounded-xl text-slate-800 text-sm font-semibold outline-none transition-all"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="WORK">Work</option>
            <option value="STUDY">Study</option>
            <option value="PERSONAL">Personal</option>
            <option value="HEALTH">Health</option>
            <option value="OTHER">Other</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 outline-none"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>

        {/* View Mode Toggles */}
        <div className="flex bg-slate-100 p-1 rounded-xl items-center self-start xl:self-center">
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'kanban' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Kanban Board"
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="List View"
          >
            <ListIcon size={16} />
          </button>
        </div>
      </div>

      {/* Main Workspace Layouts */}
      {viewMode === 'list' ? (
        /* List Layout */
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          {sortedTasks.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <AlertCircle size={36} className="text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-600">No tasks found matching criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest pb-3">
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Schedule</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sortedTasks.map(task => (
                    <tr key={task.id} className="hover:bg-slate-50/50 group transition-all">
                      <td className="py-4 px-4">
                        <p className={`text-sm font-bold text-slate-900 ${task.status === 'COMPLETED' ? 'line-through text-slate-400' : ''}`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-slate-500 font-medium truncate max-w-md mt-0.5">{task.description}</p>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                          className="bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg text-xs font-bold text-slate-600 outline-none"
                        >
                          <option value="TODO">To Do</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getPriorityBadgeColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getCategoryBadgeColor(task.category)}`}>
                          {task.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs font-medium text-slate-500">
                        {task.dueDate ? (
                          <div className="flex items-center space-x-1.5">
                            <Calendar size={13} />
                            <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            {task.scheduledTime && (
                              <>
                                <Clock size={13} className="ml-2" />
                                <span>{task.scheduledTime}</span>
                              </>
                            )}
                          </div>
                        ) : 'Not scheduled'}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end items-center space-x-2">
                          <button
                            onClick={() => handleOpenEdit(task)}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Kanban Layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {['TODO', 'IN_PROGRESS', 'COMPLETED'].map(colStatus => {
            const columnTasks = sortedTasks.filter(t => t.status === colStatus);
            const columnHeaders = {
              TODO: { title: 'To Do', color: 'bg-slate-500/10 text-slate-700' },
              IN_PROGRESS: { title: 'In Progress', color: 'bg-amber-500/10 text-amber-700' },
              COMPLETED: { title: 'Completed', color: 'bg-emerald-500/10 text-emerald-700' }
            };

            return (
              <div key={colStatus} className="bg-slate-100/50 border border-slate-200/20 rounded-3xl p-5 flex flex-col min-h-[500px]">
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-xs font-black uppercase px-3 py-1.5 rounded-xl ${columnHeaders[colStatus].color}`}>
                    {columnHeaders[colStatus].title}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{columnTasks.length}</span>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto">
                  {columnTasks.map(task => (
                    <div 
                      key={task.id} 
                      className="bg-white border border-slate-200/60 hover:border-slate-300 p-4.5 rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-all group"
                    >
                      <div className="space-y-1">
                        <p className={`text-sm font-bold text-slate-900 ${task.status === 'COMPLETED' ? 'line-through text-slate-400 font-medium' : ''}`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">{task.description}</p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${getPriorityBadgeColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${getCategoryBadgeColor(task.category)}`}>
                          {task.category}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-3.5 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400 font-medium flex items-center space-x-1">
                          <Calendar size={11} />
                          <span>
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}
                          </span>
                        </span>

                        <div className="flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEdit(task)}
                            className="p-1 rounded bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-400 transition-colors"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="p-1 rounded bg-slate-50 hover:bg-red-50 hover:text-red-600 text-slate-400 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200/50 rounded-2xl">
                      <p className="text-xs font-semibold text-slate-400">Empty column</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Creation & Modification Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up">
            {/* Modal Title Bar */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-base font-black text-slate-950">
                {editingTask ? 'Edit Task Details' : 'Create New Task'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="Task title"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white px-4 py-3 rounded-2xl text-slate-900 text-sm font-semibold outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Details/notes (optional)"
                  rows="3"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white px-4 py-3 rounded-2xl text-slate-900 text-sm font-medium outline-none transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 outline-none"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 outline-none"
                  >
                    <option value="WORK">Work</option>
                    <option value="STUDY">Study</option>
                    <option value="PERSONAL">Personal</option>
                    <option value="HEALTH">Health</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Time</label>
                  <input
                    type="text"
                    name="scheduledTime"
                    placeholder="09:00"
                    value={formData.scheduledTime}
                    onChange={handleFormChange}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  name="durationMinutes"
                  value={formData.durationMinutes}
                  onChange={handleFormChange}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white px-4 py-3 rounded-2xl text-slate-900 text-sm font-semibold outline-none transition-all"
                  min="0"
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
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow-md shadow-indigo-600/10"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;
