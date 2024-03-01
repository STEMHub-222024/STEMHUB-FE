import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './Comment.module.scss';
import CommentBox from '~/components/Layouts/Components/CommentBox';
import config from '~/config';
import FallbackAvatar from '~/components/Common/FallbackAvatar';
import images from '~/assets/images';
import MarkdownParser from '~/components/Layouts/Components/MarkdownParser';

const cx = classNames.bind(styles);

function Comment() {
    return (
        <div className={cx('detailRow')}>
            <CommentBox />
            <div className={cx('detailComment')}>
                <div className={cx('avatarWrap')}>
                    <Link to={config.routes.home}>
                        <div className={cx('avatarWrapper')}>
                            <FallbackAvatar
                                className={cx('avatar')}
                                linkImage={images.avatar_1}
                                altImage="nguyen van a"
                            />
                        </div>
                    </Link>
                </div>
                <div className={cx('commentBody')}>
                    <div className={cx('commentInner')}>
                        <div className={cx('commentWrapper')}>
                            <div className={cx('commentContent')}>
                                <div className={cx('commentHeading')}>
                                    <Link to={config.routes.home}>
                                        <span className={cx('commentAuthor')}>Nguyễn Việt Đức</span>
                                    </Link>
                                </div>
                                <div className={cx('commentText')}>
                                    <MarkdownParser />
                                </div>
                            </div>
                            <div className={cx('commentTime')}>
                                <div className={cx('createdAt')}>
                                    <div className={cx('createdAtLeft')}>
                                        <button className={cx('iconWrapper')}>
                                            <span className={cx('likeComment')}>Thích</span>
                                        </button>
                                        <span className={cx('replyComment')}>Trả lời</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx('detailComment')}>
                <div className={cx('avatarWrap')}>
                    <Link to={config.routes.home}>
                        <div className={cx('avatarWrapper')}>
                            <FallbackAvatar
                                className={cx('avatar')}
                                linkImage={images.avatar_1}
                                altImage="nguyen van a"
                            />
                        </div>
                    </Link>
                </div>
                <div className={cx('commentBody')}>
                    <div className={cx('commentInner')}>
                        <div className={cx('commentWrapper')}>
                            <div className={cx('commentContent')}>
                                <div className={cx('commentHeading')}>
                                    <Link to={config.routes.home}>
                                        <span className={cx('commentAuthor')}>Nguyễn Việt Đức</span>
                                    </Link>
                                </div>
                                <div className={cx('commentText')}>
                                    <MarkdownParser />
                                </div>
                            </div>
                            <div className={cx('commentTime')}>
                                <div className={cx('createdAt')}>
                                    <div className={cx('createdAtLeft')}>
                                        <button className={cx('iconWrapper')}>
                                            <span className={cx('likeComment')}>Thích</span>
                                        </button>
                                        <span className={cx('replyComment')}>Trả lời</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx('detailComment')}>
                <div className={cx('avatarWrap')}>
                    <Link to={config.routes.home}>
                        <div className={cx('avatarWrapper')}>
                            <FallbackAvatar
                                className={cx('avatar')}
                                linkImage={images.avatar_1}
                                altImage="nguyen van a"
                            />
                        </div>
                    </Link>
                </div>
                <div className={cx('commentBody')}>
                    <div className={cx('commentInner')}>
                        <div className={cx('commentWrapper')}>
                            <div className={cx('commentContent')}>
                                <div className={cx('commentHeading')}>
                                    <Link to={config.routes.home}>
                                        <span className={cx('commentAuthor')}>Nguyễn Việt Đức</span>
                                    </Link>
                                </div>
                                <div className={cx('commentText')}>
                                    <MarkdownParser />
                                </div>
                            </div>
                            <div className={cx('commentTime')}>
                                <div className={cx('createdAt')}>
                                    <div className={cx('createdAtLeft')}>
                                        <button className={cx('iconWrapper')}>
                                            <span className={cx('likeComment')}>Thích</span>
                                        </button>
                                        <span className={cx('replyComment')}>Trả lời</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx('detailComment')}>
                <div className={cx('avatarWrap')}>
                    <Link to={config.routes.home}>
                        <div className={cx('avatarWrapper')}>
                            <FallbackAvatar
                                className={cx('avatar')}
                                linkImage={images.avatar_1}
                                altImage="nguyen van a"
                            />
                        </div>
                    </Link>
                </div>
                <div className={cx('commentBody')}>
                    <div className={cx('commentInner')}>
                        <div className={cx('commentWrapper')}>
                            <div className={cx('commentContent')}>
                                <div className={cx('commentHeading')}>
                                    <Link to={config.routes.home}>
                                        <span className={cx('commentAuthor')}>Nguyễn Việt Đức</span>
                                    </Link>
                                </div>
                                <div className={cx('commentText')}>
                                    <MarkdownParser />
                                </div>
                            </div>
                            <div className={cx('commentTime')}>
                                <div className={cx('createdAt')}>
                                    <div className={cx('createdAtLeft')}>
                                        <button className={cx('iconWrapper')}>
                                            <span className={cx('likeComment')}>Thích</span>
                                        </button>
                                        <span className={cx('replyComment')}>Trả lời</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Comment;
