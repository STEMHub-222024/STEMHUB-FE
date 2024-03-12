import * as httpRequest from '~/utils/httpRequest';

export const getVideo = async () => {
    const res = await httpRequest.get('Video');
    if (res.status === 200) {
        return res.data;
    }
};
