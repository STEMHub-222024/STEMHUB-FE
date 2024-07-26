const routes = {
    //Not Found
    error404: '*',

    //public routes
    home: '/',
    stem10: '/stem10',
    stem11: '/stem11',
    stem12: '/stem12',
    posts: '/posts',
    postsDetail: '/posts/:postsId',
    topic: '/topic/:topic',
    topicLesson: '/topic/:topic/:lessonId',
    login: '/login',
    register: '/register',
    forgotPassword: '/forgotPassword',
    resetPassword: '/resetPassword',
    scientist: '/scientist/:id',

    //private routes
    personal: '/personal',
    newPost: '/new-post',
    myPosts: '/my-posts',

    //admin
    admin: '/admin',
    account: '/admin/account',
    stem: '/admin/stem',
    postsAdmin: '/admin/posts',
    banner: '/admin/banner',
    topicAdmin: '/admin/topic',
    lesson: '/admin/lesson',
    images: '/admin/images',
    owner: '/admin/owner',
    scientistAdmin: '/admin/scientist',
};

export default routes;
