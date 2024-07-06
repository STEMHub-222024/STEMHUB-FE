import * as httpRequest from '~/utils/httpRequest';

export const getTopic = async () => {
    const res = await httpRequest.get('Topic');
    if (res.status === 200) {
        return res.data;
    }
};

export const getTopicId = async ({ topicId }) => {
    const res = await httpRequest.get(`Topic/${topicId}`);
    if (res.status === 200) {
        return res.data;
    }
};

export const addTopic = async (topicData) => {
    try {
        const res = await httpRequest.post('Topic', topicData);
        return res.data;
    } catch (error) {
        console.error('Failed to add Topic:', error);
        throw error;
    }
};

export const updateTopic = async (id, topicData) => {
    try {
        const res = await httpRequest.put(`Topic/${id}`, topicData);
        return res.data;
    } catch (error) {
        console.error(`Failed to update Topic with id ${id}:`, error);
        throw error;
    }
};

export const deleteTopic = async (id) => {
    try {
        const res = await httpRequest.deleteRequest(`Topic/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Failed to delete Topic with id ${id}:`, error);
        throw error;
    }
};

//outstanding
export const getSuggestions = async ({ stemId }) => {
    const res = await httpRequest.get('Topic/suggestions', {
        params: {
            stemId,
        },
    });
    if (res.status === 200) {
        return res.data;
    }
};
