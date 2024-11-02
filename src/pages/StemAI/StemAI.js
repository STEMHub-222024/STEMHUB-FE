import React, { useState } from 'react';
import BoxChat from '~/components/Layouts/Components/BoxChat';
import MenuQuestion from '~/components/Layouts/Components/MenuQuestion';

function StemAI() {
    const [currentQuestion, setCurrentQuestion] = useState();

    return (
        <div style={{ display: 'flex', height: '100%', width: '100%', padding: '16px 0px', gap: '8px' }}>
            <MenuQuestion onSetQuestion={setCurrentQuestion} />
            <BoxChat data={currentQuestion} />
        </div>
    );
}

export default StemAI;
