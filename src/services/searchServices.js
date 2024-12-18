import * as httpRequest from '~/utils/httpRequest';

export const searchTopiKey = async ({ topicKey }) => {
    try {
        const res = await httpRequest.get('Topic/search', {
            params: {
                topicKey,
            },
        });
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {
        return null;
    }
};

export const searchLessonKey = async ({ lessonKey }) => {
    try {
        const res = await httpRequest.get('Lesson/search', {
            params: {
                lessonKey,
            },
        });
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {
        return null;
    }
};

export const searchNewspaperArticle = async ({ newspaperArticleKey }) => {
    try {
        const res = await httpRequest.get('NewspaperArticle/search', {
            params: {
                newspaperArticleKey,
            },
        });
        if (res) {
            return res.data;
        }
    } catch (error) {
        return null;
    }
};

export const searchTopKeywords = async () => {
    try {
        const res = await httpRequest.get('SearchKeywords/top-keywords');
        if (res) {
            return res.data;
        }
    } catch (error) {
        return null;
    }
};
