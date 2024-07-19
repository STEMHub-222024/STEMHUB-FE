import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { setAllow } from '~/app/slices/authSlice';
import checkCookie from '~/utils/checkCookieExists';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    const verifyUser = useCallback(async () => {
        try {
            const isUser = await checkCookie(dispatch);
            if (isUser && isUser.isUser) {
                dispatch(setAllow(isUser));
            } else {
                dispatch(setAllow(false));
            }
        } catch (error) {
            console.error('Error verifying user:', error);
            dispatch(setAllow(false));
        } finally {
            setIsLoading(false);
        }
    }, [dispatch]);

    useEffect(() => {
        verifyUser();
    }, [verifyUser]);

    const contextValue = useMemo(() => ({ isLoading }), [isLoading]);

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
