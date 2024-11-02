
import * as httpRequest from '~/utils/httpRequest';

export const getComment = async () => {
    try {
        const res = await httpRequest.get('Comment');
        return res.data;
    } catch (error) {}
};

export const getCommentIdLesson = async ({ newLessonId }) => {
    try {
        const res = await httpRequest.get('Comment', {
            params: {
                lessonId: newLessonId,
            },
        });
        return res.data;
    } catch (error) {}
};

export const getCommentId = async ({ commentId }) => {
    try {
        const res = await httpRequest.get(`Comment/${commentId}`);
        return res.data;
    } catch (error) {}
};

export const postComment = async ({ content_C, lessonId, userId }) => {
    try {
        const res = await httpRequest.post('Comment', {
            content_C,
            lessonId,
            type: 0,
            userId,
        });
        return res.data;
    } catch (error) {
        console.log("erroer", error);
    }
};

export const deleteComment = async ({ commentId, accessToken }) => {
    try {
        const res = await httpRequest.deleteRequest(`Comment/${commentId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return res.data;
    } catch (error) {}
};
