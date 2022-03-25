import React from "react";
import {
    Alert,
    Button,
    Form,
    FormButton,
    Image,
    Layout,
    Input,
    Grid, gridBehavior
} from "@fluentui/react-northstar";
import _, {clone} from "lodash";

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
    maxWidth: '200px',
    height: '200px',
    padding: '10',
    margin: '0',
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
            isClicked: Array(imageNames.length).fill(false)
        };
    }

    renderImageButtons = () => {
        return _.map(imageNames, (imageName, index) => {
            if (index === 0) {
                return (
                    <Button key={imageName} styles={imageButtonStyles} title={imageName}>
                        <Input fluid type="file" label="Upload an image" onChange={ (e, v) => {
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
                            }}}
                        />
                    </Button>
                )
            }
            // TODO: handle single button clicks
            return (
                <Button key={imageName} styles={imageButtonStyles} title={imageName} primary={this.state.isClicked[index]}
                        onClick={(state) => {
                            this.setState({
                                isClicked: Array(imageNames.length).fill(false).map((name, i) => i === index)
                            })
                        }}>
                    <Image fluid src={`./img/${imageName}.jpg`}/>
                </Button>
            )
        })
    }

    render() {
        const onChangeView = this.props.onChangeView;

        return (
            <Form>
                <Grid accessibility={gridBehavior} columns="4" content={this.renderImageButtons()} />

                <Layout
                    styles={{ maxHeight: '10px', }}
                    renderMainArea={() => (
                        <>
                            <Alert success content="Valid file format (JPG, JPEG, PNG) and valid file size (max. 4MG)"
                                   visible={this.state.fileValidFormat && this.state.fileValidSize} />
                            <Alert danger dismissible content="Invalid file format: Must be in JPG, JPEG or PNG" visible={this.state.fileFormatAlert} />
                            <Alert danger dismissible content="Invalid file size: Max. 4 MG" visible={this.state.fileSizeAlert} />
                        </>
                    )}
                />

                <FormButton content='Submit' primary onClick={onChangeView} />
            </Form>
        )
    }

}

export default UploadView