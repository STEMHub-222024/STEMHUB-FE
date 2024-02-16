//config routes
import config from '~/config';

//Layouts
import { HeaderOnly } from '~/components/Layouts';

//public page
import Home from '~/pages/Home';
import Stem10 from '~/pages/Stem10';
import Stem11 from '~/pages/Stem11';
import Upload from '~/pages/Upload';

//private page
import Stem12 from '~/pages/Stem12';

//Route
const publicRouter = [
    { path: config.routes.home, component: Home },
    { path: config.routes.stem10, component: Stem10 },
    { path: config.routes.stem11, component: Stem11, layout: HeaderOnly },
    { path: config.routes.upload, component: Upload, layout: null },
];

const privateRouter = [{ path: config.routes.stem12, component: Stem12 }];

export { publicRouter, privateRouter };
