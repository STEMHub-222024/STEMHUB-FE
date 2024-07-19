import React from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import { publicRouter, privateRouter, privateRouterAdmin } from '~/routes';
import ScrollOnTop from './components/Common/ScrollOnTop';
import Loading from '~/components/Common/Loading';
import { useSelector } from 'react-redux';
import { useAuth } from '~/app/contexts/AuthContext';
// Constants
import { ADMIN, USER } from '~/utils/constant';
import routerPoint from '~/routes/routerPoint';

// Check Auth
import { selectAuth } from './app/selectors';

function App() {
    const { isLoading } = useAuth();
    const { allow, infoUserCurrent } = useSelector(selectAuth).data;

    if (isLoading) return <Loading />;

    const renderRoutes = () => {
        if (allow && infoUserCurrent) {
            switch (infoUserCurrent.role) {
                case USER:
                    return routerPoint(privateRouter);
                case ADMIN:
                    return routerPoint(privateRouterAdmin);
                default:
                    return routerPoint(publicRouter);
            }
        } else {
            return routerPoint(publicRouter);
        }
    };

    return (
        <Router>
            <ScrollOnTop />
            <div className="App">
                <Routes>{renderRoutes()}</Routes>
            </div>
        </Router>
    );
}

export default App;
