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

const sampleImages = [
    'samples/cfd.jpg',
    'samples/deepcrack.jpg',
    'samples/forest.jpg',
    'samples/heavycrack.jpg',
    'samples/rissbilder.jpg',
    'samples/volker.jpg',
    'samples/volkerds.jpg',
    'samples/volkerback.jpg'
]

const batchImages = [
    // 'samples/cfd.jpg',
    // 'samples/deepcrack.jpg',
    // 'samples/forest.jpg',
    // 'samples/heavycrack.jpg',
    // 'samples/rissbilder.jpg',
    // 'samples/volker.jpg',
    // 'samples/volkerds.jpg',
    // 'samples/volkerback.jpg'
]

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

    imageValidation = (img) => {
        // Validate image size
        if (img.size <= 4194304) {
            this.setState({fileValidSize: true});
        } else {
            this.setState({fileSizeAlert: true});
        }
        // Validate image format
        if (img.type === "image/jpeg" || img.type === "image/png") {
            this.setState({fileValidFormat: true});
        } else {
            this.setState({fileFormatAlert: true});
        }
    }

    directoryValidation = (imgList) => {
        let sizeValid = false;
        let formatValid = false;

        // Iterate through image array
        Array.from(imgList).forEach(file =>
            sizeValid = file.size <= 4194304
        );
        Array.from(imgList).forEach(file =>
            formatValid = (file.type === "image/jpeg") || (file.type === "image/png")
        );

        // Validate image size
        if (sizeValid) {
            this.setState({fileValidSize: true});
        } else {
            this.setState({fileSizeAlert: true});
        }
        // Validate image format
        if (formatValid) {
            this.setState({fileValidFormat: true});
        } else {
            this.setState({fileFormatAlert: true});
        }
    }

    renderImageButtons = () => {
        return _.map(sampleImages, (imageName, index) => {
            // First button as placeholder for user input
            if (index === 0) {
                return (
                    <Button key={imageName} styles={imageButtonStyles} title={imageName} primary={this.state.uploadFile}>
                        {/* Present input button encase no file uploaded yet */}
                        {!this.state.uploadFile && <Input
                            type="file" fluid label="Upload an image"
                            onChange={(e, v) => {
                                // Set image file as property
                                this.props.onImageUpload(e.target.files[0]);
                                // Set image URL as state for visualizing
                                this.setState({uploadFile: URL.createObjectURL(e.target.files[0])});
                                // Validation of image size and format
                                this.imageValidation(e.target.files[0]);
                            }}/>
                        }
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

    renderImageBatches = () => {
        return _.map(sampleImages, (imageName, index) => {
            // First button as placeholder for user input
            if (index === 0) {
                return (
                    <Button key={imageName} styles={imageButtonStyles} title={imageName}
                            primary={this.state.uploadFile}>
                        {!this.state.uploadFile && <input
                            directory="" webkitdirectory="" type="file"
                            onChange={(e, v) => {
                                // Set image directory as property
                                this.props.onDirectoryUpload(e.target.files);
                                // Set directory URL as state for visualizing
                                this.setState({uploadDirectory: e.target.files});
                                // Validation size and format of all images
                                this.directoryValidation(e.target.files);
                            }}/>
                        }
                        {/*{this.state.uploadDirectory && <Image*/}
                        {/*    fluid src={URL.createObjectURL(this.state.uploadDirectory[0])} />}*/}
                    </Button>
                )
            }

            return (
                <Button key={imageName} styles={imageButtonStyles} title={imageName} primary={this.state.isClicked[index]}
                        onClick={(state) => {
                            // // Set image file as property
                            // fetch(`http://127.0.0.1:3000/img/${imageName}`)
                            //     .then(response => response.blob())
                            //     .then(img => img.arrayBuffer())
                            //     .then(blob => this.props.onImageUpload(
                            //         new File([blob], imageName))
                            //     )

                            this.setState({
                                isClicked: Array(sampleImages.length).fill(false).map((name, i) => i === index),
                                isSampleClicked: true,
                                sampleImageName: imageName
                            })
                        }}>

                    {this.state.uploadDirectory && <Image
                        fluid src={URL.createObjectURL(this.state.uploadDirectory[index])}
                    />}
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
                <Grid accessibility={gridBehavior} columns="4" content={
                    this.props.batchEnabled? this.renderImageBatches() : this.renderImageButtons()}
                />

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