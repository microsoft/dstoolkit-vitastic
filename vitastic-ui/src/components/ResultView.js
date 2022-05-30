import React from "react";
import {
    Form,
    Button,
    Attachment,
    Flex,
    VisioIcon,
    Image,
    Dialog,
    Table
} from "@fluentui/react-northstar";
import configData from "../AppConfig.json";

class ResultView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // Whether job result is available
            resultReady: false,
            // Default job status
            jobStatus: 'Initializing...',
            // Default job progress in range of 0-100
            jobProgress: 5
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
        // Insert model backbone service so that backend handles accordingly
        data.append('service', configData.modelService)

        let requestOptions = {
            method: 'POST',
            body: data,
        };

        await new Promise(r => setTimeout(r, 200)); // 0.2s
        this.setState({jobProgress: 30, jobStatus: 'Detecting'});

        // for (var value of data.values()) {
        //     console.log((value));
        // }

        fetch(`http://127.0.0.1:5000/upload`, requestOptions)
            .then(response => response.blob()).then(img =>
            this.setState({
                imgResponse: URL.createObjectURL(img),
                jobProgress: 80,
                jobStatus: 'Visualizing',
            })
        ).then(async () =>
            await new Promise(r => setTimeout(r, 300)) // 0.3s
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
        const imageFile = this.props.imageFile;
        const imageName = this.props.imageFile.name;

        const imageResponseStyles = {
            minWidth: '160px',
            maxWidth: '320px',
            height: '320px',
        }

        const reportRows = [
            {
                items: ['No. detections', '2'],
            },
            {
                items: ['Total percentage bbox', '30%'],
            },
            {
                items: ['Total percentage segmentation', '10%'],
            },
            {
                items: ['Damage evaluation', 'severe'],
            },
        ]

        return (
            <Form>
                <Attachment
                    header={imageName}
                    description={this.state.jobStatus}
                    actionable
                    icon={<VisioIcon />}
                    progress={this.state.jobProgress}
                />

                <Image src={this.state.resultReady ? this.state.imgResponse : `img/blank.png`} styles={imageResponseStyles} />

                <Flex>
                    <Button tinted content="Download" disabled={!this.state.resultReady}
                            onClick={() => {this.handleImageDownload(imageFile, imageName)}} />

                    <Dialog trigger={<Button tinted disabled={!this.state.resultReady} content="Open Report" />}
                            confirmButton="Confirm"
                            header="Our detection result:"
                            content={<Table rows={reportRows} aria-label="Static headless table" />} />

                    <Button primary={this.state.resultReady} loading={!this.state.resultReady}
                            content={this.state.resultReady ? "Finish" : "Processing"}
                            onClick={onViewChange} />
                </Flex>
            </Form>

        )
    }

}

export default ResultView