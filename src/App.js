import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Fragment } from 'react';
// import { Counter } from './features/counter/Counter';
import { publicRouter, privateRouter } from '~/routes';
import { DefaultLayout } from '~/components/Layouts';
import ScrollOnTop from './components/Common/ScrollOnTop';
import { useSelector } from 'react-redux';
import { selectAuth } from './app/selectors';

function App() {
    const { allow } = useSelector(selectAuth).data;

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
