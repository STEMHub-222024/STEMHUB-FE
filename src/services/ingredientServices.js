import * as httpRequest from '~/utils/httpRequest';

export const getIngredient = async () => {
    try {
        const res = await httpRequest.get('Ingredients');
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {}
};

export const getIngredientsByTopic = async () => {
    try {
        const res = await httpRequest.get('Ingredients');
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {}
};

export const addIngredient = async (ingredientData) => {
    try {
        const res = await httpRequest.post('Ingredients', ingredientData);
        return res.data;
    } catch (error) {}
};

export const updateIngredient = async (id, ingredientData) => {
    try {
        const res = await httpRequest.put(`Ingredients/${id}`, ingredientData);
        return res.data;
    } catch (error) {}
};

export const deleteIngredient = async (id) => {
    try {
        const res = await httpRequest.deleteRequest(`Ingredients/${id}`);
        return res.data;
    } catch (error) {}
};
