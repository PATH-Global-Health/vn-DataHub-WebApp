import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  CaseReducer,
} from '@reduxjs/toolkit';

import authService from '@app/services/auth';

import { Token } from '@app/models/token';
import { UserInfo } from '@app/models/user-info';
import { Permission } from '@app/models/permission';

interface State {
  token: Token | null;
  tokenExpiredTime: Date | null;
  loginLoading: boolean;
  userInfo: UserInfo | null;
  getUserInfoLoading: boolean;
  permissionList: Permission[];
}

const initialState: State = {
  token: null,
  tokenExpiredTime: null,
  loginLoading: false,
  userInfo: null,
  getUserInfoLoading: false,
  permissionList: [
    // { code: 'ADMIN' },
    { code: 'CSYT_CATALOG' },
    { code: 'CSYT_WORKING_SCHEDULE' },
    { code: 'CSYT_EXAMINATION' },
    // { code: 'CSYT_VACCINATION' },
    // { code: 'CSYT_TELEMEDICINE' },
  ],
};

type CR<T> = CaseReducer<State, PayloadAction<T>>;

const login = createAsyncThunk(
  'auth/login',
  async (arg: { username: string; password: string }) => {
    const { username, password } = arg;
    const result = await authService.login(username, password);
    return result;
  },
);

const setTokenCR: CR<{
  token: Token;
  tokenExpiredTime: Date;
}> = (state, action) => ({
  ...state,
  token: action.payload.token,
  tokenExpiredTime: action.payload.tokenExpiredTime,
});

const getUserInfo = createAsyncThunk('auth/getUserInfo', async () => {
  const result = await authService.getUserInfo();
  window.document.title = result.name || result.username;
  return result;
});

const logoutCR: CR<void> = () => ({
  ...initialState,
});

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: setTokenCR,
    logout: logoutCR,
  },
  extraReducers: (builder) => {
    // login
    builder.addCase(login.pending, (state) => ({
      ...state,
      loginLoading: true,
    }));
    builder.addCase(login.fulfilled, (state, { payload }) => {
      const { username } = payload;
      return {
        ...state,
        loginLoading: false,
        token: payload,
        tokenExpiredTime: new Date(
          new Date().getTime() + payload.expires_in * 1000,
        ),
        permissionList:
          username === '1'
            ? [{ code: 'ADMIN' }, { code: 'CSYT_CATALOG' }]
            : initialState.permissionList,
      };
    });
    builder.addCase(login.rejected, (state) => ({
      ...state,
      loginLoading: false,
    }));

    // get user info
    builder.addCase(getUserInfo.pending, (state) => ({
      ...state,
      getUserInfoLoading: true,
    }));
    builder.addCase(getUserInfo.fulfilled, (state, { payload }) => ({
      ...state,
      userInfo: payload,
      getUserInfoLoading: false,
    }));
    builder.addCase(getUserInfo.rejected, (state) => ({
      ...state,
      getUserInfoLoading: false,
    }));
  },
});

export { login, getUserInfo };
export const { setToken, logout } = slice.actions;

export default slice.reducer;
