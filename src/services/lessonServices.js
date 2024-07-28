import * as httpRequest from '~/utils/httpRequest';

export const getLesson = async () => {
    try {
        const res = await httpRequest.get('Lesson');
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {}
};

export const getLessonId = async ({ lessonId }) => {
    try {
        const res = await httpRequest.get(`Lesson/${lessonId}`);
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {}
};

export const addLesson = async (lessonData) => {
    try {
        const res = await httpRequest.post('Lesson', lessonData);
        return res.data;
    } catch (error) {}
};

export const updateLesson = async (id, lessonData) => {
    try {
        const res = await httpRequest.put(`Lesson/${id}`, lessonData);
        return res.data;
    } catch (error) {}
};

export const deleteLesson = async (id) => {
    try {
        const res = await httpRequest.deleteRequest(`Lesson/${id}`);
        return res.data;
    } catch (error) {}
};
