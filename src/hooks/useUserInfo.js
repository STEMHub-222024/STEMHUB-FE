import { useMemo, useCallback } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { shallowEqual } from 'react-redux';
import { getUserIdAsync } from '~/app/slices/userSlice';
import { selectAuth } from '~/app/selectors';
import { useAuth } from '~/app/contexts/AuthContext';

function useUserInfo(initialUserId) {
    const dispatch = useDispatch();
    const { infoUserCurrent, allow } = useSelector(selectAuth, shallowEqual);
    const { isLoading: isAuthLoading } = useAuth();

    const userId = useMemo(() => {
        if (!initialUserId && allow && infoUserCurrent?.userId) {
            return infoUserCurrent.userId;
        }
        return initialUserId;
    }, [initialUserId, allow, infoUserCurrent]);

    const fetchUserInfo = useCallback(async () => {
        const info = await dispatch(getUserIdAsync({ userId })).unwrap();
        return info;
    }, [dispatch, userId]);

    return useQuery(['user', userId], fetchUserInfo, {
        enabled: !!userId && !isAuthLoading,
        retry: false,
    });
}

export default useUserInfo;
