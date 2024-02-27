import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Stem10.module.scss';
import Topic from '~/components/Layouts/Components/Topic';

const cx = classNames.bind(styles);

function Stem10() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('grid')}>
                <div className={cx('grid-row', { content: 'content' })}>
                    <div className={cx('grid-column-3')}>
                        <Topic colorCode="#24d198" />
                    </div>
                    <div className={cx('grid-column-3')}>
                        <Topic colorCode="#00C1FF" />
                    </div>
                    <div className={cx('grid-column-3')}>
                        <Topic colorCode="#F15568" />
                    </div>
                    <div className={cx('grid-column-3')}>
                        <Topic colorCode="#7F56D9" />
                    </div>
                    <div className={cx('grid-column-3')}>
                        <Topic colorCode="#FF6905" />
                    </div>
                    <div className={cx('grid-column-3')}>
                        <Topic colorCode="#4883FF" />
                    </div>
                    <div className={cx('grid-column-3')}>
                        <Topic colorCode="#F49DA8" />
                    </div>
                    <div className={cx('grid-column-3')}>
                        <Topic colorCode="#198f51" />
                    </div>
                </div>
            </div>
        </div>
    );
}

Stem10.propTypes = {};

export default Stem10;
