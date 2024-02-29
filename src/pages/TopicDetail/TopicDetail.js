import PropTypes from 'prop-types';
import {
    IconPlayerPlay,
    IconClipboardList,
    IconMovie,
    IconUsersGroup,
    IconBattery4,
    IconCheck,
} from '@tabler/icons-react';
import classNames from 'classnames/bind';
import { NumericFormat } from 'react-number-format';
import styles from './TopicDetail.module.scss';
import Heading from '~/components/Common/Heading';
import images from '~/assets/images';
import Button from '~/components/Common/Button';
import CurriculumOfCourse from '~/components/Common/CurriculumOfCourse';

const cx = classNames.bind(styles);

function TopicDetail() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('grid', { 'topic-detail-content': 'topic-detail-content' })}>
                <div className={cx('grid-row')}>
                    <div className={cx('grid-column-8')}>
                        <div className={cx('group-title')}>
                            <Heading className={cx('heading')}>Bài viết nổi bật</Heading>
                            <div className={cx('desc')}>
                                <p>
                                    Tổng hợp các bài viết chia sẻ về kinh nghiệm tự học lập trình online và các kỹ thuật
                                    lập trình web.
                                </p>
                            </div>
                            <div className={cx('topicList')}>
                                <Heading className={cx('topicHeading')} h2>
                                    Nguyên liệu chuẩn bị
                                </Heading>
                                <section className={cx('row')}>
                                    <section className={cx('col')}>
                                        <ul className={cx('list')}>
                                            <li>
                                                <IconCheck className={cx('icon')} size={20} />
                                                <span>Biết cách xây dựng giao diện web với HTML, CSS</span>
                                            </li>
                                            <li>
                                                <IconCheck className={cx('icon')} size={20} />
                                                <span>Biết cách xây dựng giao diện web với HTML, CSS</span>
                                            </li>
                                            <li>
                                                <IconCheck className={cx('icon')} size={20} />
                                                <span>Biết cách xây dựng giao diện web với HTML, CSS</span>
                                            </li>
                                            <li>
                                                <IconCheck className={cx('icon')} size={20} />
                                                <span>Biết cách xây dựng giao diện web với HTML, CSS</span>
                                            </li>
                                            <li>
                                                <IconCheck className={cx('icon')} size={20} />
                                                <span>Biết cách xây dựng giao diện web với HTML, CSS</span>
                                            </li>
                                            <li>
                                                <IconCheck className={cx('icon')} size={20} />
                                                <span>Biết cách xây dựng giao diện web với HTML, CSS</span>
                                            </li>
                                            <li>
                                                <IconCheck className={cx('icon')} size={20} />
                                                <span>Biết cách xây dựng giao diện web với HTML, CSS</span>
                                            </li>
                                        </ul>
                                    </section>
                                </section>
                            </div>
                        </div>
                        <CurriculumOfCourse />
                    </div>
                    <div className={cx('grid-column-4')}>
                        <div className={cx('purchaseBadge')}>
                            <div className={cx('imgPreview')}>
                                <div
                                    className={cx('bg')}
                                    style={{
                                        backgroundImage: `url("${images.introduce_1}")`,
                                    }}
                                ></div>
                                <div className={cx('overlay')}>
                                    <IconPlayerPlay size={35} stroke={3} style={{ color: '#7f56d9' }} />
                                </div>
                                <p>Xem giới thiệu khóa học</p>
                            </div>

                            <h5>Miễn phí</h5>

                            <Button className={cx('btn-join')} mainColor medium borderMedium>
                                Tham Gia học
                            </Button>

                            <ul>
                                <li>
                                    <IconClipboardList className={cx('icon')} size={20} stroke={2} />
                                    <span>Giang Viên nguyen viet duc</span>
                                </li>
                                <li>
                                    <IconMovie className={cx('icon')} size={20} stroke={2} />
                                    <span>Tổng số 13 bài học</span>
                                </li>
                                <li>
                                    <IconUsersGroup className={cx('icon')} size={20} stroke={2} />
                                    <span>
                                        Tổng số
                                        <NumericFormat
                                            className={cx('numberFormat')}
                                            value="14"
                                            thousandSeparator="./"
                                        />
                                        học viên
                                    </span>
                                </li>
                                <li>
                                    <IconBattery4 className={cx('icon')} size={20} stroke={2} />
                                    <span>Học mọi lúc, mọi nơi</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TopicDetail;
