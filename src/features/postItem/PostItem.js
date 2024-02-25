import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { IconCircleCheckFilled } from '@tabler/icons-react';
import styles from './PostItem.module.scss';
import images from '~/assets/images';
import Heading from '~/components/Common/Heading';
import Button from '~/components/Common/Button';
import config from '~/config';
import FallbackAvatar from '~/components/Common/FallbackAvatar';

const cx = classNames.bind(styles);

function PostItem() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('group-images')}>
                <div className={cx('images')} style={{ backgroundImage: `url(${images.posts_1})` }}></div>
            </div>
            <div className={cx('content')}>
                <Heading className={cx('name')} h4>
                    Tổng hợp các sản phẩm của học
                </Heading>
                <div className={cx('author')}>
                    <Button to={config.routes.home} className={cx('group-avatar')}>
                        <FallbackAvatar className={cx('avatar')} linkImage={images.avatar_1} altImage="avatar" />
                        <div className={cx('info')}>
                            <span className={cx('user-name')}>duc nguyen</span>
                            <IconCircleCheckFilled size={15} className={cx('icon-check')} />
                        </div>
                    </Button>
                    <Button className={cx('btn-view-post')} mainColor small>
                        View article
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default PostItem;
