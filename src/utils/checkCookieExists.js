import Cookies from 'js-cookie';
import { getUserCurrentAsync, refreshTokenAsync } from '~/app/slices/authSlice';

function checkCookieExists(cookieName) {
    return !!Cookies.get(cookieName);
}

function checkCookie(dispatch) {
    if (checkCookieExists('accessToken')) {
        const accessToken = Cookies.get('accessToken');
        const fetchApi = async () => {
            try {
                await dispatch(getUserCurrentAsync({ accessToken })).unwrap();
                return true;
            } catch (rejectedValueOrSerializedError) {
                console.error(rejectedValueOrSerializedError);
                return false;
            }
        };
        return fetchApi();
    } else if (checkCookieExists('refreshToken')) {
        const saveRefreshToken = Cookies.get('saveRefreshToken');
        const saveRefreshTokenJs = JSON.parse(saveRefreshToken);
        const fetchApi = async () => {
            try {
                const result = await dispatch(refreshTokenAsync(saveRefreshTokenJs)).unwrap();
                if (result.isSuccess === true) {
                    const { accessToken, refreshToken } = result.response;
                    const expiresAccessToken = new Date(accessToken.expiryTokenDate);
                    const expiresRefreshToken = new Date(refreshToken.expiryTokenDate);
                    Cookies.set('accessToken', accessToken.token, { expires: expiresAccessToken });
                    Cookies.set('refreshToken', refreshToken.token, { expires: expiresRefreshToken });
                    Cookies.set('saveRefreshToken', JSON.stringify(result.response), {
                        expires: 7,
                    });
                    return true;
                }
            } catch (rejectedValueOrSerializedError) {
                console.error(rejectedValueOrSerializedError);
                return false;
            }
        };
        return fetchApi();
    } else {
        return Promise.resolve(false);
    }
}
export default checkCookie;
