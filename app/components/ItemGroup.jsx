import React from 'react';

export default class ItemGroup extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let g = this.props.group;
        return (
            <div> 
                <input type="checkbox" id={g.value} value={g.value} checked={g.active} onChange={this.onChange}/>
                <label htmlFor={g.value}>{g.value}</label>
            </div>
        );
    }

    onChange = (event) => {
        const isChecked = event.target.checked; 

        this.props.onChange(isChecked);
    };
}