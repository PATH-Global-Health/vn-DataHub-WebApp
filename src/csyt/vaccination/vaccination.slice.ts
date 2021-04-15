import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  CaseReducer,
} from '@reduxjs/toolkit';

import moment from 'moment';

import { AppState } from '@app/store';
import { StatusMap } from '@app/components/schedule-calendar';
import {
  WorkingCalendar,
  WorkingCalendarDay,
  WorkingCalendarInterval,
} from '@csyt/working-schedule/working-schedule.model';
import { Hospital as CSYTHospital } from '@csyt/catalog/hospital/hospital.model';
import { Hospital as AdminHospital } from '@admin/manage-account/models/hospital';

import {
  InjectionObject,
  VaccinationSchedule,
  VaccinationStatistic,
  VaccinationStatus,
} from './vaccination.model';
import vaccinationService from './vaccination.service';

import { Service } from '../catalog/service/service.model';
import { Doctor } from '../catalog/doctor/doctor.model';

const {
  UNFINISHED,
  FINISHED,
  CANCELED_BY_CUSTOMER,
  NOT_DOING,
  CANCELED,
  TRANSFERRED,
} = VaccinationStatus;

interface State {
  selectedHospital?: CSYTHospital | AdminHospital;
  statusMap: StatusMap;
  vaccinationScheduleList: VaccinationSchedule[];
  getVaccinationSchedulesLoading: boolean;
  selectedSchedule?: VaccinationSchedule;
  from?: Date;
  to?: Date;
  injectionObjectList: InjectionObject[];
  getInjectionObjectsLoading: boolean;
  availableDays: Date[];
  getAvailableDaysLoading: boolean;
  availableServices: Service[];
  getAvailableServicesLoading: boolean;
  availableDoctors: Doctor[];
  getAvailableDoctorsLoading: boolean;
  vaccinationServiceList: Service[];
  getVaccinationServiceLoading: boolean;
  availableWorkingCalendar: WorkingCalendar[];
  getAvailableWorkingCalendarLoading: boolean;
  availableReceptionDayList: WorkingCalendarDay[];
  getAvailableReceptionDayLoading: boolean;
  availableReceptionIntervalList: WorkingCalendarInterval[];
  getAvailableReceptionIntervalLoading: boolean;
  statisticData?: VaccinationStatistic;
  getStatisticLoading: boolean;
  availableDateForExportList: Date[];
  getAvailableDateForExportLoading: boolean;
}

const initialState: State = {
  statusMap: {
    [UNFINISHED]: { color: 'blue', label: 'Chưa khám' },
    [FINISHED]: { color: 'green', label: 'Đã thực hiện' },
    [CANCELED_BY_CUSTOMER]: { color: 'grey', label: 'Bên hẹn huỷ' },
    [NOT_DOING]: { color: 'brown', label: 'Không thực hiện' },
    [CANCELED]: { color: 'red', label: 'Huỷ' },
    [TRANSFERRED]: { color: 'violet', label: 'Chuyển tiếp' },
  },
  from: moment().startOf('isoWeek').toDate(),
  to: moment().startOf('isoWeek').add(7, 'days').toDate(),
  vaccinationScheduleList: [],
  getVaccinationSchedulesLoading: false,
  injectionObjectList: [],
  getInjectionObjectsLoading: false,
  availableDays: [],
  getAvailableDaysLoading: false,
  availableDoctors: [],
  getAvailableDoctorsLoading: false,
  availableServices: [],
  getAvailableServicesLoading: false,
  vaccinationServiceList: [],
  getVaccinationServiceLoading: false,
  availableWorkingCalendar: [],
  getAvailableWorkingCalendarLoading: false,
  availableReceptionDayList: [],
  getAvailableReceptionDayLoading: false,
  availableReceptionIntervalList: [],
  getAvailableReceptionIntervalLoading: false,
  statisticData: undefined,
  getStatisticLoading: false,
  availableDateForExportList: [],
  getAvailableDateForExportLoading: false,
};

type CR<T> = CaseReducer<State, PayloadAction<T>>;
const selectHospitalCR: CR<CSYTHospital | AdminHospital | undefined> = (
  state,
  action,
) => ({
  ...state,
  selectedHospital: action.payload,
});

