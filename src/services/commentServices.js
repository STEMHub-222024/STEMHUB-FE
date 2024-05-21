import * as httpRequest from '~/utils/httpRequest';

export const getComment = async () => {
    const res = await httpRequest.get('Comment');
    return res.data;
};

export const getCommentIdLesson = async ({ newLessonId }) => {
    const res = await httpRequest.get('Comment', {
        params: {
            lessonId: newLessonId,
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

export const deleteComment = async ({ commentId, accessToken }) => {
    const res = await httpRequest.deleteRequest(`Comment/${commentId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return res.data;
};
