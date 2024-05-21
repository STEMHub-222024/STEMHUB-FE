import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Fragment, useEffect } from 'react';
// import { Counter } from './features/counter/Counter';
import { publicRouter, privateRouter } from '~/routes';
import { DefaultLayout } from '~/components/Layouts';
import ScrollOnTop from './components/Common/ScrollOnTop';
import { useDispatch, useSelector } from 'react-redux';

// Check Auth
import { selectAuth } from './app/selectors';
import { setAllow } from '~/app/slices/authSlice';
import checkCookie from '~/utils/checkCookieExists';

function App() {
    const dispatch = useDispatch();
    const { allow } = useSelector(selectAuth).data;

    useEffect(() => {
        checkCookie(dispatch)
            .then((isUser) => {
                dispatch(setAllow(isUser));
            })
            .catch((isUser) => {
                dispatch(setAllow(isUser));
            });
    }, [dispatch]);
    return (
        <Router>
            <ScrollOnTop />
            <div className="App">
                <Routes>
                    {allow
                        ? privateRouter.map((router, index) => {
                              let Layout = DefaultLayout;

                              if (router.layout) {
                                  Layout = router.layout;
                              } else if (router.layout === null) {
                                  Layout = Fragment;
                              }
                              const Page = router.component;
                              return (
                                  <Route
                                      key={index}
                                      path={router.path}
                                      element={
                                          <Layout>
                                              <Page />
                                          </Layout>
                                      }
                                  />
                              );
                          })
                        : publicRouter.map((router, index) => {
                              let Layout = DefaultLayout;

                              if (router.layout) {
                                  Layout = router.layout;
                              } else if (router.layout === null) {
                                  Layout = Fragment;
                              }
                              const Page = router.component;
                              return (
                                  <Route
                                      key={index}
                                      path={router.path}
                                      element={
                                          <Layout>
                                              <Page />
                                          </Layout>
                                      }
                                  />
                              );
                          })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
