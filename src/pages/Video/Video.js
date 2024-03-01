import PropTYpes from 'prop-types';
import classNames from 'classnames/bind';
import { IconSquareRoundedPlus } from '@tabler/icons-react';

import styles from './Video.module.scss';
import Powered from '~/components/Layouts/Components/Powered';
import Heading from '~/components/Common/Heading';
import VideoPlayer from '~/components/Common/VideoPlayer';
import Comment from '~/components/Layouts/Components/Comment';

const cx = classNames.bind(styles);

function Video() {
    return (
        <>
            <div className={cx('wrapper')}>
                <VideoPlayer />
            </div>

            <div className={cx('content')}>
                <div className={cx('contentTop')}>
                    <Heading>Bạn sẽ làm được gì sau khóa học?</Heading>
                    <button className={cx('addNote')}>
                        <IconSquareRoundedPlus size={20} strokeWidth={1} />
                        <span className={cx('label')}>
                            Thêm ghi chú tại
                            <span className={cx('num')}>00:10</span>
                        </span>
                    </button>
                </div>

                <p>Tham gia các cộng đồng để cùng học hỏi, chia sẻ và "thám thính" xem F8 sắp có gì mới nhé!</p>

                <div className={cx('contentBottom')}>
                    <Comment />
                </div>
            </div>
            <Powered />
        </>
    );
}

export default Video;
