import React from 'react';
import AlphabetQuiz from './AlphabetQuiz';
import VocabQuiz from './VocabQuiz';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            games: ['hiragana', 'katakana', 'vocab'],
            activeGame: 'hiragana'
        };
    }

    render() {
        return (
            <div className="app">
                <div>
                    {this.state.games.map(game =>
                        <div className="gameOptionRow" key={game}>
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
            case 'hiragana':
                return <AlphabetQuiz characterset="hiragana" />
            case 'katakana':
                return <AlphabetQuiz characterset="katakana" />
            case 'vocab':
                return <VocabQuiz />
        }
    };

    onGameChanged = (event) => {
        this.setState({
            activeGame: event.target.value
        });
    };
}