import * as httpRequest from '~/utils/httpRequest';

export const getLesson = async () => {
    const res = await httpRequest.get('Lesson');
    if (res.status === 200) {
        return res.data;
    }
};

export const getLessonId = async ({ lessonId }) => {
    const res = await httpRequest.get(`Lesson/${lessonId}`);
    if (res.status === 200) {
        return res.data;
    }
};

export const addLesson = async (lessonData) => {
    try {
        const res = await httpRequest.post('Lesson', lessonData);
        return res.data;
    } catch (error) {
        console.error('Failed to add Lesson:', error);
        throw error;
    }
};

export const updateLesson = async (id, lessonData) => {
    try {
        const res = await httpRequest.put(`Lesson/${id}`, lessonData);
        return res.data;
    } catch (error) {
        console.error(`Failed to update Lesson with id ${id}:`, error);
        throw error;
    }
};

export const deleteLesson = async (id) => {
    try {
        const res = await httpRequest.deleteRequest(`Lesson/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Failed to delete Lesson with id ${id}:`, error);
        throw error;
    }
};
