import uuid from 'node-uuid';
import React from 'react';
import Note from './Note.jsx';
import Notes from './Notes.jsx';
import Hiragana from '../hiragana.json';

class QuizItem {
    constructor(hiragana, english) {
        this.hiragana = hiragana;
        this.english = english;
        this.isPresenting = false;
    }
}

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
            hiragana: this.initialGameState(),
            previousError: null
        };
    }

    // todo: refactor, doesn't save state when called by 'reset' button
    initialGameState = () => {
        let state = Hiragana.map(h => {
            return new QuizItem(h[0], h[1]);
        });

        return this.setRandomPresenter(state);
    };

    render() {
        const hiragana = this.state.hiragana;

        if (hiragana.length === 0) {
            return this.renderDone();
        }

        const presenting = hiragana.filter(h => h.isPresenting);
        const text = presenting[0].hiragana;

        let previousError;
        if (this.state.previousError) {
            previousError = `Wrong! ${this.state.previousError.hiragana} is ${this.state.previousError.english}.`;
        }
        
        return this.renderGame(text, previousError, hiragana.length);
    };

    renderGame = (text, previousError, left) => {
        return (
            <div className="game">
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
                <button onClick={this.initialGameState}>Reset</button>
            </div>
        );
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
            hiragana = this.state.hiragana.filter(h => {
                if (h.isPresenting) {
                    return false;
                }

                return true;
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

        hiragana = this.setRandomPresenter(hiragana);
        this.setState({hiragana, previousError});
    };

    setRandomPresenter = (hiragana) => {
        // random returns [0, 1)
        const index = Math.floor(Math.random() * hiragana.length);
        const selected = hiragana[index];

        return hiragana.map(h => {
            if (h.hiragana === selected.hiragana) {
                h.isPresenting = true;
            }

            return h;
        });
    };

    addNote = () => {
        this.setState({
            notes: this.state.notes.concat([{
                id: uuid.v4(),
                task: 'New task'
            }])
        });
    };

    editNote = (id, task) => {
        if (!task.trim()) {
            return;
        }

        const notes = this.state.notes.map(note => {
            if (note.id === id && task) {
                note.task = task;
            }

            return note; 
        });

        this.setState({notes});
    };

    deleteNote = (id, e) => {
        e.stopPropagation();

        this.setState({
            notes: this.state.notes.filter(note => note.id !== id)
        });
    };
}