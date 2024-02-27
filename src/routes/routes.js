//config routes
import config from '~/config';

//Layouts
// import { HeaderOnly } from '~/components/Layouts';

//public page
import Home from '~/pages/Home';
import Stem10 from '~/pages/Stem10';
import Stem11 from '~/pages/Stem11';
import Posts from '~/pages/Posts';
import Login from '~/pages/Login';
import Register from '~/pages/Register';
//private page
import Stem12 from '~/pages/Stem12';

// Not Found
import Error from '~/pages/Error';

//Route
const publicRouter = [
    { path: config.routes.error404, component: Error, layout: null },
    { path: config.routes.home, component: Home },
    { path: config.routes.stem10, component: Stem10 },
    { path: config.routes.stem11, component: Stem11 },
    { path: config.routes.stem12, component: Stem12 },
    { path: config.routes.posts, component: Posts },
    { path: config.routes.login, component: Login, layout: null },
    { path: config.routes.register, component: Register, layout: null },
];

const privateRouter = [];

export { publicRouter, privateRouter };
