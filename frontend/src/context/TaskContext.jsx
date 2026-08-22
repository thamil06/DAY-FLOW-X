import React, { createContext, useState, useContext, useCallback } from 'react';
import { api } from '../services/api';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshTasks = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.tasks.getAll(filters);
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = async (taskData) => {
    setLoading(true);
    try {
      const newTask = await api.tasks.create(taskData);
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      console.error('Error creating task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, taskData) => {
    setLoading(true);
    try {
      const updatedTask = await api.tasks.update(id, taskData);
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
      return updatedTask;
    } catch (err) {
      console.error('Error updating task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    setLoading(true);
    try {
      await api.tasks.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (id) => {
    return updateTask(id, { status: 'COMPLETED' });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        refreshTasks,
        createTask,
        updateTask,
        deleteTask,
        completeTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
