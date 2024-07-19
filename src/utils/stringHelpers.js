export const encodeImageUrl = (url) => {
    if (!url) return '';
    return url.includes(' ') ? url.replace(/ /g, '%20') : url;
};

export const removeWhitespaceAndDiacritics = (str) => {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '');
};
