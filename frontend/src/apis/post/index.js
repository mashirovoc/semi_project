import axios from 'axios';
import { refresh } from '../auth';
export const getAllPost = async (page) => {
    try {
        const res = await axios.get(`http://localhost:8000/api/p/all?page=${page}&limit=30`);
        return res;
    } catch (error) {
        throw new Error(error.response.data.error);
    }
}
export const getUserPost = async (page, username) => {
    try {
        const res = await axios.get(`http://localhost:8000/api/p/user/${username}?page=${page}&limit=30`);
        return res;
    } catch (error) {
        throw new Error(error.response.data.error);
    }
}
export const getSearchPost = async (page, text) => {
    try {
        const res = await axios.get(`http://localhost:8000/api/search?q=${text}&page=${page}&limit=30`);
        return res;
    } catch (error) {
        throw new Error(error.response.data.error);
    }
}
export const createPost = async (data) => {
    try {
        const token = localStorage.getItem('access_token');
        const res = await axios.post(`http://localhost:8000/api/p/create`, data, {
            headers: {
                Authorization: token,
            },
        });
        return res;
    } catch (error) {
        if (error.response && error.response.status === 403) {
            try {
                await refresh();
                const newToken = localStorage.getItem('access_token');
                const res = await axios.post(`http://localhost:8000/api/p/create`, data, {
                    headers: {
                        Authorization: newToken,
                    },
                });
                return res;
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                throw new Error(refreshError.response.data.error);
            }
        }
        throw new Error(error.response.data.error);
    }
};
