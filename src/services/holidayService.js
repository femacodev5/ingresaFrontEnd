import axiosInstance from './axiosConfig';

const getHolidays = async () => {
	try {
		const response = await axiosInstance.get('/holidays');
		return response.data;
	} catch (error) {
		console.error('Error fetching holidays:', error);
		throw error;
	}
};

const getHolidayById = async (id) => {
	try {
		const response = await axiosInstance.get(`/holidays/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Error fetching holiday with id ${id}:`, error);
		throw error;
	}
};

const createHoliday = async (holiday) => {
	try {
		const response = await axiosInstance.post('/holidays', holiday);
		return response.data;
	} catch (error) {
		console.error('Error creating holiday:', error);
		throw error;
	}
};

const updateHoliday = async (id, holiday) => {
	try {
		const response = await axiosInstance.put(`/holidays/${id}`, holiday);
		return response.data;
	} catch (error) {
		console.error(`Error updating holiday with id ${id}:`, error);
		throw error;
	}
};

const deleteHoliday = async (id) => {
	try {
		await axiosInstance.delete(`/holidays/${id}`);
	} catch (error) {
		console.error(`Error deleting holiday with id ${id}:`, error);
		throw error;
	}
};

export default {
	getHolidays,
	getHolidayById,
	createHoliday,
	updateHoliday,
	deleteHoliday,
};
