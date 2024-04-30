import * as httpRequest from '~/utils/httpRequest';

export const getComment = async () => {
    const res = await httpRequest.get('Comment');
    return res.data;
};

export const getCommentIdLesson = async ({ lessonId }) => {
    const res = await httpRequest.get('Comment', {
        params: {
            lessonId,
        },
    });
    return res.data;
};

export const getCommentId = async ({ commentId }) => {
    const res = await httpRequest.get(`Comment/${commentId}`);
    return res.data;
};

export const postComment = async ({ content_C, lessonId, userId }) => {
    const res = await httpRequest.post('Comment', {
        content_C,
        lessonId,
        userId,
    });
    return res.data;
};
