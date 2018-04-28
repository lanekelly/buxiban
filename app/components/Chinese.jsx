import React from 'react';

export default class Chinese extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            games: [],
            activeGame: null
        };
    }

    render() {
        return (
            <div className="chinese">
                <span>Hello World!</span>
            </div>
        );
    }
}