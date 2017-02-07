import React from 'react';
import QuizItem from '../models/QuizItem.js';
import QuizItemGroup from '../models/QuizItemGroup.js';
import Vocabulary from "../vocabulary.json";
import _ from 'lodash';
import ItemGroups from './ItemGroups';

export default class VocabQuiz extends React.Component {
    constructor(props) {
        super(props);

        this.state = this.initialGameState();
    }

    initialGameState = (whichToTest) => {
        const whichToTestVal = whichToTest || 'first';

        let items = this.getQuizItems(whichToTestVal);
        const groups = _.uniqBy(Vocabulary.map(w => {
            return new QuizItemGroup(w[2])
        }), 'value');

        items = this.setRandomPresenter(items, groups);

        return {
            items: items,
            previousError: null,
            groups: groups,
            whichToTest: whichToTestVal
        };
    };

    getQuizItems = (whichToTest) => {
        if (whichToTest !== 'first' && whichToTest !== 'second') {
            throw 'Invalid paramter. Must be \'first\' or \'second\'';
        }

        const testItemIndex = whichToTest === 'first' ? 0 : 1;
        const answerIndex = whichToTest === 'first' ? 1 : 0;

        return Vocabulary.map(w => {
            return new QuizItem(w[testItemIndex], w[answerIndex], w[2])
        });
    }

    render() {
        const modeOptions = [{ text: 'Japanese', value: 'first' }, { text: 'English', value: 'second' }];

        const activeGroupVals = this.state.groups.filter(g => g.active).map(g => g.value);
        const items = this.state.items
            .filter(i => i.unanswered)
            .filter(i => activeGroupVals.includes(i.group));

        if (items.length === 0 || activeGroupVals.length === 0) {
            return this.renderDone();
        }

        const presentingItemText = _
            .chain(items)
            .filter(i => i.isPresenting)
            .head()
            .value()
            .other;

        const itemsLeft = items.length;

        let previousError;
        if (this.state.previousError) {
            previousError = `Wrong! ${this.state.previousError.other} is ${this.state.previousError.english}.`;
        }

        return (
            <div>
                {modeOptions.map(o =>
                    <div key={o.value}>
                        <input type="radio" value={o.value} checked={this.state.whichToTest === o.value} onChange={this.onModeChanged} />
                        <label htmlFor={o.value}>{o.text}</label>
                    </div>)}
                <div className="item-display-container">
                    <ItemGroups groups={this.state.groups} onChange={this.onItemGroupChange} />
                    <span className="vocab-quiz-item">{presentingItemText}</span>
                </div>
                <div className="input-container">
                    <input type="text"
                        autoFocus={true}
                        onKeyPress={this.checkEnter} />
                    <span className="items-left">{itemsLeft} left</span>
                    <div className="wrong-answer-text"><span>{previousError}</span></div>
                </div>
            </div>
        );
    }

    renderDone = () => {
        return (
            <div>
                <span>Done!</span>
                <button onClick={this.resetGame}>Reset</button>
            </div>
        );
    };

    onModeChanged = (event) => {
        const whichToTest = event.target.value;

        this.setState(this.initialGameState(whichToTest));
    };

    resetGame = () => {
        this.setState(this.initialGameState());
    };

    checkEnter = (event) => {
        if (event.key === 'Enter') {
            this.evaluateAnswer(event);
        }
    };

    evaluateAnswer = (event) => {
        const attempt = event.target.value;
        event.target.value = '';

        const current = _
            .chain(this.state.items)
            .filter(i => i.isPresenting)
            .head()
            .value();

        const correct = attempt === current.english;
        let modItems = this.state.items.map(i => {
            if (i.isPresenting) {
                i.unanswered = !correct;
                i.isPresenting = false;
            }

            return i;
        });

        modItems = this.setRandomPresenter(modItems, this.state.groups);
        const previousError = correct ? null : current;

        this.setState({modItems, previousError});
    };

    setRandomPresenter = (items, groups) => {
        const activeGroupVals = groups.filter(g => g.active).map(g => g.value);
        const selectionPool = items
            .filter(i => i.unanswered)
            .filter(i => activeGroupVals.includes(i.group));

        const selectedIndex = Math.floor(Math.random() * selectionPool.length);
        const selected = selectionPool[selectedIndex];

        return items.map(i => {
            if (i.other === selected.other) {
                i.isPresenting = true;
            }

            return i;
        });
    };

    onItemGroupChange = (changedGroupValue, isChecked) => {
        const groups = this.state.groups.map(g => {
            if (g.value === changedGroupValue) {
                g.active = isChecked;
            }

            return g;
        });

        const activeGroupVals = groups.filter(g => g.active).map(g => g.value);
        const isPresentingArr = this.state.items
            .filter(i => i.isPresenting)
            .filter(i => activeGroupVals.includes(i.group));

        let modItems = this.state.items;
        if (isPresentingArr.length === 0 && activeGroupVals.length > 0) {
            modItems = modItems.map(i => {
                i.isPresenting = false;
                return i;
            });

            modItems = this.setRandomPresenter(modItems, groups);
        }

        this.setState({modItems, groups});
    };
}