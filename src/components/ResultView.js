import React from "react";
import {Form, FormButton, FormCheckbox, Button} from "@fluentui/react-northstar";

class ResultView extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        const onChangeView = this.props.onChangeView;

        return (
            <>
                <Button tinted content="Download" />
                <Button primary content="Finish" onClick={onChangeView} />
            </>
        )
    }

}

export default ResultView