import * as httpRequest from '~/utils/httpRequest';

export const ask = async ({ question }) => {
    try {
        const res = await httpRequest.post('chatbot/ask', { question });
        return res.data;
    } catch (error) {}
};

export const sendQuestion = async ({ question, answer }) => {
    try {
        const res = await httpRequest.post('chatbot/add', { question, answer });
        return res.data;
    } catch (error) {}
};

export const getTopLast7days = async () => {
    try {
        const res = await httpRequest.get('chatbot/top-questions/last7days');
        return res.data;
    } catch (error) {}
};

export const getTopLast30days = async () => {
    try {
        const res = await httpRequest.get('chatbot/top-questions/last30days');
        return res.data;
    } catch (error) {}
};
