import React from "react";
import {
    EyeIcon,
    Flex,
    Form, FormatIcon, FormButton, FormCheckbox,
    FormDropdown,
    FormRadioGroup,
    FormSlider,
    Grid,
    Label,
    Menu, PaperclipIcon,
    Segment, StarIcon
} from "@fluentui/react-northstar";

const menuItems = [
    {
        icon: (
            <StarIcon {...{outline: true,}}/>
        ),
        key: 'start',
        content: 'Start',
    },
    {
        icon: (
            <FormatIcon {...{outline: true,}}/>
        ),
        key: 'value',
        content: 'Value Configuration',
    },
    {
        icon: (
            <PaperclipIcon {...{outline: true,}}/>
        ),
        key: 'upload',
        content: 'Upload Documents',
    },
    {
        icon: (
            <EyeIcon {...{outline: true,}}/>
        ),
        key: 'result',
        content: 'Detection Result',
    }
]

const detectionScopes = [
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

class Configs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confidence: 0.3
        };
    }

    configPage() {
        return (
            <Grid columns="repeat(12, 1fr)" rows="50px 100% 50px" styles={{minHeight:'100%' }}>
                <Segment color="brand" content="Title" inverted styles={{ gridColumn: 'span 12', }}>
                    {/*<Image avatar src="https://upload.wikimedia.org/wikipedia/commons/3/38/MSFT_logo_png_grey.png"/>*/}
                </Segment>
                <Segment color="green" inverted styles={{ gridColumn: 'span 1', }}>
                    <Menu items={menuItems} vertical pointing />
                </Segment>
                <Segment styles={{ gridColumn: 'span 11', }}>
                    <Form>
                        <FormDropdown label="Visualization Scope" items={['classification', 'object detection', 'segmentation']} clearable checkable />
                        <FormRadioGroup label="Visualization Scope" vertical items={detectionScopes} />
                        <Flex>
                            <FormSlider value={this.state.confidence} label='Confidence Threshold' min='0' max='1' step='0.1'
                                        onChange={(e,value) => {
                                            this.setState({confidence:value.value})}
                                        }/>
                            <Label color='brand' styles={{margin:'17px'}} content={this.state.confidence}/>
                        </Flex>
                        <FormCheckbox label="I would like to generate a detection report" />
                        <FormButton content="Continue" />
                    </Form>
                </Segment>
                <Segment color="brand" content="© Microsoft, Inc. 2022" inverted styles={{ gridColumn: 'span 12', }} />
            </Grid>
        )
    }

    render() {
        return this.configPage();
    }
}

export default Configs;