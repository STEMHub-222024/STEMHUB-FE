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
