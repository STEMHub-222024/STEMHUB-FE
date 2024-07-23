import React from 'react';
import classNames from 'classnames/bind';
import { Card, Popconfirm, message, Dropdown, Space } from 'antd';
import { IconDots } from '@tabler/icons-react';
import formatDateToNow from '~/utils/formatDateToNow';
import { deleteImage } from '~/services/uploadImage';
import { deletePosts } from '~/services/postServices';
import styles from './MyPostsItem.module.scss';

const cx = classNames.bind(styles);

function MyPostsItem({ data, onPostDeleted, onPostEdit }) {
    const items = [
        {
            key: '1',
            label: (
                <span className={cx('option-item')} onClick={() => onPostEdit(data)}>
                    Chỉnh sửa
                </span>
            ),
        },
        {
            key: '2',
            label: (
                <Popconfirm
                    title="Xoá Bài Viết"
                    description="Bạn có chắc muốn xoá không?"
                    onConfirm={() => confirm(data?.newspaperArticleId, data?.image, data?.htmlContent)}
                    okText="Xoá"
                    cancelText="Không"
                >
                    <span className={cx('option-item')}>Xoá bài</span>
                </Popconfirm>
            ),
        },
    ];

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
                <>
                    <Space direction="vertical">
                        <Space wrap>
                            <Dropdown
                                menu={{
                                    items,
                                }}
                                placement="bottomLeft"
                                trigger={['click']}
                                className={cx('dropdown')}
                            >
                                <IconDots className={cx('options')} />
                            </Dropdown>
                        </Space>
                    </Space>
                </>
            }
        >
            <div className={cx('content')}>
                {data?.description_na}
                <span>{formatDateToNow(data.create_at ?? '')}</span>
            </div>
        </Card>
    );
}

export default MyPostsItem;
