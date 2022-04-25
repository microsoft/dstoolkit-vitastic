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

    async handleImageUpload() {
        let data = new FormData();
        data.append('file', this.props.imageFile);
        data.append('confidence', this.props.confidence);
        data.append('scope', this.props.scope);
        data.append('color', this.props.color);

        let requestOptions = {
            method: 'POST',
            body: data,
        };

        await new Promise(r => setTimeout(r, 500)); // 0.5s
        this.setState({jobProgress: 30, jobStatus: 'Detecting'});

        fetch(`http://127.0.0.1:5000/upload`, requestOptions)
            .then(response => response.blob()).then(img =>
            this.setState({
                imgResponse: URL.createObjectURL(img),
                jobProgress: 80,
                jobStatus: 'Visualizing',
            })
        ).then(async () =>
            await new Promise(r => setTimeout(r, 1000)) // 1s
        ).then(() =>
            this.setState({
                jobProgress: 100,
                jobStatus: 'Finished',
                resultReady: true
            })
        );

    }

    componentDidMount() {
        this.handleImageUpload();
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

        return (
            <Form>
                <Attachment
                    header={imageName}
                    description={this.state.jobStatus}
                    actionable
                    icon={<VisioIcon />}
                    progress={this.state.jobProgress}
                />

                <Image src={this.state.resultReady ? this.state.imgResponse : null} styles={imageResponseStyles} />

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