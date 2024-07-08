import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import { publicRouter, privateRouter, privateRouterAdmin } from '~/routes';
import ScrollOnTop from './components/Common/ScrollOnTop';
import { useDispatch, useSelector } from 'react-redux';

// Constants
import { ADMIN, USER } from '~/utils/constant';
import routerPoint from '~/routes/routerPoint';

// Check Auth
import { selectAuth } from './app/selectors';
import { setAllow } from '~/app/slices/authSlice';
import checkCookie from '~/utils/checkCookieExists';

function App() {
    const dispatch = useDispatch();
    const { allow, infoUserCurrent } = useSelector(selectAuth).data;

    useEffect(() => {
        checkCookie(dispatch)
            .then((isUser) => {
                dispatch(setAllow(isUser));
            })
            .catch((isUser) => {
                dispatch(setAllow(isUser));
            });
    }, [dispatch]);

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
