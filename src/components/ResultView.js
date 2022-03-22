import React from "react";
import {Form, FormButton} from "@fluentui/react-northstar";

class ResultView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // Default menu item indicator
            currentPage: 'start',
            // Default menu item index
            activeIndex: 0,
            // Default file processing indicator
            fileProcessing: false
        };
    }

    render() {
        return (
            <Form>
                {/*<Attachment*/}
                {/*    actionable*/}
                {/*    icon={<FilesImageIcon />}*/}
                {/*    header={ this.state.uploadFileName }*/}
                {/*    // description="800 Kb"*/}
                {/*    // action={{*/}
                {/*    //     icon: <MoreIcon />,*/}
                {/*    //     title: 'More Action',*/}
                {/*    // }}*/}
                {/*    progress={ this.state.fileUploadProgress }*/}
                {/*    onClick={*/}
                {/*        () => { this.setState({*/}
                {/*            fileUploadProgress: 66*/}
                {/*        })}}*/}
                {/*/>*/}

                <FormButton primary loading={ this.state.fileProcessing }
                            content={ this.state.fileProcessing ? "Processing" : "Download" }
                    // Disable the button while file not under processing
                            disabled={ !this.state.fileProcessing }
                />
            </Form>
        )
    }

}

export default ResultView