import classNames from 'classnames/bind';
import { IconBrandDaysCounter, IconCircleCaretRight } from '@tabler/icons-react';
import { NumericFormat } from 'react-number-format';

import styles from './CurriculumOfCourse.module.scss';

const cx = classNames.bind(styles);

function CurriculumOfCourse() {
    return (
        <div className={cx('curriculumOfCourse')}>
            <div className={cx('headerSticky')}>
                <div className={cx('headerBlock')}>
                    <h2>Nội dung khóa học</h2>
                </div>

                <div className={cx('subHeadWrapper')}>
                    <ul>
                        <li>
                            <strong>170</strong>
                            bài học
                        </li>
                        <li className={cx('dot')}>.</li>
                        <li>
                            <strong>
                                <NumericFormat className={cx('numberFormat')} value="33" thousandSeparator="./" />
                            </strong>
                            học viên
                        </li>
                    </ul>
                </div>
            </div>

            <div className={cx('curriculumPanel')}>
                <div className={cx('panelGroup')}>
                    <div className={cx('panel')}>
                        <div className={cx('collapse')}>
                            <div className={cx('panelBody')}>
                                <div className={cx('lessonItem')}>
                                    <span className={cx('floatLeft')}>
                                        <IconCircleCaretRight
                                            className={cx('icon')}
                                            size={18}
                                            color="rgba(240,81,35,.8)"
                                        />
                                        <div className={cx('lessonName')}>1. Bạn sẽ làm được gì sau khóa học?</div>
                                    </span>
                                    <span className={cx('floatRight')}>
                                        <IconBrandDaysCounter size={20} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('curriculumPanel')}>
                <div className={cx('panelGroup')}>
                    <div className={cx('panel')}>
                        <div className={cx('collapse')}>
                            <div className={cx('panelBody')}>
                                <div className={cx('lessonItem')}>
                                    <span className={cx('floatLeft')}>
                                        <IconCircleCaretRight
                                            className={cx('icon')}
                                            size={18}
                                            color="rgba(240,81,35,.8)"
                                        />
                                        <div className={cx('lessonName')}>1. Bạn sẽ làm được gì sau khóa học?</div>
                                    </span>
                                    <span className={cx('floatRight')}>
                                        <IconBrandDaysCounter size={20} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('curriculumPanel')}>
                <div className={cx('panelGroup')}>
                    <div className={cx('panel')}>
                        <div className={cx('collapse')}>
                            <div className={cx('panelBody')}>
                                <div className={cx('lessonItem')}>
                                    <span className={cx('floatLeft')}>
                                        <IconCircleCaretRight
                                            className={cx('icon')}
                                            size={18}
                                            color="rgba(240,81,35,.8)"
                                        />
                                        <div className={cx('lessonName')}>1. Bạn sẽ làm được gì sau khóa học?</div>
                                    </span>
                                    <span className={cx('floatRight')}>
                                        <IconBrandDaysCounter size={20} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx('curriculumPanel')}>
                <div className={cx('panelGroup')}>
                    <div className={cx('panel')}>
                        <div className={cx('collapse')}>
                            <div className={cx('panelBody')}>
                                <div className={cx('lessonItem')}>
                                    <span className={cx('floatLeft')}>
                                        <IconCircleCaretRight
                                            className={cx('icon')}
                                            size={18}
                                            color="rgba(240,81,35,.8)"
                                        />
                                        <div className={cx('lessonName')}>1. Bạn sẽ làm được gì sau khóa học?</div>
                                    </span>
                                    <span className={cx('floatRight')}>
                                        <IconBrandDaysCounter size={20} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CurriculumOfCourse;
