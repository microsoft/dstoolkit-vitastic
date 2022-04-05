import React from "react";
import {
    Form,
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
            processStatus: 'Initializing...'
        }

    }

    handleImageDownload = (imageURL, imageName) => {
        let link = document.createElement('a');
        link.download = imageName;
        link.href = imageURL;
        link.click();
    }

    // Insert an image
    handleImageUpload(body){
        let data = new FormData()
        data.append('file', this.props.imageURL)
        data.append('confidence', '0.1')

        return fetch(`http://127.0.0.1:5000/upload`,{
            'method': "POST",
            mode: "no-cors",
            headers : {
                'Content-Type':'application/json'
            },
            body: data
        })
            .then(response => response.json())
            .then(result => console.log(result))
            .catch(error => console.log(error))
    }


    render() {
        const onViewChange = this.props.onViewChange;
        const imageName = this.props.imageName;
        const imageURL = this.props.imageURL;

        this.handleImageUpload(imageURL);

        return (
            <Form>
                <Attachment
                    header={imageName}
                    description={this.state.processStatus}
                    actionable
                    icon={<VisioIcon />}
                    progress={5}
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