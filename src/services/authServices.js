import * as httpRequest from '~/utils/httpRequest';

export const postAuthUser = async ({ username, firstName, lastName, email, password, roles = ['User'] }) => {
    const res = await httpRequest.post('Auth/register', {
        username,
        firstName,
        lastName,
        email,
        password,
        roles,
    });

    if (res.status === 200) {
        return res.data;
    }
};

export const loginAuthUser = async ({ username, password }) => {
    const res = await httpRequest.post('Auth/login', {
        username,
        password,
    });
    if (res.status === 200) {
        return res.data;
    }
};

export const getUserCurrent = async ({ accessToken }) => {
    const res = await httpRequest.get('/Auth/info', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (res.status === 200) {
        return res.data;
    }
};

export const refreshToken = async (infoData) => {
    const res = await httpRequest.post('Auth/Refresh-Token', infoData);
    if (res.status === 200) {
        return res.data;
    }
};
