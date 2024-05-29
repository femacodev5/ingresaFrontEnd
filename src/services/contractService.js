import axiosInstance from './axiosConfig';

const getContractsByIdPersons = async (id) => {
	try {
		const response = await axiosInstance.get(`/Contracts/ContractsByPersonId/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching contracts:', error);
		throw error;
	}
};

const getContractById = async (id) => {
	try {
		const response = await axiosInstance.get(`/Contracts/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Error fetching contract with id ${id}:`, error);
		throw error;
	}
};

const createContract = async (contract) => {
	try {
		const response = await axiosInstance.post('/Contracts', contract);
		return response.data;
	} catch (error) {
		console.error('Error creating contract:', error);
		throw error;
	}
};

const updateContract = async (id, contract) => {
	try {
		const response = await axiosInstance.put(`/Contracts/${id}`, contract);
		return response.data;
	} catch (error) {
		console.error(`Error updating contract with id ${id}:`, error);
		throw error;
	}
};

const deleteContract = async (id) => {
	try {
		await axiosInstance.delete(`/Contracts/${id}`);
	} catch (error) {
		console.error(`Error deleting contract with id ${id}:`, error);
		throw error;
	}
};

export default {
	getContractsByIdPersons,
	getContractById,
	createContract,
	updateContract,
	deleteContract,
};
