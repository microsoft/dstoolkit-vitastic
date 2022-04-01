import React from "react";
import {
    Form,
    FormButton,
    FormCheckbox,
    Button,
    Attachment,
    Flex,
    VisioIcon
} from "@fluentui/react-northstar";

class ResultView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            resultReady: false,
        }

    }

    handleImageDownload = (imageURL, imageName) => {
        let link = document.createElement('a');
        link.download = imageName;
        link.href = imageURL;
        link.click();
    }

    render() {
        const onViewChange = this.props.onViewChange;
        const imageName = this.props.imageName;
        const imageURL = this.props.imageURL;

        return (
            <Form>
                <Attachment
                    header={imageName}
                    actionable
                    icon={<VisioIcon />}
                    progress={33}
                />
                <Flex>
                    <Button tinted content="Download" disabled={!this.state.resultReady}
                            onClick={() => {this.handleImageDownload(imageURL, imageName)}} />

                    <Button primary={this.state.resultReady} loading={!this.state.resultReady}
                            content={this.state.resultReady ? "Finish" : "Processing"}
                            onClick={onViewChange} />
                </Flex>
            </Form>

        )
    }

}

export default ResultView