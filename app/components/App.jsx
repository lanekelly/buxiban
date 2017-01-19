import uuid from 'node-uuid';
import React from 'react';
import Note from './Note.jsx';
import Notes from './Notes.jsx';

class Hiragana {
    constructor(hiragana, english) {
        this.hiragana = hiragana;
        this.english = english;
        this.isPresenting = false;
        this.answered = false;
    }
}

export default class App extends React.Component {
    constructor(props) {
        super(props);

        let hiragana = [
            new Hiragana('か', 'ka'),
            new Hiragana('お', 'o')
        ];

        this.state = { hiragana: this.setRandomPresenter(hiragana) };
    }

    render() {
        const hiragana = this.state.hiragana;
        const unanswered = hiragana.filter(h => !h.answered);

        if (unanswered.length === 0) {
            return this.renderDone();
        }

        const presenting = unanswered.filter(h => h.isPresenting);
        const text = presenting[0].hiragana;
        
        return this.renderGame(text);
    };

    renderGame = (text) => {
        return (
            <div>
                <div><span>{text}</span></div>
                <input type="text"
                    autoFocus={true}
                    onKeyPress={this.checkEnter} />
            </div>
        );
    };

    renderDone = () => {
        return <div>Done!</div>
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

        const answer = this.state.hiragana
            .filter(h => h.isPresenting)
            .map(h => h.english)[0];
        
        let hiragana;
        if (attempt === answer) {
            hiragana = this.state.hiragana.map(h => {
                if (h.isPresenting) {
                    h.answered = true;
                    h.isPresenting = false;
                }

                return h;
            });
        } else {
            // set error state here
            hiragana = this.state.hiragana;
        }

        hiragana = this.setRandomPresenter(hiragana);
        this.setState({hiragana});
    };

    setRandomPresenter = (hiragana) => {
        // random returns [0, 1)
        const index = Math.floor(Math.random() * hiragana.length);
        const selected = hiragana[index];

        // todo: this doesn't filter for items
        // already answered. If it sets one of those to be 
        // presenter, the game will get stuck. 

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