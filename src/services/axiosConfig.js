import axios from 'axios';

const getToken = () => localStorage.getItem('authToken');
const axiosInstance = axios.create({
	baseURL: 'https://localhost:7289/api',
	headers: {
		'Content-Type': 'application/json',
	},
});

axiosInstance.interceptors.request.use(
	(config) => {
		const newConfig = { ...config };
		const token = getToken();
		if (token) {
			newConfig.headers.Authorization = `Bearer ${token}`;
		}
		return newConfig;
	},
	(error) => Promise.reject(error),
);

export default axiosInstance;
