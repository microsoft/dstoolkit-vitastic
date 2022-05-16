import './App.css';
import React from 'react';
import ConfigView from './components/ConfigView';
import UploadView from './components/UploadView';
import ResultView from './components/ResultView';
import {
    Grid,
    Segment,
    Menu,
    Image,
    PaperclipIcon,
    FormatIcon,
    EyeIcon,
} from '@fluentui/react-northstar'
import configData from "./AppConfig.json";

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // Default menu item indicator
            currentPage: 'config',
            // Default menu item index
            activeIndex: 0,
            // Default name of uploaded image file
            imageName: null,
            // Default uploaded image file
            imageFile: null,
            // Default uploaded image directory
            imageList: null,
            // Default visualization color set to yellow
            color: 'ffff01',
            // Default confidence threshold
            confidence: configData.defaultConfidence,
            // Default task scope setting
            scope: configData.modelScope,
            // Default disable image batch processing
            batchEnabled: false
        };
    }

    menuItems = [
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
        const newIndex = (this.state.activeIndex + 1) %  3;
        this.setState({ currentPage: currentPage, activeIndex: newIndex  })
    }

    handleImageUpload = (file) => {
        this.setState({imageFile: file })
    }

    handleDirectoryUpload = (list) => {
        this.setState({imageList: list })
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

    handleBatchEnablement = () => {
        this.setState({batchEnabled: true})
    }

    renderView() {
        switch (this.state.currentPage) {
            case 'upload':
                return <UploadView onViewChange={() => this.handleNavigation('result')}
                                   onImageUpload={this.handleImageUpload}
                                   onDirectoryUpload={this.handleDirectoryUpload}
                                   batchEnabled={this.state.batchEnabled} />
            case 'result':
                return <ResultView onViewChange={() => this.handleNavigation('start')}
                                   imageFile={this.state.imageFile}
                                   imageList={this.state.imageList}
                                   confidence={this.state.confidence}
                                   scope={this.state.scope}
                                   color={this.state.color} />
            default:
                return <ConfigView onViewChange={() => this.handleNavigation('upload')}
                                   onConfidenceChange={this.handleConfidenceChange}
                                   onScopeChange={this.handleScopeChange}
                                   onColorChange={this.handleColorChange}
                                   onBatchEnablement={this.handleBatchEnablement} />
        }
    }

    render() {
        return (
            <Grid columns="repeat(12, 1fr)" rows="64px calc(100vh - 114px) 50px" styles={{ height:'100vh' }}>
                <Segment color="brand" inverted styles={{ gridColumn: 'span 12' }}>
                    <Image avatar src={`img/mslogo.png`}/>
                     <b> &nbsp;&nbsp; {configData.title} </b>
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