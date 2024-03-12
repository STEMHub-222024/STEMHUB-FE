import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { IconBrandDaysCounter, IconCircleCaretRight } from '@tabler/icons-react';

import styles from './CurriculumOfCourse.module.scss';

const cx = classNames.bind(styles);

function CurriculumOfCourse({ data }) {
    return (
        <div className={cx('curriculumOfCourse')}>
            <div className={cx('headerSticky')}>
                <div className={cx('headerBlock')}>
                    <h2>Nội dung khóa học</h2>
                </div>

                <div className={cx('subHeadWrapper')}>
                    <ul>
                        <li>
                            <strong>{data?.length}</strong>
                            Bài học
                        </li>
                    </ul>
                </div>
            </div>
            {data
                ? data.map((lesson) => (
                      <div className={cx('curriculumPanel')} key={lesson?.lessonId}>
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
                                                  <div className={cx('lessonName')}>{lesson?.lessonName}</div>
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
                  ))
                : ''}
        </div>
    );
}

CurriculumOfCourse.propTypes = {
    data: PropTypes.array,
};

export default CurriculumOfCourse;
