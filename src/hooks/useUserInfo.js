import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { getUserIdAsync } from '~/app/slices/userSlice';
import { selectAuth } from '~/app/selectors';
import { useAuth } from '~/app/contexts/AuthContext';

function useUserInfo(initialUserId) {
    const dispatch = useDispatch();
    const { infoUserCurrent, allow } = useSelector(selectAuth).data;
    const [userId, setUserId] = useState(initialUserId);
    const { isLoading: isAuthLoading } = useAuth();

    useEffect(() => {
        if (!userId && allow && infoUserCurrent?.userId) {
            setUserId(infoUserCurrent.userId);
        }
    }, [userId, allow, infoUserCurrent]);

    return useQuery(
        ['user', userId],
        async () => {
            const info = await dispatch(getUserIdAsync({ userId })).unwrap();
            return info;
        },
        {
            enabled: !!userId && !isAuthLoading,
            retry: false,
        },
    );
}

export default useUserInfo;
