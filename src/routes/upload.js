import React from "react";
import {EyeIcon, FormatIcon, Grid, Menu, PaperclipIcon, Segment, StarIcon} from "@fluentui/react-northstar";

const menuItems = [
    {
        icon: (
            <StarIcon {...{outline: true,}}/>
        ),
        key: 'start',
        content: 'Start',
    },
    {
        icon: (
            <FormatIcon {...{outline: true,}}/>
        ),
        key: 'value',
        content: 'Value Configuration',
    },
    {
        icon: (
            <PaperclipIcon {...{outline: true,}}/>
        ),
        key: 'upload',
        content: 'Upload Documents',
    },
    {
        icon: (
            <EyeIcon {...{outline: true,}}/>
        ),
        key: 'result',
        content: 'Detection Result',
    }
]

class Upload extends React.Component {
    constructor(props) {
        super(props);
    }

    uploadPage() {
        return (
            <Grid columns="repeat(12, 1fr)" rows="50px 100% 50px" styles={{minHeight:'100%' }}>
                <Segment color="brand" content="Title" inverted styles={{ gridColumn: 'span 12', }}>
                    {/*<Image avatar src="https://upload.wikimedia.org/wikipedia/commons/3/38/MSFT_logo_png_grey.png"/>*/}
                </Segment>
                <Segment color="green" inverted styles={{ gridColumn: 'span 1', }}>
                    <Menu items={menuItems} vertical pointing />
                </Segment>
                <Segment styles={{ gridColumn: 'span 11', }}>

                </Segment>
                <Segment color="brand" content="© Microsoft, Inc. 2022" inverted styles={{ gridColumn: 'span 12', }} />
            </Grid>
        )
    }

    render() {
        return this.uploadPage();
    }
}

export default Upload;