import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './SearchCourseItem.module.scss';
import { Link } from 'react-router-dom';

import Image from '~/components/Common/Image';

import { useDispatch } from 'react-redux';
import { updateTopicSearch } from '~/app/slices/searchSlice';

const cx = classNames.bind(styles);

function SearchCourseItem({ ...props }) {
    const dispatch = useDispatch();
    const { data, setSearchValue } = props;

    const handleHideResult = () => {
        setSearchValue('');
        dispatch(updateTopicSearch([]));
    };
    return (
        <Link
            to={`topic/${data?.topicName}=${data?.topicId}`}
            className={cx('wrapper')}
            onClick={() => handleHideResult()}
        >
            <Image className={cx('avatar')} src={data?.topicImage} alt={data?.topicName} />
            <span className={cx('name')}>{data?.topicName}</span>
        </Link>
    );
}

SearchCourseItem.propTypes = {
    data: PropTypes.object,
    setSearchValue: PropTypes.func,
};

export default SearchCourseItem;
