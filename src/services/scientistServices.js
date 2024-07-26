import * as httpRequest from '~/utils/httpRequest';

export const getScientist = async () => {
    try {
        const res = await httpRequest.get('Scientist');
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {
        console.error('Failed to get scientist:', error);
    }
};

export const getScientistId = async ({ id }) => {
    try {
        const res = await httpRequest.get(`Scientist/${id}`);
        return res.data;
    } catch (error) {
        console.error('Failed to get scientist by id:', error);
        throw error;
    }
};

export const addScientist = async (scientistData) => {
    try {
        const res = await httpRequest.post('Scientist', scientistData);
        return res.data;
    } catch (error) {
        console.error('Failed to add scientist:', error);
        throw error;
    }
};

export const updateScientist = async (id, scientistData) => {
    try {
        const res = await httpRequest.put(`Scientist/${id}`, scientistData);
        return res.data;
    } catch (error) {
        console.error(`Failed to update scientist with id ${id}:`, error);
        throw error;
    }
};

export const deleteScientist = async (id) => {
    try {
        const res = await httpRequest.deleteRequest(`Scientist/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Failed to delete scientist with id ${id}:`, error);
        throw error;
    }
};
