import React from "react";
import {
    Flex,
    Form,
    FormButton,
    FormCheckbox,
    FormDropdown,
    FormRadioGroup,
    FormSlider,
    Label
} from "@fluentui/react-northstar";

class ConfigView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // Default detection confidence threshold
            confidence: 0.3
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

    render() {
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
                <FormCheckbox label="Enable input image batch processing" toggle />
                <FormCheckbox label="I would like to generate a detection report" toggle />
                <FormButton content="Continue" primary onClick={
                    () => { this.setState({ currentPage: 'upload', activeIndex: '2'})}
                }/>
            </Form>
        )
    }

}

export default ConfigView