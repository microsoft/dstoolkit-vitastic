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
    AcceptIcon,
    BanIcon,
    MoreIcon,
    FilesImageIcon,
    Attachment,
    Status,
    Alert,
    Image,
    Layout,
    Form, FormDropdown, FormRadioGroup, Flex, FormSlider, Label, FormCheckbox, FormButton, FormLabel, FormInput
} from '@fluentui/react-northstar'

const images = [
    <Image
        key="allan"
        fluid
        src="https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/AllanMunger.jpg"
    />,
    <Image
        key="amanda"
        fluid
        src="https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/AmandaBrady.jpg"
    />,
    <Image
        key="cameron"
        fluid
        src="https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/CameronEvans.jpg"
    />,
    <Image
        key="carlos"
        fluid
        src="https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/CarlosSlattery.jpg"
    />
]

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // Default detection confidence threshold
            confidence: 0.3,
            // Default menu item
            currentPage: 'start',
            // Default menu item index
            activeIndex: 0,
            // Default file processing indicator
            fileProcessing: false,
            fileUploadProgress: 33,
            fileValidFormat: false,
            fileValidSize: false,
            fileFormatAlert: false,
            fileSizeAlert: false,
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
        return (
            <Form>
                <Alert success content="Valid file format (JPG, JPEG, PNG) and valid file size (max. 4MG)"
                       visible={this.state.fileValidFormat && this.state.fileValidSize} />

                <FormInput type="file"
                           onChange={ (e, v) => {
                               this.setState({
                                   uploadFileName: e.target.files[0].name,
                                   uploadFile: URL.createObjectURL(e.target.files[0])
                               });
                               if (e.target.files[0].size <= 4194304) {
                                   { this.setState({
                                       fileValidSize: true
                                   })}
                               } else {
                                   { this.setState({
                                       fileSizeAlert: true
                                   })}
                               }
                               if (e.target.files[0].type === "image/jpeg" || e.target.files[0].type === "image/png") {
                                   { this.setState({
                                       fileValidFormat: true
                                   })}
                               } else {
                                   { this.setState({
                                       fileFormatAlert: true
                                   })}
                               }
                           }}
                />
                <Layout
                    styles={{ maxWidth: '190px', }}
                    renderMainArea={() => (
                        <Image
                            fluid
                            src={this.state.uploadFile}
                        />
                    )}
                />
                
                {/*TODO: Check https://benhowell.github.io/react-grid-gallery/*/}
                <Grid content={images} />

                <Alert danger dismissible content="Invalid file format: Must be in JPG, JPEG or PNG" visible={this.state.fileFormatAlert} />
                <Alert danger dismissible content="Invalid file size: Max. 4 MG" visible={this.state.fileSizeAlert} />

                <FormButton content='Submit' primary onClick={
                    () => { this.setState({
                        currentPage: "result",
                        activeIndex: "3",
                        fileProcessing: true,
                    })}
                }/>
            </Form>

        )
    }

    loadResult() {
        return (
            <Form>
                {/*<Attachment*/}
                {/*    actionable*/}
                {/*    icon={<FilesImageIcon />}*/}
                {/*    header={ this.state.uploadFileName }*/}
                {/*    // description="800 Kb"*/}
                {/*    // action={{*/}
                {/*    //     icon: <MoreIcon />,*/}
                {/*    //     title: 'More Action',*/}
                {/*    // }}*/}
                {/*    progress={ this.state.fileUploadProgress }*/}
                {/*    onClick={*/}
                {/*        () => { this.setState({*/}
                {/*            fileUploadProgress: 66*/}
                {/*        })}}*/}
                {/*/>*/}

                <FormButton primary loading={ this.state.fileProcessing }
                            content={ this.state.fileProcessing ? "Processing" : "Download" }
                            // Disable the button while file not under processing
                            disabled={ !this.state.fileProcessing }
                />

            </Form>

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

                <Segment color="brand" content="(c) copyright 2020, Microsoft" inverted styles={{ gridColumn: 'span 12', }} />
            </Grid>
        )
    }

    render() {
        return this.basePage();
    }
}

export default App