import * as httpRequest from '~/utils/httpRequest';

export const postAuthUser = async ({ username, firstName, lastName, email, password, roles = 'User' }) => {
    try {
        const res = await httpRequest.post('Auth/register', {
            username,
            firstName,
            lastName,
            email,
            password,
            roles: [roles],
        });

        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {}
};

export const loginAuthUser = async ({ username, password }) => {
    try {
        const res = await httpRequest.post('Auth/login', {
            username,
            password,
        });
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {}
};

export const getUserCurrent = async ({ accessToken }) => {
    try {
        const res = await httpRequest.get('/Auth/info', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {}
};

export const refreshToken = async (infoData) => {
    try {
        const res = await httpRequest.post('Auth/Refresh-Token', infoData);
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {}
};
