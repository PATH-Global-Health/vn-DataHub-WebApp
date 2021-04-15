import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import doctorService from './doctor.service';
import { Doctor } from './doctor.model';

interface State {
  doctorList: Doctor[];
  getDoctorsLoading: boolean;
}

const initialState: State = {
  doctorList: [],
  getDoctorsLoading: false,
};

const getDoctors = createAsyncThunk(
  'csyt/catalog/doctor/getDoctors',
  async () => {
    const result = await doctorService.getDoctors();
    return result;
  },
);

const slice = createSlice({
  name: 'csyt/catalog/doctor',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDoctors.pending, (state) => ({
      ...state,
      getDoctorsLoading: true,
    }));
    builder.addCase(getDoctors.fulfilled, (state, { payload }) => ({
      ...state,
      getDoctorsLoading: false,
      doctorList: payload,
    }));
    builder.addCase(getDoctors.rejected, (state) => ({
      ...state,
      getDoctorsLoading: false,
    }));
  },
});

export { getDoctors };

export default slice.reducer;
