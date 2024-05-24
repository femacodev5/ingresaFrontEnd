import axiosInstance from './axiosConfig';

const getClusters = async () => {
	try {
		const response = await axiosInstance.get('/Clusters');
		return response.data;
	} catch (error) {
		console.error('Error fetching clusters:', error);
		throw error;
	}
};

const getClusterById = async (id) => {
	try {
		const response = await axiosInstance.get(`/Clusters/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Error fetching cluster with id ${id}:`, error);
		throw error;
	}
};

const createCluster = async (cluster) => {
	try {
		const response = await axiosInstance.post('/Clusters', cluster);
		return response.data;
	} catch (error) {
		console.error('Error creating cluster:', error);
		throw error;
	}
};

const updateCluster = async (id, cluster) => {
	try {
		const response = await axiosInstance.put(`/Clusters/${id}`, cluster);
		return response.data;
	} catch (error) {
		console.error(`Error updating cluster with id ${id}:`, error);
		throw error;
	}
};

const deleteCluster = async (id) => {
	try {
		await axiosInstance.delete(`/Clusters/${id}`);
	} catch (error) {
		console.error(`Error deleting cluster with id ${id}:`, error);
		throw error;
	}
};

export default {
	getClusters,
	getClusterById,
	createCluster,
	updateCluster,
	deleteCluster,
};
