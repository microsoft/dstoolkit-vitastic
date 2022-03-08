import './App.css';
import React from 'react';
import {
    Grid,
    Segment,
    Menu,
    PaperclipIcon,
    FormatIcon,
    EyeIcon,
    StarIcon,
    MoreIcon,
    FilesImageIcon,
    Attachment,
    Form, FormDropdown, FormRadioGroup, Flex, FormSlider, Label, FormCheckbox, FormButton, FormLabel, FormInput
} from '@fluentui/react-northstar'

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            confidence: 0.3,
            currentPage: 'start',
            activeIndex: 0,
            fileLoading: false
        };
    }

    detectionScopes = [
        {
            name: 'classification',
            key: 'classification',
            label: 'classification',
            value: 'classification',
        },
        {
            name: 'object detection',
            key: 'object detection',
            label: 'object detection',
            value: 'object detection',

        },
        {
            name: 'semantic segmentation',
            key: 'semantic segmentation',
            label: 'semantic segmentation',
            value: 'semantic segmentation',

        }
    ]

    fileChecker = [
        {
            key: 'format',
            label: 'Valid file format: JPG, JPEG, PNG',
            value: 'format',
        },
        {
            key: 'size',
            label: 'Valid file size: max. 4 MG',
            value: 'size',
        },
    ]

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

    loadDefault() {
        return (
            <h1>Let's Start!</h1>
        )
    }

    loadConfig() {
        return (
            <Form>
                <FormDropdown label="Visualization Scope" items={['classification', 'object detection', 'segmentation']} clearable checkable />
                <FormRadioGroup label="Visualization Scope" vertical items={this.detectionScopes} />
                <Flex>
                    <FormSlider value={this.state.confidence} label='Confidence Threshold' min='0' max='1' step='0.1'
                                onChange={(e,value) => {
                                    this.setState({confidence:value.value})}
                                }/>
                    <Label color='brand' styles={{margin:'17px'}} content={this.state.confidence}/>
                </Flex>
                <FormCheckbox label="I would like to generate a detection report" />
                <FormButton content="Continue" primary onClick={
                    () => { this.setState({ currentPage: 'upload', activeIndex: '2'})}
                }/>
            </Form>
        )
    }

    loadUpload() {
        // let isLoading = false;

        return (
            <Form>
                <FormInput type="file" />
                <FormRadioGroup vertical defaultCheckedValue={'format'} items={ this.fileChecker } />
                <FormButton primary loading={ this.state.fileLoading }
                            content={ this.state.fileLoading ? 'Processing' : 'Submit' }
                            onClick={() => { this.setState({ fileLoading: true })}}
                />
            </Form>

            // <Attachment
            //     actionable
            //     icon={<FilesImageIcon />}
            //     header="image.jpg"
            //     // description="800 Kb"
            //     action={{
            //         icon: <MoreIcon />,
            //         title: 'More Action',
            //     }}
            // progress={33}
            // // onClick={this.handleClick('Attachment')}
            // />

        )
    }

    loadResult() {
        return (
            <h1>Hello, Result!</h1>
        )
    }

    basePage() {
        let page;
        if (this.state.currentPage === 'start') {
            page = this.loadDefault();
        } else if (this.state.currentPage === 'config') {
            page = this.loadConfig();
        } else if (this.state.currentPage === 'upload') {
            page = this.loadUpload();
        } else {
            page = this.loadResult();
        }

        return (
            <Grid columns="repeat(12, 1fr)" rows="50px 100% 50px" styles={{minHeight:'100%' }}>
                <Segment color="brand" content="Title" inverted styles={{ gridColumn: 'span 12', }}>
                    {/*<Image avatar src="https://upload.wikimedia.org/wikipedia/commons/3/38/MSFT_logo_png_grey.png"/>*/}
                </Segment>

                <Segment color="green" inverted styles={{ gridColumn: 'span 1', }}>
                    <Menu items={this.menuItems} defaultActiveIndex={this.state.activeIndex}
                          activeIndex={this.state.activeIndex}
                          vertical iconOnly />
                </Segment>

                <Segment styles={{ gridColumn: 'span 11', }}>
                    {page}
                </Segment>

                <Segment color="brand" content="© Microsoft, Inc. 2022" inverted styles={{ gridColumn: 'span 12', }} />
            </Grid>
        )
    }

    render() {
        return this.basePage();
    }
}

export default App;

