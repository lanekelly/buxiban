import React from 'react';
import VocabQuiz from './VocabQuiz';

export default class Chinese extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            games: ['vocab'],
            activeGame: 'vocab'
        };
    }

    render() {
        return (
            <div className="chinese">
                <div>
                    {this.state.games.map(game =>
                        <div key={game}>
                            <input type="radio" id={game} value={game} checked={this.state.activeGame === game} onChange={this.onGameChanged} />
                            <label htmlFor={game}>{game}</label>
                        </div>)}
                </div>
                <div className="game">
                    {this.renderActiveGame()}
                </div>
            </div>
        );
    }

    renderActiveGame = () => {
        switch (this.state.activeGame) {
            case 'vocab':
                return <VocabQuiz wordset="chinese"/>
        }
    };

    onGameChanged = (event) => {
        this.setState({
            activeGame: event.target.value
        });
    };
}