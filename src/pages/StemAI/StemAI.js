import React from 'react';
import BoxChat from '~/components/Layouts/Components/BoxChat';
import MenuQuestion from '~/components/Layouts/Components/MenuQuestion';

function StemAI() {
    return (
        <div style={{ display: 'flex', height: '100%', width: '100%', padding: '16px 0px', gap: '8px' }}>
            <MenuQuestion />
            <BoxChat />
        </div>
    );
}

export default StemAI;
