import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';
import authStorage from '../services/authStorage';
import { AuthContext } from './AuthContext';

export const TaskContext = createContext();

export default TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchTasks();
      if (user.isAdmin) {
        fetchAllTasks();
      }
    }
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = await authStorage.getToken();
      const res = await api.get('/api/tasks/user', {
        headers: { 'x-auth-token': token },
      });
      setTasks(res.data);
    } catch (error) {
      // console.error('Error fetching tasks', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch "All Tasks" (Admin only)
  const fetchAllTasks = async () => {
    if (!user.isAdmin) return;
    setLoading(true);
    try {
      const token = await authStorage.getToken();
      const res = await api.get('/api/tasks/all', {
        headers: { 'x-auth-token': token },
      });
      setAllTasks(res.data);
    } catch (error) {
      console.error('Error fetching all tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      const token = await authStorage.getToken();
      const formData = new FormData();
      formData.append('title', taskData.title);
      formData.append('assignedTo', taskData.assignedTo);

      const res = await api.post('/api/tasks/create', formData, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      });

      return { success: true, data: res.data };
    } catch (error) {
      // console.error('Error creating task', error);
      return {
        success: false,
        message: error.response?.data?.msg || 'Failed to create task',
      };
    }
  };

  const completeTask = async (taskId, note, images) => {
    try {
      const token = await authStorage.getToken();
      const formData = new FormData();
      if (note) formData.append('note', note);

      if (images && images.length > 0) {
        images.forEach((image, index) => {
          formData.append('images', {
            uri: image.uri,
            type: 'image/jpeg',
            name: `image_${index}.jpg`,
          });
        });
      }

      const res = await api.put(`/api/tasks/${taskId}/complete`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token,
        },
      });

      setTasks(
        tasks.map((task) =>
          task._id === taskId ? res.data : task
        )
      );

      return { success: true, data: res.data };
    } catch (error) {
      // console.error('Error completing task', error);
      return {
        success: false,
        message: error.response?.data?.msg || 'Failed to complete task',
      };
    }
  };


  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        fetchTasks,
        createTask,
        completeTask,
        setTasks,
        allTasks,
        fetchAllTasks,
        fetchTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
