const scrollToPosition = (top) => {
    window.scrollTo({
        top,
        behavior: 'smooth',
    });
};

export default scrollToPosition;
