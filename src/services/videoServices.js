import * as httpRequest from '~/utils/httpRequest';

export const getVideo = async () => {
    const res = await httpRequest.get('Video');
    if (res.status === 200) {
        return res.data;
    }
};

export const addVideo = async (videoData) => {
    try {
        const res = await httpRequest.post('Video', videoData);
        return res.data;
    } catch (error) {
        console.error('Failed to add Video:', error);
        throw error;
    }
};

export const updateVideo = async (id, videoData) => {
    try {
        const res = await httpRequest.put(`Video/${id}`, videoData);
        return res.data;
    } catch (error) {
        console.error(`Failed to update Video with id ${id}:`, error);
        throw error;
    }
};

export const deleteVideo = async (id) => {
    try {
        const res = await httpRequest.deleteRequest(`Video/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Failed to delete Video with id ${id}:`, error);
        throw error;
    }
};
