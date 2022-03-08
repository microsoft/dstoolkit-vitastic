import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Configs from "./routes/configs";
import Upload from "./routes/upload";
import { Provider, teamsTheme, teamsV2Theme, teamsDarkTheme, teamsDarkV2Theme} from '@fluentui/react-northstar';
import { BrowserRouter, Routes, Route} from 'react-router-dom';

ReactDOM.render(
    <Provider theme={teamsV2Theme}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                {/*<Route path="configs" element={<Configs />} />*/}
                {/*<Route path="upload" element={<Upload />} />*/}
            </Routes>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
