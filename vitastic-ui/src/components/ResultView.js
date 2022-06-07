import React from "react";
import {
    Attachment,
    Button,
    Dialog,
    Flex,
    Form,
    Image,
    Table,
    VisioIcon
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

        fetch(`http://127.0.0.1:5000/upload`, requestOptions)
            .then(response => {
                // Extract detection report as state
                this.setState({
                    jobReport: JSON.parse(response.headers.get("Vitastic-Report"))
                })
                // Extract detected image as blob
                return response.blob()
            }).then(img =>
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

    buildReport(repObj) {
        console.log(repObj);
        if (this.props.scope === 'semantic segmentation') {
            return [
            {
                items: ['No. detections', repObj.nbox],
                key: 'No. detections'
            },
            {
                items: ['Total percentage bbox', repObj.bbox_percentage],
                key: 'Total percentage bbox'
            },
            {
                items: ['Total percentage segmentation', repObj.seg_percentage],
                key: 'Total percentage segmentation'
            },
            {
                items: ['Damage evaluation', repObj.eval],
                key: 'Damage evaluation'
            }]
        } else {
            return [
            {
                items: ['No. detections', repObj.nbox],
                key: 'No. detections'
            },
            {
                items: ['Total percentage bbox', repObj.bbox_percentage],
                key: 'Total percentage bbox'
            },
            {
                items: ['Damage evaluation', repObj.eval],
                key: 'Damage evaluation'
            }]
        }
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
                            content={<Table aria-label="Static headless table" rows={
                                this.state.resultReady ? this.buildReport(this.state.jobReport) : null
                            }/>}
                    />

                    <Button primary={this.state.resultReady} loading={!this.state.resultReady}
                            content={this.state.resultReady ? "Finish" : "Processing"}
                            onClick={onViewChange} />
                </Flex>
            </Form>

        )
    }

}

export default ResultView