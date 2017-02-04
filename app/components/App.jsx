import React from 'react';
import AlphabetQuiz from './AlphabetQuiz';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            games: ['hiragana'],
            activeGame: 'hiragana'
        };
    }

    render() {
        return (
            <div><div>
                {this.state.games.map(game =>
                    <div key={game}>
                        <input type="radio" value={game} checked={this.state.activeGame === game} onChange={this.onGameChanged} />
                        <label htmlFor={game}>{game}</label>
                    </div>)}
            </div>
            {this.renderActiveGame()}</div>
        );
    }

    renderActiveGame = () => {
        switch (this.state.activeGame) {
            case 'hiragana':
                return <AlphabetQuiz characterset="hiragana"/>
        }
    };

    onGameChanged = (event) => {
        this.setState({
            activeGame: event.target.value
        });
    };
}