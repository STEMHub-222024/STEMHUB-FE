import classNames from 'classnames/bind';
import { Card, Popconfirm, message } from 'antd';
import { IconTrash } from '@tabler/icons-react';
import formatDateToNow from '~/utils/formatDateToNow';
import { deleteImage } from '~/services/uploadImage';
import { deletePosts } from '~/services/postServices';
import styles from './MyPostsItem.module.scss';

const cx = classNames.bind(styles);

function MyPostsItemMyPostsItem({ data, onPostDeleted }) {
    const confirm = async (newspaperArticleId, removeImage, htmlContent) => {
        if (newspaperArticleId) {
            try {
                await deletePosts(newspaperArticleId);
                message.success('Xoá bài viết thành công!');
                await onPostDeleted();
            } catch (error) {
                message.error('Xoá bài viết thất bại!');
            }
            if (removeImage) {
                try {
                    await deleteImage(removeImage.split('uploadimage/')[1]);
                } catch (error) {
                    console.error('Error deleting image:', error);
                }
            }

            if (htmlContent) {
                const newImages = Array.from(htmlContent.matchAll(/<img src="(.*?)"/g)).map((match) => match[1]);

                newImages.forEach(async (url) => {
                    try {
                        await deleteImage(url.split('uploadimage/')[1]);
                    } catch (error) {
                        console.error('Error deleting image:', error);
                    }
                });
            }
        }
    };

    return (
        <Card
            type="inner"
            title={data?.title}
            extra={
                <Popconfirm
                    title="Xoá Bài Viết"
                    description="Bạn có chắc muốn xoá không?"
                    onConfirm={() => confirm(data?.newspaperArticleId, data?.image, data?.htmlContent)}
                    okText="Xoá"
                    cancelText="Không"
                >
                    <IconTrash className={cx('iconRemoveComment')} />
                </Popconfirm>
            }
        >
            <div className={cx('content')}>
                {data?.description}
                <span>{formatDateToNow(data.create_at ?? '')}</span>
            </div>
        </Card>
    );
}

export default MyPostsItemMyPostsItem;
