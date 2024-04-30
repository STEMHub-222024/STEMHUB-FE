import * as httpRequest from '~/utils/httpRequest';

export const optEmail = async ({ emailUser }) => {
    const res = await httpRequest.post('User/forgot-password', {
        email: emailUser,
    });
    if (res.status === 200) {
        return res.data;
    }
};

export const resetPassword = async ({ emailUser, passwordUser, confirmPassword, token }) => {
    const res = await httpRequest.post('User/api/resetpassword', {
        email: emailUser,
        token,
        password: passwordUser,
        confirmPassword,
    });
    if (res.status === 200) {
        return res.data;
    }
};
