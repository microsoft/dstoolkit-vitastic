// TODO: batch-processing: reports generation
// UI Simplicity, multiple pages introduce unnecessary complexity
// Content instead of design
// Metadata including time, location of crack, etc.

import './App.css';
import React, { useState, useEffect } from 'react';
import ConfigView from './components/ConfigView';
import DefaultView from './components/DefaultView';
import UploadView from './components/UploadView';
import ResultView from './components/ResultView';

import {
    Grid,
    Segment,
    Menu,
    Image,
    Layout,
    PaperclipIcon,
    FormatIcon,
    EyeIcon,
    Checkbox,
    StarIcon, FormCheckbox,
} from '@fluentui/react-northstar'


class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // Default menu item indicator
            // currentPage: 'start',
            currentPage: 'config',
            // Default menu item index
            activeIndex: 0,
            // Default name of uploaded image file
            imageName: null,
            // Default uploaded image file
            imageFile: null,
            // Default confidence value
            confidence: 0.3,
            // Default task scope setting
            scope: 'object detection',
            // Default visualization color set to yellow
            color: 'ffff01'
        };
    }

    menuItems = [
        // {
        //     icon: (
        //         <StarIcon {...{outline: true,}}/>
        //     ),
        //     key: 'start',
        //     content: 'Start',
        //     pills: true,
        //     onClick: () => { this.setState({ currentPage: 'start', activeIndex: 0}) }
        // },
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

    handleNavigation = (currentPage) => {
        // const newIndex = (this.state.activeIndex + 1) %  4;
        const newIndex = (this.state.activeIndex + 1) %  3;
        this.setState({ currentPage: currentPage, activeIndex: newIndex  })
    }

    handleImageUpload = (file) => {
        this.setState({imageFile: file })
    }

    handleConfidenceChange = (conf) => {
        this.setState({confidence: conf })
    }

    handleScopeChange = (scope) => {
        this.setState({scope: scope })
    }

    handleColorChange = (color) => {
        this.setState({color: color })
    }

    renderView() {
        switch (this.state.currentPage) {
            // case 'config':
            //     return <ConfigView onViewChange={() => this.handleNavigation('upload')} />
            case 'upload':
                return <UploadView onViewChange={() => this.handleNavigation('result')}
                                   onImageUpload={this.handleImageUpload} />
            case 'result':
                return <ResultView onViewChange={() => this.handleNavigation('start')}
                                   imageFile={this.state.imageFile}
                                   confidence={this.state.confidence}
                                   scope={this.state.scope}
                                   color={this.state.color} />
            default:
                // return <DefaultView />
                return <ConfigView onViewChange={() => this.handleNavigation('upload')}
                                   onConfidenceChange={this.handleConfidenceChange}
                                   onScopeChange={this.handleScopeChange}
                                   onColorChange={this.handleColorChange} />
        }
    }

    render() {
        return (
            <Grid columns="repeat(12, 1fr)" rows="64px calc(100vh - 114px) 50px" styles={{ height:'100vh' }}>
                <Segment color="brand" inverted styles={{ gridColumn: 'span 12' }}>
                    <Image avatar src={`img/mslogo.png`}/>
                     <b> &nbsp;&nbsp; Detect the Crack </b>
                    {/*<Checkbox label="Dark mode" toggle defaultChecked />*/}
                </Segment>

                <Segment color="green" inverted styles={{ gridColumn: 'span 1', }}>
                    <Menu items={this.menuItems} defaultActiveIndex={this.state.activeIndex}
                          activeIndex={this.state.activeIndex}
                          vertical iconOnly />
                </Segment>

                <Segment styles={{ gridColumn: 'span 11'}}>
                    { this.renderView() }
                </Segment>

                <Segment color="brand" content="© Microsoft 2022" inverted styles={{ gridColumn: 'span 12'}} />
            </Grid>
        )
    };

}

export default App