//config routes
import config from '~/config';

//Layouts
import LessonLayout from '~/components/Layouts/LessonLayout';
import PostsLayout from '~/components/Layouts/PostsLayout';
import AdminLayout from '~/components/Layouts/AdminLayout/AdminLayout';

//public page
import Home from '~/pages/Home';
import Stem10 from '~/pages/Stem10';
import Stem11 from '~/pages/Stem11';
import Stem12 from '~/pages/Stem12';
import Posts from '~/pages/Posts';
import PostsDetail from '~/pages/PostsDetail';
import TopicDetail from '~/pages/TopicDetail';
import Video from '~/pages/Video';
import Login from '~/pages/Login';
import Register from '~/pages/Register';
import ForgotPassword from '~/pages/ForgotPassword';
import ResetPassword from '~/pages/ResetPassword';
//private page
import Profile from '~/pages/Profile';
import NewPost from '~/pages/NewPost';
import MyPosts from '~/pages/MyPosts';

// Admin
import Dashboard from '~/pages/Admin/Dashboard';
import Account from '~/pages/Admin/Account';
import Topic from '~/pages/Admin/Topic';
import Lesson from '~/pages/Admin/Lesson';
import Banner from '~/pages/Admin/Banner';
import Stem from '~/pages/Admin/Stem';
import Images from '~/pages/Admin/Images/Images';
import PostsAdmin from '~/pages/Admin/Posts';

//Route
const publicRouter = [
    { path: config.routes.error404, component: Login, layout: null },
    { path: config.routes.home, component: Home },
    { path: config.routes.stem10, component: Stem10 },
    { path: config.routes.stem11, component: Stem11 },
    { path: config.routes.stem12, component: Stem12 },
    { path: config.routes.posts, component: Posts },
    { path: config.routes.postsDetail, component: PostsDetail },
    { path: config.routes.topic, component: TopicDetail },
    { path: config.routes.topicLesson, component: Video, layout: LessonLayout },
    { path: config.routes.login, component: Login, layout: null },
    { path: config.routes.register, component: Register, layout: null },
    { path: config.routes.forgotPassword, component: ForgotPassword, layout: null },
    { path: config.routes.resetPassword, component: ResetPassword, layout: null },
];

const privateRouter = [
    ...publicRouter,
    { path: config.routes.personal, component: Profile },
    { path: config.routes.newPost, component: NewPost, layout: PostsLayout },
    { path: config.routes.myPosts, component: MyPosts },
];

const privateRouterAdmin = [
    ...publicRouter,
    ...privateRouter,
    { path: config.routes.admin, component: Dashboard, layout: AdminLayout },
    { path: config.routes.account, component: Account, layout: AdminLayout },
    { path: config.routes.topicAdmin, component: Topic, layout: AdminLayout },
    { path: config.routes.lesson, component: Lesson, layout: AdminLayout },
    { path: config.routes.banner, component: Banner, layout: AdminLayout },
    { path: config.routes.stem, component: Stem, layout: AdminLayout },
    { path: config.routes.images, component: Images, layout: AdminLayout },
    { path: config.routes.postsAdmin, component: PostsAdmin, layout: AdminLayout },
];

export { publicRouter, privateRouter, privateRouterAdmin };
