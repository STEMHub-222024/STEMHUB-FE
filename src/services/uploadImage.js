import * as httpRequest from '~/utils/httpRequest';
import { message } from 'antd';

export const getImages = async () => {
    try {
        const res = await httpRequest.get('UploadImage');
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {}
};

export const postImage = async (file) => {
    try {
        if (!file) {
            message.error('Vui lòng chọn một file ảnh để tải lên!');
        }

        const formData = new FormData();
        formData.append('file', file);

        const res = await httpRequest.post('UploadImage', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (res && res.data) {
            return res.data;
        } else {
            message.error('Không thể tải hình ảnh lên!');
        }
    } catch (error) {}
};

export const deleteImage = async (nameImage) => {
    try {
        const res = await httpRequest.deleteRequest(`UploadImage/${nameImage}`);
        if (res) {
            return res.data;
        }
    } catch (error) {}
};
