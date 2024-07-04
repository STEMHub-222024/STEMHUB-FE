import * as httpRequest from '~/utils/httpRequest';

export const postImage = async (file) => {
    try {
        if (!file) {
            throw new Error('File is required');
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
            throw new Error('Failed to upload image');
        }
    } catch (error) {
        console.error('Error uploading image:', error.message);
    }
};

export const deleteImage = async (nameImage) => {
    try {
        const res = await httpRequest.deleteRequest(`UploadImage/${nameImage}`);
        if (res) {
            return res.data;
        }
    } catch (error) {
        console.error('Error uploading image:', error.message);
    }
};
