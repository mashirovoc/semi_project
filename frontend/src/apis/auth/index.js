import axios from 'axios';
export const register = async (data) => {
    try {
        const res = await axios.post('http://localhost:8000/api/register', data);
        localStorage.setItem('access_token', res.data.access_token);
        localStorage.setItem('uid', res.data.uid);
    } catch (error) {
        throw new Error(error.response.data.error);
    }
}
export const login = async (data) => {
    try {
        const res = await axios.post('http://localhost:8000/api/login', data);
        localStorage.setItem('access_token', res.data.access_token);
        localStorage.setItem('uid', res.data.uid);
    } catch (error) {
        throw new Error(error.response.data.error);
    }
}
export const refresh = async () => {
    localStorage.removeItem('access_token');
    const res = await axios.get('http://localhost:8000/api/refresh');
    localStorage.setItem('access_token', res.data.access_token);
    return;
}
export const logout = async () => {
    await axios.get('http://localhost:8000/api/logout');
}
