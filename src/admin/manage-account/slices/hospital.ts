import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  CaseReducer,
} from '@reduxjs/toolkit';

import { hospitalService } from '../services';
import { Hospital } from '../models/hospital';

interface State {
  hospitalList: Hospital[];
  getHospitalsLoading: boolean;
}

const initialState: State = {
  hospitalList: [],
  getHospitalsLoading: false,
};

type CR<T> = CaseReducer<State, PayloadAction<T>>;

const getHospitals = createAsyncThunk(
  'admin/account/hospital/getHospitals',
  async () => {
    const result = await hospitalService.getHospitals();
    return result;
  },
);

const slice = createSlice({
  name: 'admin/account/hospital',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getHospitals.pending, (state) => ({
      ...state,
      getHospitalsLoading: true,
    }));
    builder.addCase(getHospitals.fulfilled, (state, { payload }) => ({
      ...state,
      hospitalList: payload,
      getHospitalsLoading: false,
    }));
    builder.addCase(getHospitals.rejected, (state) => ({
      ...state,
      getHospitalsLoading: false,
    }));
  },
});

export { getHospitals };

export default slice.reducer;
