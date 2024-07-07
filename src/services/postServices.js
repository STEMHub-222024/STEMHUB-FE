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

export const postPosts = async ({ title, image, description, markdown, htmlContent, userId }) => {
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

export const addPost = async (postData) => {
    try {
        const res = await httpRequest.post('NewspaperArticle', postData);
        return res.data;
    } catch (error) {
        console.error('Failed to add post:', error);
        throw error;
    }
};

export const updatePost = async (id, postData) => {
    try {
        const res = await httpRequest.put(`NewspaperArticle/${id}`, postData);
        return res.data;
    } catch (error) {
        console.error(`Failed to update post with id ${id}:`, error);
        throw error;
    }
};

export const deletePosts = async (newspaperArticleId) => {
    const res = await httpRequest.deleteRequest(`NewspaperArticle/${newspaperArticleId}`);
    return res.data;
};
