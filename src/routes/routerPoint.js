import { Fragment } from 'react';
import { DefaultLayout } from '~/components/Layouts';
import { Route } from 'react-router-dom';

function routerPoint(routes) {
    return routes.map((route, index) => {
        let Layout = DefaultLayout;

        if (route.layout) {
            Layout = route.layout;
        } else if (route.layout === null) {
            Layout = Fragment;
        }

        const Page = route.component;

        return (
            <Route
                key={index}
                path={route.path}
                element={
                    <Layout>
                        <Page />
                    </Layout>
                }
            />
        );
    });
}

export default routerPoint;
