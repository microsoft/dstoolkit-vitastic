import React from "react";
import {
    Form,
    Button,
    Attachment,
    Flex,
    VisioIcon,
    Image,
} from "@fluentui/react-northstar";

class ResultView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            resultReady: false,
            jobStatus: 'Initializing...',
            jobProgress: 5,
        }

    }

    handleImageDownload = (imageFile, imageName) => {
        let link = document.createElement('a');
        link.download = imageName;
        link.href = URL.createObjectURL(imageFile);
        link.click();
    }

    handleImageUpload() {
        let data = new FormData();
        data.append('file', this.props.imageFile);
        data.append('confidence', this.props.confidence);
        data.append('scope', this.props.scope);

        let requestOptions = {
            method: 'POST',
            body: data,
        };

        fetch(`http://127.0.0.1:5000/upload`, requestOptions)
            .then(response => response.blob()).then(img =>
                    this.setState({imgResponse: URL.createObjectURL(img), jobProgress: 100, jobStatus: 'Finished'})
            );
    }

    render() {
        const onViewChange = this.props.onViewChange;
        const imageName = this.props.imageName;
        const imageFile = this.props.imageFile;

        const imageResponseStyles = {
            minWidth: '160px',
            maxWidth: '320px',
            height: '320px',
        }

        this.handleImageUpload();

        return (
            <Form>
                <Attachment
                    header={imageName}
                    description={this.state.jobStatus}
                    actionable
                    icon={<VisioIcon />}
                    progress={this.state.jobProgress}
                />

                <Image src={this.state.imgResponse} styles={imageResponseStyles} />

                <Flex>
                    <Button tinted content="Download" disabled={!this.state.resultReady}
                            onClick={() => {this.handleImageDownload(imageFile, imageName)}} />

                    <Button primary={this.state.resultReady} loading={!this.state.resultReady}
                            content={this.state.resultReady ? "Finish" : "Processing"}
                            onClick={onViewChange} />
                </Flex>
            </Form>

        )
    }

}

export default ResultView