import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { store } from './app/store';
import App from '~/App';
import reportWebVitals from './reportWebVitals';
import GlobalStyles from './components/Common/GlobalStyles';

const queryClient = new QueryClient();

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <GlobalStyles>
                    <App />
                </GlobalStyles>
            </QueryClientProvider>
        </Provider>
    </React.StrictMode>,
);

reportWebVitals();
