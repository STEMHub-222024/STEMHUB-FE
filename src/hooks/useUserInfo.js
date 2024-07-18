import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { getUserIdAsync } from '~/app/slices/userSlice';
import { setAllow } from '~/app/slices/authSlice';
import checkCookie from '~/utils/checkCookieExists';
import { selectAuth } from '~/app/selectors';

function useUserInfo(initialUserId) {
    const dispatch = useDispatch();
    const { infoUserCurrent } = useSelector(selectAuth).data;
    const [userId, setUserId] = useState(initialUserId);

    useEffect(() => {
        if (!userId) {
            checkCookie(dispatch)
                .then((isUser) => {
                    dispatch(setAllow(isUser));
                    if (isUser) {
                        setUserId(infoUserCurrent.userId);
                    }
                })
                .catch((isUser) => {
                    dispatch(setAllow(isUser));
                });
        }
    }, [dispatch, userId, infoUserCurrent]);

    useEffect(() => {
        checkCookie(dispatch)
            .then((isUser) => {
                dispatch(setAllow(isUser));
            })
            .catch((isUser) => {
                dispatch(setAllow(isUser));
            });
    }, [dispatch]);

    return useQuery(
        ['user', userId],
        async () => {
            const info = await dispatch(getUserIdAsync({ userId })).unwrap();
            return info;
        },
        {
            enabled: !!userId,
            retry: false,
        },
    );
}

export default useUserInfo;