const getVaccinationSchedules = createAsyncThunk(
  'csyt/vaccination/getVaccinationSchedules',
  async (arg: { from: Date; to: Date; unitId: string }) => {
    const { from, to, unitId } = arg;
    const result = await vaccinationService.getVaccinationSchedules(
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

const getVaccinationStatistic = createAsyncThunk(
  'csyt/vaccination/getVaccinationStatistic',
  async (arg: { from: Date; to: Date; unitId: string }) => {
    const { from, to, unitId } = arg;
    const result = await vaccinationService.getVaccinationStatistic(
      from,
      to,
      unitId,
    );

    return result;
  },
);

const selectVaccinationScheduleCR: CR<VaccinationSchedule['id'] | undefined> = (
  state,
  action,
) => ({
  ...state,
  selectedSchedule: state.vaccinationScheduleList.find(
    (e) => e.id === action.payload,
  ),
});

const setFromToCR: CR<{ from: Date; to: Date }> = (state, action) => ({
  ...state,
  ...action.payload,
});

const getInjectionObjects = createAsyncThunk(
  'csyt/vaccination/getInjectionObjects',
  async () => {
    const result = await vaccinationService.getInjectionObjects();
    return result;
  },
);

const getAvailableDays = createAsyncThunk<Date[], void, { state: AppState }>(
  'csyt/vaccination/getAvailableDays',
  async (arg, { getState }) => {
    const hospitalId = getState().auth.userInfo?.id ?? '';
    const result = await vaccinationService.getBookingAvailableDays(hospitalId);
    return result.map((d) => moment(d).toDate());
  },
);

const getAvailableDoctors = createAsyncThunk<
  Doctor[],
  Date,
  { state: AppState }
>('csyt/vaccination/getAvailableDoctors', async (date, { getState }) => {
  const hospitalId = getState().auth.userInfo?.id ?? '';
  const doctorIds = await vaccinationService.getAvailableDoctorIds(
    hospitalId,
    date,
  );

  const doctorList = getState().csyt.catalog.doctor.doctorList.filter((d) =>
    doctorIds.includes(d.id),
  );

  return doctorList;
});

const getAvailableServices = createAsyncThunk<
  Service[],
  Date,
  { state: AppState }
>('csyt/vaccination/getAvailableServices', async (date, { getState }) => {
  const hospitalId = getState().auth.userInfo?.id ?? '';
  const serviceIds = await vaccinationService.getAvailableServiceIds(
    hospitalId,
    date,
  );

  const serviceList = getState().csyt.catalog.service.serviceList.filter((d) =>
    serviceIds.includes(d.id),
  );

  return serviceList;
});

const getVaccinationServices = createAsyncThunk(
  'csyt/vaccination/getVaccinationServices',
  async ({
    serviceTypeId,
    injectionObjectId,
  }: {
    serviceTypeId: string;
    injectionObjectId: string;
  }) => {
    const result = await vaccinationService.getVaccinationServices(
      serviceTypeId,
      injectionObjectId,
    );
    return result;
  },
);

const getAvailableReceptionDays = createAsyncThunk(
  'csyt/vaccination/getAvailableReceptionDays',
  async (arg: { serviceId: string; unitId: string }) => {
    const { serviceId, unitId } = arg;
    const result = await vaccinationService.getAvailableReceptionDays(
      serviceId,
      unitId,
    );
    return result;
  },
);

const getAvailableReceptionIntervals = createAsyncThunk(
  'csyt/vaccination/getAvailableReceptionIntervals',
  async (dayId: string) => {
    const result = await vaccinationService.getAvailableReceptionIntervals(
      dayId,
    );
    return result;
  },
);

const getAvailableDateForExport = createAsyncThunk(
  'csyt/vaccination/getAvailableDateForExport',
  async (unitId: string) => {
    const result = await vaccinationService.getAvailableDateForExport(unitId);
    return result;
  },
);

const slice = createSlice({
  name: 'csyt/vaccination',
  initialState,
  reducers: {
    selectHospital: selectHospitalCR,
    selectVaccinationSchedule: selectVaccinationScheduleCR,
    setFromTo: setFromToCR,
  },
  extraReducers: (builder) => {
    builder.addCase(getVaccinationSchedules.pending, (state) => ({
      ...state,
      getVaccinationSchedulesLoading: true,
    }));
    builder.addCase(getVaccinationSchedules.fulfilled, (state, action) => ({
      ...state,
      vaccinationScheduleList: action.payload,
      getVaccinationSchedulesLoading: false,
      selectedSchedule: action.payload.find(
        (s) => s.id === state.selectedSchedule?.id,
      ),
    }));
    builder.addCase(getVaccinationSchedules.rejected, (state) => ({
      ...state,
      getVaccinationSchedulesLoading: false,
    }));

    builder.addCase(getInjectionObjects.pending, (state) => ({
      ...state,
      getInjectionObjectsLoading: true,
    }));
    builder.addCase(getInjectionObjects.fulfilled, (state, action) => ({
      ...state,
      injectionObjectList: action.payload,
      getInjectionObjectsLoading: false,
    }));
    builder.addCase(getInjectionObjects.rejected, (state) => ({
      ...state,
      getInjectionObjectsLoading: false,
    }));

    builder.addCase(getAvailableDays.pending, (state) => ({
      ...state,
      getAvailableDaysLoading: true,
    }));
    builder.addCase(getAvailableDays.fulfilled, (state, action) => ({
      ...state,
      availableDays: action.payload,
      getAvailableDaysLoading: false,
    }));
    builder.addCase(getAvailableDays.rejected, (state) => ({
      ...state,
      getAvailableDaysLoading: false,
    }));

    builder.addCase(getAvailableDoctors.pending, (state) => ({
      ...state,
      getAvailableDoctorsLoading: true,
    }));
    builder.addCase(getAvailableDoctors.fulfilled, (state, action) => ({
      ...state,
      availableDoctors: action.payload,
      getAvailableDoctorsLoading: false,
    }));
    builder.addCase(getAvailableDoctors.rejected, (state) => ({
      ...state,
      getAvailableDoctorsLoading: false,
    }));

    builder.addCase(getAvailableServices.pending, (state) => ({
      ...state,
      getAvailableServicesLoading: true,
    }));
    builder.addCase(getAvailableServices.fulfilled, (state, action) => ({
      ...state,
      availableServices: action.payload,
      getAvailableServicesLoading: false,
    }));
    builder.addCase(getAvailableServices.rejected, (state) => ({
      ...state,
      getAvailableServicesLoading: false,
    }));
    builder.addCase(getVaccinationServices.pending, (state) => ({
      ...state,
      getVaccinationServiceLoading: true,
    }));
    builder.addCase(getVaccinationServices.fulfilled, (state, { payload }) => ({
      ...state,
      getVaccinationServiceLoading: false,
      vaccinationServiceList: payload,
    }));
    builder.addCase(getVaccinationServices.rejected, (state) => ({
      ...state,
      getVaccinationServiceLoading: false,
    }));
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
    builder.addCase(getVaccinationStatistic.pending, (state) => ({
      ...state,
      getStatisticLoading: true,
    }));
    builder.addCase(
      getVaccinationStatistic.fulfilled,
      (state, { payload }) => ({
        ...state,
        statisticData: payload,
        getStatisticLoading: false,
      }),
    );
    builder.addCase(getVaccinationStatistic.rejected, (state) => ({
      ...state,
      getStatisticLoading: false,
    }));
    builder.addCase(getAvailableDateForExport.pending, (state) => ({
      ...state,
      getAvailableDateForExportLoading: true,
    }));
    builder.addCase(getAvailableDateForExport.fulfilled, (state, action) => ({
      ...state,
      getAvailableDateForExportLoading: false,
      availableDateForExportList: action.payload,
    }));
    builder.addCase(getAvailableDateForExport.rejected, (state) => ({
      ...state,
      getAvailableDateForExportLoading: false,
    }));
  },
});

const { selectHospital, selectVaccinationSchedule, setFromTo } = slice.actions;

export {
  getVaccinationSchedules,
  selectVaccinationSchedule,
  getInjectionObjects,
  selectHospital,
  setFromTo,
  getAvailableDays,
  getAvailableDoctors,
  getAvailableServices,
  getAvailableReceptionDays,
  getAvailableReceptionIntervals,
  getVaccinationServices,
  getVaccinationStatistic,
  getAvailableDateForExport,
};

export default slice.reducer;
