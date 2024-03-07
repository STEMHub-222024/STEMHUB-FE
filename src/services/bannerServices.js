import * as httpRequest from '~/utils/httpRequest';

export const getBanner = async () => {
    const res = await httpRequest.get('Banner');
    return res.data;
};
