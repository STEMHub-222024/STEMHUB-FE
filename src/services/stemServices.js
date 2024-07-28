import * as httpRequest from '~/utils/httpRequest';

export const getStem = async () => {
    try {
        const res = await httpRequest.get('STEM');
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {}
};

export const getStemById = async (id) => {
    try {
        const res = await httpRequest.get(`STEM/${id}`);
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {}
};

export const addStem = async (stemData) => {
    try {
        const res = await httpRequest.post('STEM', stemData);
        return res.data;
    } catch (error) {}
};

export const updateStem = async (id, stemData) => {
    try {
        const res = await httpRequest.put(`STEM/${id}`, stemData);
        return res.data;
    } catch (error) {}
};

export const deleteStem = async (id) => {
    try {
        const res = await httpRequest.deleteRequest(`STEM/${id}`);
        return res.data;
    } catch (error) {}
};
