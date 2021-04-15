import { useCallback } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import moment from 'moment';

import {
  login as li,
  logout as lo,
  getUserInfo,
  setToken,
} from '../slices/auth';

import useSelector from './use-selector';
import useDispatch from './use-dispatch';

import { Token } from '../models/token';
import { TOKEN, EXPIRED_TIME } from '../utils/constants';

type UseAuth = {
  isAuthenticated: () => boolean;
  login: (
    username: string,
    password: string,
    remember: boolean,
  ) => Promise<void>;
  logout: () => void;
  hasPermission: (code: string) => boolean;
};

const getStorage = (key: string): string =>
  (localStorage.getItem(key) || sessionStorage.getItem(key)) ?? 'null';

const useAuth = (): UseAuth => {
  const dispatch = useDispatch();

  const isAuthenticated = useCallback((): boolean => {
    const token = JSON.parse(getStorage(TOKEN)) as Token;
    const tokenExpiredTime: Date = new Date(getStorage(EXPIRED_TIME));
    if (token && tokenExpiredTime > new Date()) {
      dispatch(setToken({ token, tokenExpiredTime }));
      return true;
    }
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(EXPIRED_TIME);
    sessionStorage.removeItem(TOKEN);
    sessionStorage.removeItem(EXPIRED_TIME);
    dispatch(lo());
    return false;
  }, [dispatch]);

  const login = async (
    username: string,
    password: string,
    remember: boolean,
  ): Promise<void> => {
    const token = unwrapResult(await dispatch(li({ username, password })));
    if (remember) {
      localStorage.setItem(TOKEN, JSON.stringify(token));
      localStorage.setItem(
        EXPIRED_TIME,
        moment()
          .add(token.expires_in * 1000, 'seconds')
          .toString(),
      );
    } else {
      sessionStorage.setItem(TOKEN, JSON.stringify(token));
      sessionStorage.setItem(
        EXPIRED_TIME,
        moment()
          .add(token.expires_in * 1000, 'seconds')
          .toString(),
      );
    }
    dispatch(getUserInfo());
  };

  const logout = useCallback((): void => {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(EXPIRED_TIME);
    sessionStorage.removeItem(TOKEN);
    sessionStorage.removeItem(EXPIRED_TIME);
    dispatch(lo());
  }, [dispatch]);

  const { permissionList } = useSelector((state) => state.auth);
  const hasPermission = useCallback(
    (code: string): boolean => {
      return (
        permissionList.map((p) => p.code).includes('ALL') ||
        permissionList.map((p) => p.code).includes(code)
      );
    },
    [permissionList],
  );

  return {
    isAuthenticated,
    login,
    logout,
    hasPermission,
  };
};

export default useAuth;
