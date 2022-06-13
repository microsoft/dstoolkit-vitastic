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
            jobProgress: 5,
            currentImage: null,
            imgResponse: [],
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
            .then(response => response.blob()).then(img =>
            this.setState({
                imgResponse: this.state.imgResponse.concat(URL.createObjectURL(img)),
                jobStatus: URL.createObjectURL(img),
                carouseItems: this.state.carouseItems.concat([{
                    key: URL.createObjectURL(img),
                    content:(<Image src={URL.createObjectURL(img)} fluid />)
                }]),
            })
        ).then(() =>
            this.setState({
                jobProgress: this.props.batchEnabled ? this.state.jobProgress + (100 / this.props.imageList.length) : 100,
                resultReady: true
            })
        );

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

                <Image src={this.state.resultReady ? this.state.imgResponse[0] : `img/blank.png`}
                       styles={this.imageResponseStyles} />

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