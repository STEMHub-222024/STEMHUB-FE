import * as httpRequest from '~/utils/httpRequest';

export const getPart = async () => {
    try {
        const res = await httpRequest.get('Parts');
        return res.data;
    } catch (error) {}
};

export const addPart = async (partData) => {
    try {
        const res = await httpRequest.post('Parts',partData);
        return res.data;
    } catch (error) {}
};

export const updatePart = async (id, partData) => {
    try {
        const res = await httpRequest.put(`Parts/${id}`, partData);
        return res.data;
    } catch (error) {}
};

export const deletePart = async (id) => {
    try {
        const res = await httpRequest.deleteRequest(`Parts/${id}`);
        return res.data;
    } catch (error) {}
};
