import * as httpRequest from '~/utils/httpRequest';

// start api request

export const getStem = async () => {
    try {
        const res = await httpRequest.get('STEM');
        return res.data;
    } catch (error) {
        console.log('error', error.message);
    }
};
