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
import configData from "../AppConfig.json";


const sampleImages = [""].concat(configData.sampleImages.map(img => "samples/" + img))

const imageButtonStyles = {
    minWidth: '90px',
    maxWidth: '180px',
    height: '180px',
    padding: '2',
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
            isClicked: Array(sampleImages.length).fill(false),
            isSampleClicked: false,
        };
    }

    renderImageButtons = () => {
        return _.map(sampleImages, (imageName, index) => {
            // First button as placeholder for user input
            if (index === 0) {
                return (
                    <Button key={imageName} styles={imageButtonStyles} title={imageName} primary={this.state.uploadFile}>
                        {/* Present input button encase no file uploaded yet */}
                        {!this.state.uploadFile && <Input
                            fluid type="file" label="Upload an image" onChange={ (e, v) => {
                                // Set image file as property
                                this.props.onImageUpload(e.target.files[0]);
                                // Set image URL as state for visualizing
                                this.setState({
                                    uploadFile: URL.createObjectURL(e.target.files[0])
                            });
                            // Validation of image size and format
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
                        />}
                        {/* Render the uploaded file directly */}
                        {this.state.uploadFile && <Image
                            fluid src={this.state.uploadFile} />}

                    </Button>
                )
            }
            // Other buttons for representing sample images
            return (
                <Button key={imageName} styles={imageButtonStyles} title={imageName} primary={this.state.isClicked[index]}
                        onClick={(state) => {
                            // Set image file as property
                            fetch(`http://127.0.0.1:3000/img/${imageName}`)
                                .then(response => response.blob())
                                .then(img => img.arrayBuffer())
                                .then(blob => this.props.onImageUpload(
                                    new File([blob], imageName))
                                )

                            this.setState({
                                isClicked: Array(sampleImages.length).fill(false).map((name, i) => i === index),
                                isSampleClicked: true,
                                sampleImageName: imageName
                            })
                        }}>
                    <Image fluid src={`./img/${imageName}`}/>
                </Button>
            )
        })
    }

    getSuccessMessage() {
        if (this.state.fileValidFormat && this.state.fileValidSize) {
            return "Valid file format (JPG, JPEG, PNG) and valid file size (max. 4MG)"
        } else {
            return "Selected " + this.state.sampleImageName + " as sample image"
        }
    }

    getAlertMessage() {
        if (this.state.fileFormatAlert) {
            return "Invalid file format: Must be in JPG, JPEG or PNG"
        } else {
            return "Invalid file size: Max. 4 MB"
        }
    }

    render() {
        const onViewChange = this.props.onViewChange;
        const showSuccess = (this.state.fileValidFormat && this.state.fileValidSize) || this.state.isSampleClicked;
        const showAlert = this.state.fileFormatAlert || this.state.fileSizeAlert

        return (
            <Form>
                <Grid accessibility={gridBehavior} columns="4" content={this.renderImageButtons()} />

                <Layout
                    styles={{ maxHeight: '10px', }}
                    renderMainArea={() => (
                        <>
                            <Alert success visible={showSuccess} content={this.getSuccessMessage()} />
                            <Alert danger visible={showAlert} content={this.getAlertMessage()} /> 
                        </>
                    )}
                />

                <FormButton content='Submit' primary onClick={onViewChange} />
            </Form>
        )
    }

}

export default UploadView