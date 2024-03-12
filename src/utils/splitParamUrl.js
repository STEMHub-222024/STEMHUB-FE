export const handleSplitParam = (param) => {
    const inputString = param;
    const startIndex = inputString.indexOf('=') + 1;
    return inputString.substring(startIndex);
};
