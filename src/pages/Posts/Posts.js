import PropTypes from 'prop-types';
import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Posts.module.scss';
import PostItem from '~/components/Layouts/Components/PostItem';
import Heading from '~/components/Common/Heading';
import images from '~/assets/images';
import Pagination from '~/components/Common/Pagination';

const cx = classNames.bind(styles);

function Posts() {
    const [data, setData] = useState([
        {
            title: 'Authentication & Authorization trong ReactJS',
            desc: 'Authentication và Authorization là một phần quan trọng trong việc phát triển phần mềm, giúp chúng ta xác thực và phân quyền...',
            image: images.posts_1,
        },
        {
            title: 'Hướng dẫn chi tiết cách sử dụng Dev Mode trong khóa Pro',
            desc: 'Chào bạn! Nếu bạn đã là học viên khóa Pro của F8, chắc hẳn bạn đã biết tới "Dev Mode" - giúp thực hành code song song khi xem.',
            image: images.posts_2,
        },
        {
            title: 'Cách chỉnh theme Oh-my-posh cho Powershell',
            desc: 'Hello ae mọi người nhé, mọi người (đặc biệt là lập trình viên Software) chắc hẳn đã nghe tới Powershell, nhưng bù lại cái màn hình...',
            image: images.posts_3,
        },
        {
            title: 'Sự khác biệt giữa var, let và const trong JavaScript',
            desc: 'Tôi muốn thảo luận chi tiết về các từ khóa var,...',
            image: images.posts_4,
        },
        {
            title: 'Cách chỉnh theme Oh-my-posh cho Powershell',
            desc: 'Hello ae mọi người nhé, mọi người (đặc biệt là lập trình viên Software) chắc hẳn đã nghe tới Powershell, nhưng bù lại cái màn hình...',
            image: images.posts_3,
        },
        {
            title: 'Sự khác biệt giữa var, let và const trong JavaScript',
            desc: 'Tôi muốn thảo luận chi tiết về các từ khóa var,...',
            image: images.posts_4,
        },
        {
            title: 'Cách chỉnh theme Oh-my-posh cho Powershell',
            desc: 'Hello ae mọi người nhé, mọi người (đặc biệt là lập trình viên Software) chắc hẳn đã nghe tới Powershell, nhưng bù lại cái màn hình...',
            image: images.posts_3,
        },
        {
            title: 'Sự khác biệt giữa var, let và const trong JavaScript',
            desc: 'Tôi muốn thảo luận chi tiết về các từ khóa var,...',
            image: images.posts_4,
        },
    ]);

    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(3);

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);
    const nPages = Math.ceil(data.length / recordsPerPage);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('grid')}>
                {/* <div className={cx('grid-row')}>
                    <div className={cx('grid-column-8')}> */}
                <div className={cx('posts-content')}>
                    <div className={cx('grid-row')}>
                        <div className={cx('grid-column-12')}>
                            <div className={cx('group-title')}>
                                <Heading className={cx('heading')}>Bài viết nổi bật</Heading>
                                <div className={cx('desc')}>
                                    <p>
                                        Tổng hợp các bài viết chia sẻ về kinh nghiệm tự học lập trình online và các kỹ
                                        thuật lập trình web.
                                    </p>
                                </div>
                            </div>
                            {currentRecords.map((data, index) => (
                                <PostItem key={index} data={data} />
                            ))}

                            <Pagination nPages={nPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                        </div>
                    </div>
                </div>
                {/* </div>
                    <div className={cx('grid-column-4')}></div>
                </div> */}
            </div>
        </div>
    );
}

export default Posts;
