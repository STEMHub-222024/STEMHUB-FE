import * as httpRequest from '~/utils/httpRequest';

export const getTopic = async () => {
    const res = await httpRequest.get('Topic');
    if (res.status === 200) {
        return res.data;
    }
};

//outstanding

export const getSuggestions = async () => {
    const res = await httpRequest.get('Topic/suggestions');
    if (res.status === 200) {
        return res.data;
    }
};
