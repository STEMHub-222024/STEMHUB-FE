import { formatDistanceToNow, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

const formatDateToNow = (dateString) => {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: vi });
};

export default formatDateToNow;
