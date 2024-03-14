export const handleSplitParam = (param) => {
    const inputString = param;
    const startIndex = inputString.indexOf('=') + 1;
    return inputString.substring(startIndex);
};

export const handleSplitParamBefore = (param) => {
    const inputString = param;
    const endIndex = inputString.indexOf('=');
    return inputString.substring(0, endIndex);
};
