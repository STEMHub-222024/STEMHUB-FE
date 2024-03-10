import * as httpRequest from '~/utils/httpRequest';

// start api request

export const getStem = async () => {
    const res = await httpRequest.get('STEM');
    if (res.status === 200) {
        return res.data;
    }
};
