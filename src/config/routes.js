const routes = {
    //Not Found
    error404: '*',

    //public routes
    home: '/',
    stem10: '/stem10',
    stem11: '/stem11',
    stem12: '/stem12',
    newPost: '/new-post',
    posts: '/posts',
    postsDetail: '/posts/:postsId',
    topic: '/topic/:topic',
    topicLesson: '/topic/:topic/:lessonId',
    personal: '/personal',
    login: '/login',
    register: '/register',
    forgotPassword: '/forgotPassword',
    //private routes
};

export default routes;
