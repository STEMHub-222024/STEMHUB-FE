import * as httpRequest from '~/utils/httpRequest';

export const getBanner = async () => {
    try {
        const res = await httpRequest.get('Banner');
        return res.data;
    } catch (error) {}
};

export const addBanner = async (bannerData) => {
    try {
        const res = await httpRequest.post('Banner', bannerData);
        return res.data;
    } catch (error) {}
};

export const updateBanner = async (id, bannerData) => {
    try {
        const res = await httpRequest.put(`Banner/${id}`, bannerData);
        return res.data;
    } catch (error) {}
};

export const deleteBanner = async (id) => {
    try {
        const res = await httpRequest.deleteRequest(`Banner/${id}`);
        return res.data;
    } catch (error) {}
};
