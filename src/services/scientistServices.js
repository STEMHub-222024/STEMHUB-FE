import * as httpRequest from '~/utils/httpRequest';

export const getScientist = async () => {
    try {
        const res = await httpRequest.get('Scientist');
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {}
};

export const getScientistId = async ({ id }) => {
    try {
        const res = await httpRequest.get(`Scientist/${id}`);
        return res.data;
    } catch (error) {}
};

export const addScientist = async (scientistData) => {
    try {
        const res = await httpRequest.post('Scientist', scientistData);
        return res.data;
    } catch (error) {}
};

export const updateScientist = async (id, scientistData) => {
    try {
        const res = await httpRequest.put(`Scientist/${id}`, scientistData);
        return res.data;
    } catch (error) {}
};

export const deleteScientist = async (id) => {
    try {
        const res = await httpRequest.deleteRequest(`Scientist/${id}`);
        return res.data;
    } catch (error) {}
};
