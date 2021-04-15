import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  CaseReducer,
} from '@reduxjs/toolkit';

import moment from 'moment';

// import { AppState } from '@app/store';
import { StatusMap } from '@app/components/schedule-calendar';
import { Hospital as CSYTHospital } from '@csyt/catalog/hospital/hospital.model';
import { Hospital as AdminHospital } from '@admin/manage-account/models/hospital';
import { Service } from '@csyt/catalog/service/service.model';
import { Doctor } from '@csyt/catalog/doctor/doctor.model';
import {
  WorkingCalendar,
  WorkingCalendarDay,
  WorkingCalendarInterval,
} from '@csyt/working-schedule/working-schedule.model';

import { TelehealthSchedule, TelehealthStatus } from './telehealth.model';
import telehealthService from './telehealth.service';

interface State {
  selectedHospital?: CSYTHospital | AdminHospital;
  availableDateForExportList: Date[];
  getAvailableDateForExportLoading: boolean;
  statusMap: StatusMap;
  telehealthScheduleList: TelehealthSchedule[];
  getTelehealthSchedulesLoading: boolean;
  from: Date;
  to: Date;
  selectedSchedule?: TelehealthSchedule;
  telehealthServiceList: Service[];
  getTelehealthServiceLoading: boolean;
  availableDays: Date[];
  getAvailableDaysLoading: boolean;
  availableDoctors: Doctor[];
  getAvailableDoctorsLoading: boolean;
  availableWorkingCalendar: WorkingCalendar[];
  getAvailableWorkingCalendarLoading: boolean;
  availableReceptionDayList: WorkingCalendarDay[];
  getAvailableReceptionDayLoading: boolean;
  availableReceptionIntervalList: WorkingCalendarInterval[];
  getAvailableReceptionIntervalLoading: boolean;
}

const {
  UNFINISHED,
  FINISHED,
  CANCELED_BY_CUSTOMER,
  NOT_DOING,
  CANCELED,
} = TelehealthStatus;

const initialState: State = {
  statusMap: {
    [UNFINISHED]: { color: 'blue', label: 'Chưa khám' },
    [FINISHED]: { color: 'green', label: 'Đã thực hiện' },
    [CANCELED_BY_CUSTOMER]: { color: 'grey', label: 'Bên hẹn huỷ' },
    [NOT_DOING]: { color: 'brown', label: 'Không thực hiện' },
    [CANCELED]: { color: 'red', label: 'Huỷ' },
  },
  telehealthServiceList: [],
  getTelehealthServiceLoading: false,
  telehealthScheduleList: [],
  getTelehealthSchedulesLoading: false,
  availableDateForExportList: [],
  getAvailableDateForExportLoading: false,
  from: moment().startOf('isoWeek').toDate(),
  to: moment().startOf('isoWeek').add(7, 'days').toDate(),
  availableDays: [],
  getAvailableDaysLoading: false,
  availableDoctors: [],
  getAvailableDoctorsLoading: false,
  availableWorkingCalendar: [],
  getAvailableWorkingCalendarLoading: false,
  availableReceptionDayList: [],
  getAvailableReceptionDayLoading: false,
  availableReceptionIntervalList: [],
  getAvailableReceptionIntervalLoading: false,
};

const getTelehealthSchedules = createAsyncThunk(
  'csyt/telehealth/getTelehealthSchedule',
  async (arg: { from: Date; to: Date; unitId: string }) => {
    const { from, to, unitId } = arg;
    const result = await telehealthService.getTelehealthSchedules(
      from,
      to,
      unitId,
    );
    return result.data.map((e) => {
      if (
        e.status === UNFINISHED &&
        moment(e.interval.from).isBefore(moment().startOf('day'))
      ) {
        return { ...e, Status: NOT_DOING };
      }
      return e;
    });
  },
);

// const getAvailableDays = createAsyncThunk<Date[], void, { state: AppState }>(
//   'csyt/telehealth/getAvailableDays',
//   async (arg, { getState }) => {
//     const hospitalId = getState().auth.userInfo?.id ?? '';
//     const result = await telehealthService.getBookingAvailableDays(hospitalId);
//     return result.map((d) => moment(d).toDate());
//   },
// );

// const getAvailableDoctors = createAsyncThunk<
//   Doctor[],
//   Date,
//   { state: AppState }
// >('csyt/telehealth/getAvailableDoctors', async (date, { getState }) => {
//   const hospitalId = getState().auth.userInfo?.id ?? '';
//   const doctorIds = await telehealthService.getAvailableDoctorIds(
//     hospitalId,
//     date,
//   );

//   const doctorList = getState().csyt.catalog.doctor.doctorList.filter((d) =>
//     doctorIds.includes(d.id),
//   );

//   return doctorList;
// });

// const getAvailableServices = createAsyncThunk<
//   Service[],
//   Date,
//   { state: AppState }
// >('csyt/telehealth/getAvailableServices', async (date, { getState }) => {
//   const hospitalId = getState().auth.userInfo?.id ?? '';
//   const serviceIds = await telehealthService.getAvailableServiceIds(
//     hospitalId,
//     date,
//   );

//   const serviceList = getState().csyt.catalog.service.serviceList.filter((d) =>
//     serviceIds.includes(d.id),
//   );

//   return serviceList;
// });

// const getTelehealthServices = createAsyncThunk(
//   'csyt/telehealth/getTelehealthServices',
//   async ({
//     serviceTypeId,
//     injectionObjectId,
//   }: {
//     serviceTypeId: string;
//     injectionObjectId: string;
//   }) => {
//     const result = await telehealthService.getTelehealthServices(
//       serviceTypeId,
//       injectionObjectId,
//     );
//     return result;
//   },
// );

