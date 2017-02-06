import React from 'react';
import QuizItem from '../models/QuizItem.js';
import QuizItemGroup from '../models/QuizItemGroup.js';
import Vocabulary from "../vocabulary.json";
import _ from 'lodash';

export default class VocabQuiz extends React.Component {
    constructor(props) {
        super(props);

        this.state = this.initialGameState();
    }

    initialGameState = () => {
        const defaultFirstToTest = 'first';
        const items = this.getQuizItems(defaultFirstToTest);
        const groups = _.uniqBy(Vocabulary.map(w => {
            return new QuizItemGroup(w[2])
        }));

        // set random presenter here

        return {
            items: items,
            previousError: null,
            groups: groups,
            whichToTest: defaultFirstToTest
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

        return (
            <div>
                {modeOptions.map(o =>
                    <div key={o.value}>
                        <input type="radio" value={o.value} checked={this.state.whichToTest === o.value} onChange={this.onModeChanged} />
                        <label htmlFor={o.value}>{o.text}</label>
                    </div>)}
            </div>
        );
    }

    onModeChanged = (event) => {
        this.setState({
            whichToTest: event.target.value
        });
    };
}