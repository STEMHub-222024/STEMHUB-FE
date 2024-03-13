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

export const searchTopiKey = async ({ topicKey }) => {
    const res = await httpRequest.get('Topic/search', {
        params: {
            topicKey,
        },
    });
    if (res.status === 200) {
        return res.data;
    }
};
