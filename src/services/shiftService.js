import axiosInstance from './axiosConfig';

const getShiftsByPersonId = async (personId) => {
	try {
		const response = await axiosInstance.get(`/Shifts/ShiftsByPersonId/${personId}`);
		return response.data;
	} catch (error) {
		console.error(`Error fetching shifts for person with id ${personId}:`, error);
		throw error;
	}
};

const getShiftById = async (shiftId) => {
	try {
		const response = await axiosInstance.get(`/Shifts/${shiftId}`);
		return response.data;
	} catch (error) {
		console.error(`Error fetching shift with id ${shiftId}:`, error);
		throw error;
	}
};

const createShift = async (shift) => {
	try {
		const response = await axiosInstance.post('/Shifts', shift);
		return response.data;
	} catch (error) {
		console.error('Error creating shift:', error);
		throw error;
	}
};

const updateShift = async (shiftId, shift) => {
	try {
		const response = await axiosInstance.put(`/Shifts/${shiftId}`, shift);
		return response.data;
	} catch (error) {
		console.error(`Error updating shift with id ${shiftId}:`, error);
		throw error;
	}
};

const deleteShift = async (shiftId) => {
	try {
		await axiosInstance.delete(`/Shifts/${shiftId}`);
	} catch (error) {
		console.error(`Error deleting shift with id ${shiftId}:`, error);
		throw error;
	}
};

export default {
	getShiftsByPersonId,
	getShiftById,
	createShift,
	updateShift,
	deleteShift,
};
