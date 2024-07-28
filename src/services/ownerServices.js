import * as httpRequest from '~/utils/httpRequest';

export const getOwner = async () => {
    try {
        const res = await httpRequest.get('Owner');
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {}
};

export const addOwner = async (ownerData) => {
    try {
        const res = await httpRequest.post('Owner', ownerData);
        return res.data;
    } catch (error) {}
};

export const updateOwner = async (id, ownerData) => {
    try {
        const res = await httpRequest.put(`Owner/${id}`, ownerData);
        return res.data;
    } catch (error) {}
};

export const deleteOwner = async (id) => {
    try {
        const res = await httpRequest.deleteRequest(`Owner/${id}`);
        return res.data;
    } catch (error) {}
};
