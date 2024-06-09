import * as httpRequest from '~/utils/httpRequest';

export const getPosts = async () => {
    const res = await httpRequest.get('NewspaperArticle');
    if (res.status === 200) {
        return res.data;
    }
};

export const getPostsById = async ({ postsId }) => {
    const res = await httpRequest.get(`NewspaperArticle/${postsId}`);
    return res.data;
};

export const postPosts = async ({ title, image, markdown, htmlContent, userId }) => {
    const res = await httpRequest.post('NewspaperArticle', {
        title,
        image,
        markdown,
        htmlContent,
        userId,
    });
    if (res) {
        return res.data;
    }
};

export const pagedPosts = async ({ page, pageSize }) => {
    const res = await httpRequest.get('NewspaperArticle/paged', {
        params: {
            page,
            pageSize,
        },
    });
    if (res.status === 200) {
        return res.data;
    }
};
