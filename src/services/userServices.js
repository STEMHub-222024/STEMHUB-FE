import * as httpRequest from '~/utils/httpRequest';

export const getUseAll = async () => {
    try {
        const res = await httpRequest.get('User');
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {}
};

export const getUserId = async ({ userId }) => {
    try {
        const res = await httpRequest.get(`User/${userId}`);
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {}
};

export const optEmail = async ({ emailUser }) => {
    try {
        const res = await httpRequest.post('User/forgot-password', {
            email: emailUser,
        });
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {}
};

export const resetPassword = async ({ emailUser, passwordUser, confirmPassword, token }) => {
    try {
        const res = await httpRequest.post('User/api/resetpassword', {
            email: emailUser,
            token,
            password: passwordUser,
            confirmPassword,
        });
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {}
};

export const putUserById = async ({ lastName, firstName, email, phoneNumber, image, userId }) => {
    try {
        const res = await httpRequest.put(`User/${userId}`, {
            lastName,
            firstName,
            email,
            phoneNumber,
            image,
        });
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {}
};
