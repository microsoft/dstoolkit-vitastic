// TODO: batch-processing: reports generation
// UI Simplicity, multiple pages introduce unnecessary complexity
// Content instead of design
// Metadata including time, location of crack, etc.

import './App.css';
import React from 'react';
import ConfigView from './components/ConfigView';
import DefaultView from './components/DefaultView';
import UploadView from './components/UploadView';
import ResultView from './components/ResultView';
import {
    mslogo
} from './media'
import {
    Grid,
    Segment,
    Menu,
    PaperclipIcon,
    FormatIcon,
    EyeIcon,
    StarIcon,
} from '@fluentui/react-northstar'

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // Default menu item indicator
            currentPage: 'start',
            // Default menu item index
            activeIndex: 0
        };
    }

    menuItems = [
        {
            icon: (
                <StarIcon {...{outline: true,}}/>
            ),
            key: 'start',
            content: 'Start',
            pills: true,
            onClick: () => { this.setState({ currentPage: 'start', activeIndex: 0}) }
        },
        {
            icon: (
                <FormatIcon {...{outline: true,}}/>
            ),
            key: 'config',
            content: 'Value Configuration',
            pills: true,
            onClick: () => { this.setState({ currentPage: 'config', activeIndex: 1}) }
        },
        {
            icon: (
                <PaperclipIcon {...{outline: true,}}/>
            ),
            key: 'upload',
            content: 'Upload Documents',
            pills: true,
            onClick: () => { this.setState({ currentPage: 'upload', activeIndex: 2 }) }
        },
        {
            icon: (
                <EyeIcon {...{outline: true,}}/>
            ),
            key: 'result',
            content: 'Detection Result',
            pills: true,
            onClick: () => { this.setState({ currentPage: 'result', activeIndex: 3 }) }
        }
    ]

    render() {
        let mainPage;
        if (this.state.currentPage === 'start') {
            mainPage = <DefaultView />
        } else if (this.state.currentPage === 'config') {
            mainPage = <ConfigView />
        } else if (this.state.currentPage === 'upload') {
            mainPage = <UploadView />
        } else {
            mainPage = <ResultView />
        }

        return (
            <Grid columns="repeat(12, 1fr)" rows="50px 100% 50px" styles={{minHeight:'100%' }}>
                <Segment color="brand" content="title" inverted styles={{ gridColumn: 'span 12' }} />

                <Segment color="green" inverted styles={{ gridColumn: 'span 1', }}>
                    <Menu items={this.menuItems} defaultActiveIndex={this.state.activeIndex}
                          activeIndex={this.state.activeIndex}
                          vertical iconOnly />
                </Segment>

                <Segment styles={{ gridColumn: 'span 11', }}>
                    {mainPage}
                </Segment>

                <Segment color="brand" content="© Microsoft 2022" inverted styles={{ gridColumn: 'span 12', }} />
            </Grid>
        )
    };

}

export default App