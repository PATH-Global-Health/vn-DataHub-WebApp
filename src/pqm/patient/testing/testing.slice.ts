import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { Testing } from './testing.model';
import testingService from './testing.service';

interface State {
  testingList: Testing[];
  getTestingLoading: boolean;
}

const initialState: State = {
  testingList: [],
  getTestingLoading: false,
};

const getTestingPatient = createAsyncThunk(
  'pqm/patient/testing/getTestingPatient',
  async ({
    pageSize = 10,
    pageIndex = 0,
  }: {
    searchValue?: string;
    pageSize?: number;
    pageIndex?: number;
  }) => {
    const result = await testingService.getTestingPatient({
      pageSize,
      pageIndex,
    });
    return result;
  },
);

const slice = createSlice({
  name: 'pqm/patient/testing',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTestingPatient.pending, (state) => ({
      ...state,
      getTestingLoading: true,
    }));
    builder.addCase(getTestingPatient.fulfilled, (state, { payload }) => ({
      ...state,
      testingList: payload,
      getTestingLoading: false,
    }));
    builder.addCase(getTestingPatient.rejected, (state) => ({
      ...state,
      getTestingLoading: false,
    }));
  },
});

export { getTestingPatient };

export default slice.reducer;
