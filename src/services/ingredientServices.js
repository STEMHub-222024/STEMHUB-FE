import * as httpRequest from '~/utils/httpRequest';

export const getIngredient = async () => {
    const res = await httpRequest.get('Ingredients');
    if (res.status === 200) {
        return res.data;
    }
};
