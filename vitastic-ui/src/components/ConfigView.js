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
import {value} from "lodash/seq";
import configData from "../config.json";

class ConfigView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // Default detection confidence threshold
            confidence: configData.defaultConfidence,
        };
    }

    detectionScopeList = [
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

    detectionScopes = (scope) => {
        if (scope === 'semantic segmentation') {
            return this.detectionScopeList;
        } else if (scope === 'object detection') {
            return this.detectionScopeList.slice(0, 2);
        } else if (scope === 'classification') {
            return this.detectionScopeList.slice(0, 1);
        }
    }

    visualizationColors = [
        {
            header: 'Punk Yellow',
            image: `./img/ffff01.png`,
            hex: 'ffff01'
        },
        {
            header: 'Fluent Brand',
            image: `./img/7f85f5.png`,
            hex: '7f85f5'
        },
        {
            header: 'Meta Green',
            image: `./img/3ff23f.png`,
            hex: '3ff23f'
        },
        {
            header: 'Crazy Blue',
            image: `./img/1aebff.png`,
            hex: '1aebff'
        },
        {
            header: 'Magic Red',
            image: `./img/C4314B.png`,
            hex: 'C4314B'
        }
    ]

    render() {
        const onViewChange = this.props.onViewChange;
        const onConfidenceChange = this.props.onConfidenceChange;
        const onScopeChange = this.props.onScopeChange;
        const onColorChange = this.props.onColorChange;

        return (
            <Form>
                <FormDropdown label="Visualization Color"
                              items={this.visualizationColors}
                              clearable checkable
                              defaultValue={'Punk Yellow'}
                              onChange={(e, value) => {
                                  onColorChange(value.value['hex']);
                                }}
                />

                <FormRadioGroup label="Detection Scope" vertical items={this.detectionScopes(configData.modelScope)}
                                defaultCheckedValue={configData.modelScope}
                                onCheckedValueChange={(e, value) => {
                                    onScopeChange(value.value);
                                }}
                />

                <Flex>
                    <FormSlider value={this.state.confidence} label='Confidence Threshold' min='0' max='1' step='0.1'
                                onChange={(e, value) => {
                                    this.setState({confidence:value.value});
                                    onConfidenceChange(value.value);
                                }}
                    />
                    <Label color='brand' styles={{margin:'17px'}} content={this.state.confidence}/>
                </Flex>
                <FormCheckbox label="I would like to generate a detection report" toggle defaultChecked />
                <FormButton content="Continue" primary onClick={onViewChange} />
            </Form>
        )
    }

}

export default ConfigView