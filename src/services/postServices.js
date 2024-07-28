import * as httpRequest from '~/utils/httpRequest';

export const getPosts = async () => {
    try {
        const res = await httpRequest.get('NewspaperArticle');
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {}
};

export const getPostsById = async ({ postsId }) => {
    try {
        const res = await httpRequest.get(`NewspaperArticle/${postsId}`);
        return res.data;
    } catch (error) {}
};

export const postPosts = async ({ title, image, description, markdown, htmlContent, userId }) => {
    try {
        const res = await httpRequest.post('NewspaperArticle', {
            title,
            image,
            description_NA: description,
            markdown,
            htmlContent,
            userId,
        });
        if (res) {
            return res.data;
        }
    } catch (error) {}
};

export const pagedPosts = async ({ page, pageSize }) => {
    try {
        const res = await httpRequest.get('NewspaperArticle/paged', {
            params: {
                page,
                pageSize,
            },
        });
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {}
};

export const addPost = async (postData) => {
    try {
        const res = await httpRequest.post('NewspaperArticle', postData);
        return res.data;
    } catch (error) {}
};

export const updatePost = async (id, postData) => {
    try {
        const res = await httpRequest.put(`NewspaperArticle/${id}`, postData);
        return res.data;
    } catch (error) {}
};

export const deletePosts = async (newspaperArticleId) => {
    try {
        const res = await httpRequest.deleteRequest(`NewspaperArticle/${newspaperArticleId}`);
        return res.data;
    } catch (error) {}
};
