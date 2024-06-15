import * as httpRequest from '~/utils/httpRequest';

export const searchTopiKey = async ({ topicKey }) => {
    const res = await httpRequest.get('Topic/search', {
        params: {
            topicKey,
        },
    });
    if (res.status === 200) {
        return res.data;
    }
};

export const searchLessonKey = async ({ lessonKey }) => {
    const res = await httpRequest.get('Lesson/search', {
        params: {
            lessonKey,
        },
    });
    if (res.status === 200) {
        return res.data;
    }
};

export const searchNewspaperArticle = async ({ newspaperArticleKey }) => {
    const res = await httpRequest.get('NewspaperArticle/search', {
        params: {
            newspaperArticleKey,
        },
    });
    if (res) {
        return res.data;
    }
};
