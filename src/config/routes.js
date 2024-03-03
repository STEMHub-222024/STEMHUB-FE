const routes = {
    //Not Found
    error404: '*',

    //public routes
    home: '/',
    stem10: '/stem10',
    stem11: '/stem11',
    stem12: '/stem12',
    newPost: 'new-post',
    posts: '/posts',
    postsDetail: '/posts/:postsId',
    topic: '/topic/:topicId',
    topicLesson: '/topic/:topicId/:lessonId',
    login: '/login',
    register: '/register',
    //private routes
};

export default routes;
