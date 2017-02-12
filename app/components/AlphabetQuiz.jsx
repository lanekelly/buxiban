import React from 'react';
import Hiragana from '../hiragana.json';
import Katakana from '../katakana.json';
import ItemGroups from './ItemGroups.jsx';
import _ from 'lodash';
import QuizItem from '../models/QuizItem.js';
import QuizItemGroup from '../models/QuizItemGroup.js'

export default class AlphabetQuiz extends React.Component {
    constructor(props) {
        super(props);

        this.state = this.initialGameState();
    }

    getCharacterSet = (charSet) => {
        switch (charSet) {
            case 'hiragana':
                return Hiragana;
            case 'katakana':
                return Katakana;
        }

        throw 'Unsupported character set!';
    };

    initialGameState = (characterSet) => {
        const charSetResource = this.getCharacterSet(characterSet || this.props.characterset);

        let items = charSetResource.map(h => {
            return new QuizItem(h[0], h[1], h[2]);
        });

        const groups = _.uniqBy(charSetResource.map(h => {
            return { value: h[2], active: true }
        }), 'value');

        items = this.setRandomPresenter(items, groups);

        return {
            items: items,
            previousError: null,
            groups: groups
        };
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.characterset !== this.props.characterset) {
            this.setState(this.initialGameState(nextProps.characterset));
        }
    }

    render() {
        const activeGroupVals = this.state.groups.filter(g => g.active).map(g => g.value);
        const items = this.state.items.filter(h => activeGroupVals.includes(h.group));

        if (items.filter(h => h.unanswered).length === 0
            || activeGroupVals.length === 0) {
            return this.renderDone();
        }

        const presenting = items.filter(h => h.isPresenting);
        const text = presenting[0].other;

        let previousError;
        if (this.state.previousError) {
            previousError = `Wrong! ${this.state.previousError.other} is ${this.state.previousError.english}.`;
        }

        return this.renderGame(this.state.groups, text, previousError, items.filter(h => h.unanswered).length);
    }

    renderGame = (groups, text, previousError, left) => {
        return (
            <div>
                <div className="item-display-container">
                    <ItemGroups groups={groups} onChange={this.onItemGroupChange} />
                    <span className="quiz-item">{text}</span>
                </div>
                <div className="input-container">
                    <input type="text"
                        autoFocus={true}
                        onKeyPress={this.checkEnter} 
                        autoCapitalize="none" />
                    <span className="items-left">{left} left</span>
                    <div className="wrong-answer-text"><span>{previousError}</span></div>
                </div>
            </div>
        );
    };

    renderDone = () => {
        return (
            <div>
                <span>Done!</span>
                <button onClick={this.resetGame}>Reset</button>
            </div>
        );
    };

    resetGame = () => {
        this.setState(this.initialGameState());
    };

    checkEnter = (e) => {
        if (e.key === 'Enter') {
            this.evaluateAnswer(e);
        }
    };

    evaluateAnswer = (e) => {
        const attempt = e.target.value;

        // is there a better way to clear input?
        e.target.value = "";

        const current = this.state.items
            .filter(h => h.isPresenting)[0];

        let items;
        let previousError;
        if (attempt === current.english) {
            items = this.state.items.map(h => {
                if (h.isPresenting) {
                    h.unanswered = false;
                    h.isPresenting = false;
                }

                return h;
            });
            previousError = null;
        } else {
            // set error state here
            items = this.state.items.map(h => {
                h.isPresenting = false;
                return h;
            });
            previousError = current;
        }

        items = this.setRandomPresenter(items, this.state.groups);
        this.setState({items, previousError});
    };

    // presenting item must be unanswered and part of an active group
    // todo - this method is the source of way too many bugs. Need to refactor.
    setRandomPresenter = (items, groups) => {
        let selected = null;
        let iterationCount = 0;
        const activeGroupVals = groups.filter(g => g.active).map(g => g.value);

        // bug here. When pool is small (ex. only 'w' group is selected) the
        // loop can finish w/o selecting an item
        while (selected === null && iterationCount < items.length) {
            // random returns [0, 1)
            const index = Math.floor(Math.random() * items.length);
            const candidate = items[index];
            if (candidate.unanswered && activeGroupVals.includes(candidate.group)) {
                selected = candidate;
            }

            iterationCount++;
        }

        if (selected === null) {
            return items; // likely done at this point
        }

        return items.map(h => {
            if (h.other === selected.other) {
                h.isPresenting = true;
            }

            return h;
        });
    };

    onItemGroupChange = (group, checked) => {
        const groups = this.state.groups.map(g => {
            if (g.value === group) {
                g.active = checked;
            }

            return g;
        });

        const activeGroups = groups.filter(g => g.active).map(g => g.value);
        let items = this.state.items;
        if (items.filter(h => h.isPresenting && activeGroups.includes(h.group)).length === 0
            && activeGroups.length > 0) {

            items = items.map(h => {
                h.isPresenting = false;
                return h;
            });

            items = this.setRandomPresenter(items, groups);
        }

        this.setState({groups, items});
    };
}