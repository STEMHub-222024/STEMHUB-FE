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

    //private routes
    personal: '/personal',
    newPost: '/new-post',
    myPosts: '/my-posts',

    //admin
    admin: '/admin/',
    learner: '/admin/learner',
    stem: '/admin/stem',
    postsAdmin: '/admin/posts',
    banner: '/admin/banner',
    steam10Admin: '/admin/stem10',
    steam11Admin: '/admin/stem11',
    steam12Admin: '/admin/stem12',
};

export default routes;
