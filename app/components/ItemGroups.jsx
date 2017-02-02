import React from 'react';
import ItemGroup from './ItemGroup.jsx';

export default ({groups, onChange}) => {
    return (
        <div>
            {groups.map(g => 
                <ItemGroup key={g.value} group={g} onChange={onChange.bind(null, g.value)}/>
            )}
        </div>
    );
}