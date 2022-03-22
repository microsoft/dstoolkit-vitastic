import React from 'react';
import './index.css';
import App from './App';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { Provider, teamsTheme, teamsV2Theme, teamsDarkTheme, teamsDarkV2Theme} from '@fluentui/react-northstar';

ReactDOM.render(
    <Provider theme={teamsDarkTheme}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
            </Routes>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
