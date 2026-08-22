const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
};

export const api = {
  // Auth
  auth: {
    register: async (name, email, password) => {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, email, password }),
      });
      return handleResponse(res);
    },
    login: async (email, password) => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(res);
    },
    getMe: async () => {
      const res = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Tasks
  tasks: {
    getAll: async (filters = {}) => {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.priority) queryParams.append('priority', filters.priority);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.date) queryParams.append('date', filters.date);

      const res = await fetch(`${API_URL}/tasks?${queryParams.toString()}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (taskData) => {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(taskData),
      });
      return handleResponse(res);
    },
    update: async (id, taskData) => {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(taskData),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Goals
  goals: {
    getAll: async () => {
      const res = await fetch(`${API_URL}/goals`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (goalData) => {
      const res = await fetch(`${API_URL}/goals`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(goalData),
      });
      return handleResponse(res);
    },
    update: async (id, goalData) => {
      const res = await fetch(`${API_URL}/goals/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(goalData),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_URL}/goals/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Analytics
  analytics: {
    getSummary: async () => {
      const res = await fetch(`${API_URL}/analytics/summary`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getWeekly: async () => {
      const res = await fetch(`${API_URL}/analytics/weekly`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getCategories: async () => {
      const res = await fetch(`${API_URL}/analytics/categories`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    logFocus: async (minutes) => {
      const res = await fetch(`${API_URL}/analytics/focus`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ minutes }),
      });
      return handleResponse(res);
    },
  },

  // Notifications
  notifications: {
    getAll: async () => {
      const res = await fetch(`${API_URL}/notifications`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    markRead: async (id) => {
      const res = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    markAllRead: async () => {
      const res = await fetch(`${API_URL}/notifications/read-all`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_URL}/notifications/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },
};
