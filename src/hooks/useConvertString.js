import { useState, useEffect } from 'react';

const useConvertString = (input) => {
    const [convertedString, setConvertedString] = useState('');

    useEffect(() => {
        const convertString = (str) => {
            return str.toLowerCase().replace(/\s+/g, '');
        };

        setConvertedString(convertString(input));
    }, [input]);

    return convertedString;
};

export default useConvertString;
