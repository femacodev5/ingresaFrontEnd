import axiosInstance from './axiosConfig';

const login = async (data) => {
	try {
		const response = await axiosInstance.post('/Auth/AuthLogin', data);
		return response.data;
	} catch (error) {
		console.error('Error logging in:', error);
		throw error;
	}
};

const setToken = (token) => {
	localStorage.setItem('authToken', token);
};

const getToken = () => localStorage.getItem('authToken');

const removeToken = () => {
	localStorage.removeItem('authToken');
};
const setUser = (user) => {
	localStorage.setItem('user', JSON.stringify(user));
};

const getUser = () => {
	const user = localStorage.getItem('user');
	return user ? JSON.parse(user) : null;
};

const removeUser = () => {
	localStorage.removeItem('user');
};

export default {
	login,
	setToken,
	getToken,
	removeToken,
	setUser,
	getUser,
	removeUser,
};
