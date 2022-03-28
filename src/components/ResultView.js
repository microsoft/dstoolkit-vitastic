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

    }

    render() {
        const onChangeView = this.props.onChangeView;

        return (
            <Form>
                <Attachment
                    header="Photo.jpg"
                    actionable
                    icon={<VisioIcon />}
                    progress={33}
                />
                <Flex>
                    <Button tinted content="Download" />
                    <Button primary content="Finish" onClick={onChangeView} />
                </Flex>
            </Form>

        )
    }

}

export default ResultView