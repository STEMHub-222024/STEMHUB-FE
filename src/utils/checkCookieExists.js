import Cookies from 'js-cookie';
import { getUserCurrentAsync, refreshTokenAsync } from '~/app/slices/authSlice';

const COOKIE_NAMES = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    SAVE_REFRESH_TOKEN: 'saveRefreshToken',
};

const checkCookieExists = (cookieName) => !!Cookies.get(cookieName);

const handleAccessToken = async (dispatch, accessToken) => {
    try {
        await dispatch(getUserCurrentAsync({ accessToken })).unwrap();
        return { isUser: true };
    } catch (error) {
        console.error('Error in getUserCurrentAsync:', error);
        return { isUser: false };
    }
};

const handleRefreshToken = async (dispatch) => {
    try {
        const saveRefreshToken = JSON.parse(Cookies.get(COOKIE_NAMES.SAVE_REFRESH_TOKEN));
        const result = await dispatch(refreshTokenAsync(saveRefreshToken)).unwrap();

        if (result.isSuccess) {
            const { accessToken, refreshToken } = result.response;

            Cookies.set(COOKIE_NAMES.ACCESS_TOKEN, accessToken.token, {
                expires: new Date(accessToken.expiryTokenDate),
            });
            Cookies.set(COOKIE_NAMES.REFRESH_TOKEN, refreshToken.token, {
                expires: new Date(refreshToken.expiryTokenDate),
            });
            Cookies.set(COOKIE_NAMES.SAVE_REFRESH_TOKEN, JSON.stringify(result.response), { expires: 7 });

            return { isUser: true };
        }
        return { isUser: false };
    } catch (error) {
        console.error('Error in refreshTokenAsync:', error);
        return { isUser: false };
    }
};

const checkCookie = async (dispatch) => {
    if (checkCookieExists(COOKIE_NAMES.ACCESS_TOKEN)) {
        return handleAccessToken(dispatch, Cookies.get(COOKIE_NAMES.ACCESS_TOKEN));
    }

    if (checkCookieExists(COOKIE_NAMES.REFRESH_TOKEN)) {
        return handleRefreshToken(dispatch);
    }

    return { isUser: false };
};

export default checkCookie;
