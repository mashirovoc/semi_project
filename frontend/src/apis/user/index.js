import axios from 'axios';
import { refresh } from '../auth';
export const getUserDataFromUsername = async (username) => {
    try {
        const res = await axios.get(`http://localhost:8000/api/user/${username}`);
        return res;
    } catch (error) {
        if (error.response.status === 404) {
            throw new Error('not_found');
        }
        throw new Error(error.response.data.error);
    }
}
export const getSearchUser = async (page, text) => {
    try {
        const res = await axios.get(`http://localhost:8000/api/search/user?q=${text}&page=${page}&limit=30`);
        return res;
    } catch (error) {
        throw new Error(error.response.data.error);
    }
}
export const getMyUser = async () => {
    try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get(`http://localhost:8000/api/me`, {
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
                const res = await axios.get(`http://localhost:8000/api/me`, {
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
}
export const updateUserData = async (data) => {
    try {
        const token = localStorage.getItem('access_token');
        const res = await axios.patch(`http://localhost:8000/api/me`, data, {
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
                const res = await axios.patch(`http://localhost:8000/api/me`, data, {
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
}
export const deleteMyAccount = async () => {
    try {
        const token = localStorage.getItem('access_token');
        const res = await axios.delete(`http://localhost:8000/api/me`, {
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
                const res = await axios.delete(`http://localhost:8000/api/me`, {
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
}