import React from "react";
import {
    Alert,
    Button,
    Form,
    FormButton,
    FormInput,
    FormRadioGroup,
    Image,
    Layout,
    Text,
    Grid, gridBehavior
} from "@fluentui/react-northstar";
import _ from "lodash";
import {cfd, deepcrack, forest, heavycrack, rissbilder, volker, volkerback, volkerds} from "../media";

const imageNames = [
    'cfd',
    'deepcrack',
    'forest',
    'heavycrack',
    'rissbilder',
    'volker',
    'volkerds',
    'volkerback'
]

const imageButtonStyles = {
    minWidth: '100px',
    maxWidth: '100px',
    height: '100px',
    padding: '10',
    margin: '0',
}

const renderImageButtons = () => {
    return _.map(imageNames, imageName => (
        <Button key={imageName} styles={imageButtonStyles} title={imageName}
                onClick={ () => { } }>
            <Image
                fluid
                src={`./img/${imageName}.jpg`}
            />
        </Button>
    ))
}

class UploadView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // Default file processing indicator
            fileProcessing: false,
            fileValidFormat: false,
            fileValidSize: false,
            fileFormatAlert: false,
            fileSizeAlert: false,
        };
    }

    previewImages = [
        {
            name: 'cfd',
            key: 'cfd',
            label: (<Image
                fluid
                src={cfd}
            />),
            value: 'cfd',
        },
        {
            name: 'deepcrack',
            key: 'deepcrack',
            label: (<Image
                fluid
                src={deepcrack}
            />),
            value: 'deepcrack',

        },
        {
            name: 'volker',
            key: 'volker',
            label: (<Image
                fluid
                src={volker}
            />),
            value: 'volker',
        },
        {
            name: 'forest',
            key: 'forest',
            label: (<Image
                fluid
                src={forest}
            />),
            value: 'forest',
        },
        {
            name: 'volkerds',
            key: 'volkerds',
            label: (<Image
                fluid
                src={volkerds}
            />),
            value: 'volkerds',
        },
        {
            name: 'volkerback',
            key: 'volkerback',
            label: (<Image
                fluid
                src={volkerback}
            />),
            value: 'volkerback',
        },
        {
            name: 'rissbilder',
            key: 'rissbilder',
            label: (<Image
                fluid
                src={rissbilder}
            />),
            value: 'rissbilder',
        },
        {
            name: 'heavycrack',
            key: 'heavycrack',
            label: (<Image
                fluid
                src={heavycrack}
            />),
            value: 'heavycrack',
        }
    ]
    
    render() {
        const onChangeView = this.props.onChangeView;

        return (
            <Form>
                <Alert success content="Valid file format (JPG, JPEG, PNG) and valid file size (max. 4MG)"
                       visible={this.state.fileValidFormat && this.state.fileValidSize} />

                <FormInput label={<Text size="medium">Upload an image<br/><br/></Text>} labelPosition="inline" type="file"
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
                    styles={{ maxWidth: '170px', }}
                    renderMainArea={() => (
                        <Image
                            fluid
                            src={this.state.uploadFile}
                        />
                    )}
                />

                {!this.state.uploadFile && <Layout
                    styles={{ maxWidth: '550px', }}
                    renderMainArea={() => (
                        <FormRadioGroup label={<Text size="medium">Select a sample image<br/><br/></Text>} labelPosition="inline" items={this.previewImages} />
                    )}
                />}

                <Alert danger dismissible content="Invalid file format: Must be in JPG, JPEG or PNG" visible={this.state.fileFormatAlert} />
                <Alert danger dismissible content="Invalid file size: Max. 4 MG" visible={this.state.fileSizeAlert} />

                <FormButton content='Submit' primary onClick={onChangeView} />
            </Form>

        )
    }

}

export default UploadView