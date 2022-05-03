import React from 'react';
import './index.css';
import App from './App';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { Provider, teamsTheme, teamsDarkTheme } from '@fluentui/react-northstar';
import configData from './config.json'

ReactDOM.render(
    <Provider theme={configData.darkTheme ? teamsDarkTheme : teamsTheme}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
            </Routes>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
