import React from "react";
import {
    Form,
    Button,
    Attachment,
    Flex,
    VisioIcon,
    Image,
    Carousel,
    Dialog,
    Table
} from "@fluentui/react-northstar";
import configData from "../AppConfig.json";
import _ from "lodash";

class ResultView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // Whether job result is available
            resultReady: false,
            // Default job status
            jobStatus: 'Initializing...',
            // Default job progress in range of 0-100
            jobProgress: 0,
            currentImage: null,
            singleImgResponse: null,
            carouseItems: []
        }

    }

    imageResponseStyles = {
        minWidth: '160px',
        maxWidth: '320px',
        height: '320px',
    }

    reportRows = [
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

    handleImageDownload = (imageFile, imageName) => {
        let link = document.createElement('a');
        link.download = imageName;
        link.href = URL.createObjectURL(imageFile);
        link.click();
    }

    async handleImageUpload(imgFile) {
        let data = new FormData();
        data.append('file', imgFile);
        data.append('confidence', this.props.confidence);
        data.append('scope', this.props.scope);
        data.append('color', this.props.color);
        // Insert model backbone service so that backend handles accordingly
        data.append('service', configData.modelService)

        let requestOptions = {
            method: 'POST',
            body: data,
        };

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
                // imgResponse: this.state.imgResponse.concat(URL.createObjectURL(img)),
                singleImgResponse: URL.createObjectURL(img),
                jobStatus: URL.createObjectURL(img),
                carouseItems: this.state.carouseItems.concat([{
                    key: URL.createObjectURL(img),
                    content:(<Image src={URL.createObjectURL(img)} fluid />)
                }]),
            })
        // ).then(async () =>
        //     await new Promise(r => setTimeout(r, 300)) // 0.3s
        ).then(() =>
            this.setState({
                jobProgress: this.props.batchEnabled ? this.state.jobProgress + (100 / this.props.imageList.length) : 100,
                resultReady: true
            })
        );
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

    componentDidMount() {
        if (this.props.batchEnabled) {
           for (let i = 0; i < this.props.imageList.length; i++) {
               this.handleImageUpload(this.props.imageList[i]);
           }
        } else {
            this.handleImageUpload(this.props.imageFile);
        }
    }

    renderSingleImage() {
        const onViewChange = this.props.onViewChange;
        const imageFile = this.props.imageFile;
        const imageName = imageFile.name;

        return (
            <Form>
                <Attachment
                    header={imageName}
                    description={this.state.jobStatus}
                    actionable
                    icon={<VisioIcon />}
                    progress={this.state.jobProgress}
                />

                <Image src={this.state.resultReady ? this.state.singleImgResponse : `img/blank.png`}
                       styles={this.imageResponseStyles} />

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

    renderBatchImages() {
        const onViewChange = this.props.onViewChange;

        // For now take only the first
        const imageFile = this.props.imageList[0];
        // const imageFile = this.state.currentImage;
        const imageName = imageFile.name;

        return (
            <Form>
                <Attachment
                    header={'Detecting'}
                    description={this.state.jobStatus}
                    actionable
                    icon={<VisioIcon />}
                    progress={this.state.jobProgress}
                />

                <Carousel items={this.state.carouseItems} styles={this.imageResponseStyles} />

                <Flex>
                    <Button tinted content="Download" disabled={!this.state.resultReady}
                            onClick={() => {this.handleImageDownload(imageFile, imageName)}} />

                    <Dialog trigger={<Button tinted disabled={!this.state.resultReady} content="Open Report" />}
                            confirmButton="Confirm"
                            header="Our detection result:"
                            content={<Table rows={this.reportRows} aria-label="Static headless table" />} />

                    <Button primary={this.state.resultReady} loading={!this.state.resultReady}
                            content={this.state.resultReady ? "Finish" : "Processing"}
                            onClick={onViewChange} />
                </Flex>
            </Form>

        )
    }

    render() {
        const onViewChange = this.props.onViewChange;
        return this.props.batchEnabled ? this.renderBatchImages() : this.renderSingleImage();
    }

}

export default ResultView