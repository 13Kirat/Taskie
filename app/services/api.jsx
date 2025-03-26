
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import authStorage from './authStorage';

// Create axios instance with base configuration
export const api = axios.create({
    // Replace with your server IP or domain
    baseURL: 'https://server-348n.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await authStorage.getToken('token');
            if (token) {
                config.headers['x-auth-token'] = token;
            }
        } catch (error) {
            // console.error('Error setting auth token', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        // Handle token expiration
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh token or redirect to login
                await AsyncStorage.removeItem('token');
                // You could navigate to login screen here if you had access to navigation
            } catch (refreshError) {
                // console.error('Error handling 401 response', refreshError);
            }
        }

        // Handle server errors
        if (error.response?.status === 500) {
            // console.error('Server error occurred', error.response.data);
        }

        // Handle network errors
        if (error.message === 'Network Error') {
            // console.error('Network error - check your internet connection');
        }

        return Promise.reject(error);
    }
);

// Auth endpoints
// function login(credentials) {
//     return api.post('/api/auth/login', credentials);
// }

// function getMe() {
//     return api.get('/api/auth/me');
// }

// User endpoints
function getAllUsers() {
    return api.get('/api/usres/getAll');
}

// Task endpoints
function getAllTasks() {
    return api.get('/api/tasks');
}

function getUserTasks() {
    return api.get('/api/tasks/user');
}

function getTaskById(id) {
    return api.get(`/api/tasks/${id}`);
}

// function createTask(taskData, images) {
//     const formData = new FormData();

//     // Append task data
//     Object.keys(taskData).forEach(key => {
//         formData.append(key, taskData[key]);
//     });

//     // Append images if any
//     if (images && images.length > 0) {
//         images.forEach((image, index) => {
//             formData.append('images', {
//                 uri: image.uri,
//                 type: 'image/jpeg',
//                 name: `image_${index}.jpg`,
//             });
//         });
//     }

//     return api.post('/api/tasks', formData, {
//         headers: {
//             'Content-Type': 'multipart/form-data',
//         },
//     });
// }

function completeTask(id, note, images) {
    const formData = new FormData();

    if (note) {
        formData.append('note', note);
    }

    // Append images if any
    if (images && images.length > 0) {
        images.forEach((image, index) => {
            formData.append('images', {
                uri: image.uri,
                type: 'image/jpeg',
                name: `image_${index}.jpg`,
            });
        });
    }

    return api.put(`/api/tasks/${id}/complete`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export default {
    // Auth,
    // login,
    // getMe,

    // Users
    getAllUsers,

    // Tasks
    getAllTasks,
    getUserTasks,
    getTaskById,
    // createTask,
    completeTask
};  