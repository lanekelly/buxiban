import React from 'react';
import Chinese from './Chinese';
import Japanese from './Japanese';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            languages: ['Chinese', 'Japanese'],
            activeLanguage: 'Chinese'
        };
    }

    render() {
        return (
            <div className="app">
                <div>
                    {this.state.languages.map(language =>
                        <div key={language}>
                            <input type="radio" id={language} value={language} checked={this.state.activeLanguage === language} onChange={this.onLanguageChanged} />
                            <label htmlFor={language}>{language}</label>
                        </div>)}
                </div>
                <div className="language-games">
                    {this.renderActiveLanguage()}
                </div>
            </div>
        );
    }

    renderActiveLanguage = () => {
        switch (this.state.activeLanguage) {
            case 'Chinese':
                return <Chinese />
            case 'Japanese':
                return <Japanese />
        }
    };

    onLanguageChanged = (event) => {
        this.setState({
            activeLanguage: event.target.value
        });
    };
}