import React from 'react';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            meeting: null,
            stage: null
        }
    }

    componentDidMount() {
        document.title = "جلس شما";
    }

    render() {
        return;
    }
}