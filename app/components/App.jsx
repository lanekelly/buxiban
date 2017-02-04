import React from 'react';
import Hiragana from '../hiragana.json';
import ItemGroups from './ItemGroups.jsx';
import _ from 'lodash';

class QuizItem {
    constructor(hiragana, english, group) {
        this.hiragana = hiragana;
        this.english = english;
        this.group = group;
        this.isPresenting = false;
        this.unanswered = true;
    }
}

class QuizItemGroup {
    constructor(value) {
        this.value = value;
        this.active = false;
    }
}

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = this.initialGameState();
    }

    initialGameState = () => {
        let hiragana = Hiragana.map(h => {
            return new QuizItem(h[0], h[1], h[2]);
        });

        const groups = _.uniqBy(Hiragana.map(h => {
            return { value: h[2], active: true }
        }), 'value');

        hiragana = this.setRandomPresenter(hiragana, groups);

        return {
            hiragana: hiragana,
            previousError: null,
            groups: groups
        };
    };

    render() {
        const activeGroupVals = this.state.groups.filter(g => g.active).map(g => g.value);
        const hiragana = this.state.hiragana.filter(h => activeGroupVals.includes(h.group));

        if (hiragana.filter(h => h.unanswered).length === 0
            || activeGroupVals.length === 0) {
            return this.renderDone();
        }

        const presenting = hiragana.filter(h => h.isPresenting);
        const text = presenting[0].hiragana;

        let previousError;
        if (this.state.previousError) {
            previousError = `Wrong! ${this.state.previousError.hiragana} is ${this.state.previousError.english}.`;
        }

        return this.renderGame(this.state.groups, text, previousError, hiragana.filter(h => h.unanswered).length);
    };

    renderGame = (groups, text, previousError, left) => {
        return (
            <div className="game">
                <ItemGroups groups={groups} onChange={this.onItemGroupChange} />
                <div>
                    <span className="quiz-item">{text}</span>
                    <span className="items-left">{left} left</span>
                </div>
                <input type="text"
                    autoFocus={true}
                    onKeyPress={this.checkEnter} />
                <div><span>{previousError}</span></div>
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

        const current = this.state.hiragana
            .filter(h => h.isPresenting)[0];

        let hiragana;
        let previousError;
        if (attempt === current.english) {
            hiragana = this.state.hiragana.map(h => {
                if (h.isPresenting) {
                    h.unanswered = false;
                    h.isPresenting = false;
                }

                return h;
            });
            previousError = null;
        } else {
            // set error state here
            hiragana = this.state.hiragana.map(h => {
                h.isPresenting = false;
                return h;
            });
            previousError = current;
        }

        hiragana = this.setRandomPresenter(hiragana, this.state.groups);
        this.setState({hiragana, previousError});
    };

    // presenting item must be unanswered and part of an active group
    // todo - this method is the source of way too many bugs. Need to refactor.
    setRandomPresenter = (hiragana, groups) => {
        let selected = null;
        let iterationCount = 0;
        const activeGroupVals = groups.filter(g => g.active).map(g => g.value);

        while (selected === null && iterationCount < hiragana.length) {
            // random returns [0, 1)
            const index = Math.floor(Math.random() * hiragana.length);
            const candidate = hiragana[index];
            if (candidate.unanswered && activeGroupVals.includes(candidate.group)) {
                selected = candidate;
            }

            iterationCount++;
        }

        if (selected === null) {
            return hiragana; // likely done at this point
        }

        return hiragana.map(h => {
            if (h.hiragana === selected.hiragana) {
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
        let hiragana = this.state.hiragana;
        if (hiragana.filter(h => h.isPresenting && activeGroups.includes(h.group)).length === 0
            && activeGroups.length > 0) {

            hiragana = hiragana.map(h => {
                h.isPresenting = false;
                return h;
            });

            hiragana = this.setRandomPresenter(hiragana, groups);
        }

        this.setState({groups, hiragana});
    };
}