const getAvailableReceptionDays = createAsyncThunk(
  'csyt/telehealth/getAvailableReceptionDays',
  async (unitId: string) => {
    const result = await telehealthService.getAvailableReceptionDays(unitId);
    return result;
  },
);

const getAvailableReceptionIntervals = createAsyncThunk(
  'csyt/telehealth/getAvailableReceptionIntervals',
  async (dayId: string) => {
    const result = await telehealthService.getAvailableReceptionIntervals(
      dayId,
    );
    return result;
  },
);

// const getAvailableDateForExport = createAsyncThunk(
//   'csyt/telehealth/getAvailableDateForExport',
//   async (unitId: string) => {
//     const result = await telehealthService.getAvailableDateForExport(unitId);
//     return result;
//   },
// );

type CR<T> = CaseReducer<State, PayloadAction<T>>;
const selectHospitalCR: CR<CSYTHospital | AdminHospital | undefined> = (
  state,
  action,
) => ({
  ...state,
  selectedHospital: action.payload,
});

const selectTelehealthScheduleCR: CR<TelehealthSchedule['id'] | undefined> = (
  state,
  action,
) => ({
  ...state,
  selectedSchedule: state.telehealthScheduleList.find(
    (e) => e.id === action.payload,
  ),
});

const setFromToCR: CR<{ from: Date; to: Date }> = (state, action) => ({
  ...state,
  ...action.payload,
});

const slice = createSlice({
  name: 'csyt/telehealth',
  initialState,
  reducers: {
    selectHospital: selectHospitalCR,
    selectTelehealthSchedule: selectTelehealthScheduleCR,
    setFromTo: setFromToCR,
  },
  extraReducers: (builder) => {
    builder.addCase(getTelehealthSchedules.pending, (state) => ({
      ...state,
      getTelehealthSchedulesLoading: true,
    }));
    builder.addCase(getTelehealthSchedules.fulfilled, (state, action) => ({
      ...state,
      telehealthScheduleList: action.payload,
      getTelehealthSchedulesLoading: false,
      selectedSchedule: action.payload.find(
        (e) => e.id === state.selectedSchedule?.id,
      ),
    }));
    builder.addCase(getTelehealthSchedules.rejected, (state) => ({
      ...state,
      getTelehealthSchedulesLoading: false,
    }));
    // builder.addCase(getAvailableDateForExport.pending, (state) => ({
    //   ...state,
    //   getAvailableDateForExportLoading: true,
    // }));
    // builder.addCase(getAvailableDateForExport.fulfilled, (state, action) => ({
    //   ...state,
    //   getAvailableDateForExportLoading: false,
    //   availableDateForExportList: action.payload,
    // }));
    // builder.addCase(getAvailableDateForExport.rejected, (state) => ({
    //   ...state,
    //   getAvailableDateForExportLoading: false,
    // }));
    // builder.addCase(getAvailableDays.pending, (state) => ({
    //   ...state,
    //   getAvailableDaysLoading: true,
    // }));
    // builder.addCase(getAvailableDays.fulfilled, (state, action) => ({
    //   ...state,
    //   availableDays: action.payload,
    //   getAvailableDaysLoading: false,
    // }));
    // builder.addCase(getAvailableDays.rejected, (state) => ({
    //   ...state,
    //   getAvailableDaysLoading: false,
    // }));

    // builder.addCase(getAvailableDoctors.pending, (state) => ({
    //   ...state,
    //   getAvailableDoctorsLoading: true,
    // }));
    // builder.addCase(getAvailableDoctors.fulfilled, (state, action) => ({
    //   ...state,
    //   availableDoctors: action.payload,
    //   getAvailableDoctorsLoading: false,
    // }));
    // builder.addCase(getAvailableDoctors.rejected, (state) => ({
    //   ...state,
    //   getAvailableDoctorsLoading: false,
    // }));
    builder.addCase(getAvailableReceptionDays.pending, (state) => ({
      ...state,
      getAvailableReceptionDayLoading: true,
    }));
    builder.addCase(
      getAvailableReceptionDays.fulfilled,
      (state, { payload }) => ({
        ...state,
        getAvailableReceptionDayLoading: false,
        availableReceptionDayList: payload,
      }),
    );
    builder.addCase(getAvailableReceptionDays.rejected, (state) => ({
      ...state,
      getAvailableReceptionDayLoading: false,
    }));
    builder.addCase(getAvailableReceptionIntervals.pending, (state) => ({
      ...state,
      getAvailableReceptionIntervalLoading: true,
    }));
    builder.addCase(
      getAvailableReceptionIntervals.fulfilled,
      (state, { payload }) => ({
        ...state,
        availableReceptionIntervalList: payload,
        getAvailableReceptionIntervalLoading: false,
      }),
    );
    builder.addCase(getAvailableReceptionIntervals.rejected, (state) => ({
      ...state,
      getAvailableReceptionIntervalLoading: false,
    }));
  },
});

const { selectHospital, selectTelehealthSchedule, setFromTo } = slice.actions;

export {
  selectHospital,
  getTelehealthSchedules,
  selectTelehealthSchedule,
  setFromTo,
  // getAvailableDateForExport,
  // getAvailableDays,
  // getAvailableDoctors,
  getAvailableReceptionDays,
  getAvailableReceptionIntervals,
};

export default slice.reducer;
