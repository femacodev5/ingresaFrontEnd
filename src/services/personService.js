// services/personService.js
import axiosInstance from './axiosConfig';

const getPersons = async () => {
	try {
		const response = await axiosInstance.get('/Persons');
		return response.data;
	} catch (error) {
		console.error('Error fetching persons:', error);
		throw error;
	}
};

const getPersonById = async (id) => {
	try {
		const response = await axiosInstance.get(`/Persons/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Error fetching person with id ${id}:`, error);
		throw error;
	}
};

const createPerson = async (person) => {
	try {
		const response = await axiosInstance.post('/Persons', person);
		return response.data;
	} catch (error) {
		console.error('Error creating person:', error);
		throw error;
	}
};

const updatePerson = async (id, person) => {
	try {
		const response = await axiosInstance.put(`/Persons/${id}`, person);
		return response.data;
	} catch (error) {
		console.error(`Error updating person with id ${id}:`, error);
		throw error;
	}
};

const deletePerson = async (id) => {
	try {
		await axiosInstance.delete(`/Persons/${id}`);
	} catch (error) {
		console.error(`Error deleting person with id ${id}:`, error);
		throw error;
	}
};

export default {
	getPersons,
	getPersonById,
	createPerson,
	updatePerson,
	deletePerson,
};