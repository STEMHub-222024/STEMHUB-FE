import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { IconSquareRoundedChevronsLeft, IconSquareRoundedChevronsRight } from '@tabler/icons-react';
import styles from './Pagination.module.scss';

const cx = classNames.bind(styles);

function Pagination({ nPages, currentPage, setCurrentPage }) {
    const pageNumbers = [...Array(nPages + 1).keys()].slice(1);

    const goToNextPage = () => {
        if (currentPage !== nPages) setCurrentPage(currentPage + 1);
    };
    const goToPrevPage = () => {
        if (currentPage !== 1) setCurrentPage(currentPage - 1);
    };

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
                            active: currentPage == pgNumber,
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
    nPages: PropTypes.number,
    currentPage: PropTypes.number,
    setCurrentPage: PropTypes.func,
};

export default Pagination;
