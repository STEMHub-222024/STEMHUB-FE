import PropTypes from 'prop-types';
import { useCallback, useMemo, memo } from 'react';
import classNames from 'classnames/bind';
import { IconSquareRoundedChevronsLeft, IconSquareRoundedChevronsRight } from '@tabler/icons-react';
import styles from './Pagination.module.scss';

const cx = classNames.bind(styles);

function Pagination({ nPages, currentPage, setCurrentPage }) {
    const pageNumbers = useMemo(() => [...Array(nPages + 1).keys()].slice(1), [nPages]);

    const goToNextPage = useCallback(() => {
        if (currentPage < nPages) setCurrentPage(currentPage + 1);
    }, [currentPage, nPages, setCurrentPage]);

    const goToPrevPage = useCallback(() => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    }, [currentPage, setCurrentPage]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('pages')}>
                <div className={cx('page-item')} onClick={goToPrevPage}>
                    <IconSquareRoundedChevronsLeft size={20} />
                </div>
                {pageNumbers.map((pgNumber) => (
                    <div
                        key={pgNumber}
                        className={cx('page-item', {
                            active: currentPage === pgNumber,
                        })}
                        onClick={() => setCurrentPage(pgNumber)}
                    >
                        {pgNumber}
                    </div>
                ))}
                <div className={cx('page-item')} onClick={goToNextPage}>
                    <IconSquareRoundedChevronsRight size={20} />
                </div>
            </div>
        </div>
    );
}

Pagination.propTypes = {
    nPages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    setCurrentPage: PropTypes.func.isRequired,
};

export default memo(Pagination);
