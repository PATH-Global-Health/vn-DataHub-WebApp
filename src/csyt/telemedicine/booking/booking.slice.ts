import {
  CaseReducer,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import bookingService from './booking.service';

import { Hospital } from '../../catalog/hospital/hospital.model';
import { Doctor, DayFreeSlot, DoctorService, Slot } from './booking.model';

interface State {
  hospitalList: Hospital[];
  getHospitalsLoading: boolean;
  selectedHospital?: Hospital;
  doctorList: Doctor[];
  getDoctorsLoading: boolean;
  selectedDoctor?: Doctor;
  doctorServiceList: DoctorService[];
  getDoctorServicesLoading: boolean;
  selectedService?: DoctorService;
  doctorWorkingDayList: Date[];
  getDoctorWorkingDaysLoading: boolean;
  selectedDoctorDay?: Date;
  doctorFreeSlotList?: DayFreeSlot;
  getDoctorFreeSlotsLoading: boolean;
  selectedSlotTimeId?: Slot['TimeId'];
}

const initialState: State = {
  hospitalList: [],
  getHospitalsLoading: false,
  doctorList: [],
  getDoctorsLoading: false,
  doctorServiceList: [],
  getDoctorServicesLoading: false,
  doctorWorkingDayList: [],
  getDoctorWorkingDaysLoading: false,
  getDoctorFreeSlotsLoading: false,
};

type CR<T> = CaseReducer<State, PayloadAction<T>>;

const getHospitals = createAsyncThunk(
  'csyt/telemedicine/getHospitals',
  async () => {
    const result = await bookingService.getHospitals();
    return result;
  },
);

const selectHospitalCR: CR<Hospital['id'] | undefined> = (state, action) => ({
  ...state,
  selectedHospital: state.hospitalList.find((h) => h.id === action.payload),
  selectedDoctor: undefined,
  doctorList: [],
  selectedService: undefined,
  doctorServiceList: [],
  selectedDoctorDay: undefined,
  doctorWorkingDayList: [],
  selectedSlotTimeId: undefined,
  doctorFreeSlotList: undefined,
});

const getDoctors = createAsyncThunk(
  'csyt/telemedicine/getDoctors',
  async (hospitalId: Hospital['id']) => {
    const result = await bookingService.getDoctors(hospitalId);
    return result;
  },
);

const selectDoctorCR: CR<Doctor['Id'] | undefined> = (state, action) => ({
  ...state,
  selectedDoctor: state.doctorList.find((d) => d.Id === action.payload),
  selectedService: undefined,
  doctorServiceList: [],
  selectedDoctorDay: undefined,
  doctorWorkingDayList: [],
  selectedSlotTimeId: undefined,
  doctorFreeSlotList: undefined,
});

const getDoctorServices = createAsyncThunk(
  'csyt/telemedicine/getDoctorServices',
  async (doctorId: Doctor['Id']) => {
    const result = await bookingService.getServices(doctorId);
    return result;
  },
);

const selectServiceCR: CR<DoctorService['Id']> = (state, action) => ({
  ...state,
  selectedService: state.doctorServiceList.find((s) => s.Id === action.payload),
  selectedDoctorDay: undefined,
  doctorWorkingDayList: [],
  selectedSlotTimeId: undefined,
  doctorFreeSlotList: undefined,
});

const getAvailableDays = createAsyncThunk(
  'csyt/telemedicine/getAvailableDays',
  async (arg: { doctorId: Doctor['Id']; serviceId: DoctorService['Id'] }) => {
    const { doctorId, serviceId } = arg;
    const result = await bookingService.getWorkingDays(doctorId, serviceId);
    return result;
  },
);

const selectDayCR: CR<Date> = (state, action) => ({
  ...state,
  selectedDoctorDay: action.payload,
  selectedSlotTimeId: undefined,
  doctorFreeSlotList: undefined,
});

const getSlots = createAsyncThunk(
  'csyt/telemedicine/getSlots',
  async (arg: {
    hospitalId: Hospital['id'];
    doctorId: Doctor['Id'];
    serviceId: DoctorService['Id'];
    date: Date;
  }) => {
    const { hospitalId, doctorId, serviceId, date } = arg;
    const result = await bookingService.getSlots(
      hospitalId,
      doctorId,
      serviceId,
      date,
    );
    return result;
  },
);

const selectSlotCR: CR<Slot['TimeId'] | undefined> = (state, action) => ({
  ...state,
  selectedSlotTimeId: action.payload,
});

const slice = createSlice({
  name: 'csyt/telemedicine',
  initialState,
  reducers: {
    selectHospital: selectHospitalCR,
    selectDoctor: selectDoctorCR,
    selectService: selectServiceCR,
    selectDay: selectDayCR,
    selectSlot: selectSlotCR,
  },
  extraReducers: (builder) => {
    builder.addCase(getHospitals.pending, (state) => ({
      ...state,
      getHospitalsLoading: true,
    }));
    builder.addCase(getHospitals.fulfilled, (state, action) => ({
      ...state,
      hospitalList: action.payload,
      getHospitalsLoading: false,
    }));
    builder.addCase(getHospitals.rejected, (state) => ({
      ...state,
      getHospitalsLoading: false,
    }));

    builder.addCase(getDoctors.pending, (state) => ({
      ...state,
      getDoctorsLoading: true,
    }));
    builder.addCase(getDoctors.fulfilled, (state, action) => ({
      ...state,
      doctorList: action.payload,
      getDoctorsLoading: false,
    }));
    builder.addCase(getDoctors.rejected, (state) => ({
      ...state,
      getDoctorsLoading: false,
    }));

    builder.addCase(getDoctorServices.pending, (state) => ({
      ...state,
      getDoctorServicesLoading: true,
    }));
    builder.addCase(getDoctorServices.fulfilled, (state, action) => ({
      ...state,
      doctorServiceList: action.payload,
      getDoctorServicesLoading: false,
    }));
    builder.addCase(getDoctorServices.rejected, (state) => ({
      ...state,
      getDoctorServicesLoading: false,
    }));

    builder.addCase(getAvailableDays.pending, (state) => ({
      ...state,
      getDoctorWorkingDaysLoading: true,
    }));
    builder.addCase(getAvailableDays.fulfilled, (state, action) => ({
      ...state,
      doctorWorkingDayList: action.payload.map((d) => new Date(d)),
      getDoctorWorkingDaysLoading: false,
    }));
    builder.addCase(getAvailableDays.rejected, (state) => ({
      ...state,
      getDoctorWorkingDaysLoading: false,
    }));

    builder.addCase(getSlots.pending, (state) => ({
      ...state,
      getDoctorFreeSlotsLoading: true,
    }));
    builder.addCase(getSlots.fulfilled, (state, action) => ({
      ...state,
      doctorFreeSlotList: action.payload,
      getDoctorFreeSlotsLoading: false,
    }));
    builder.addCase(getSlots.rejected, (state) => ({
      ...state,
      getDoctorFreeSlotsLoading: false,
    }));
  },
});

const {
  selectHospital,
  selectDoctor,
  selectService,
  selectDay,
  selectSlot,
} = slice.actions;

export {
  getHospitals,
  selectHospital,
  getDoctors,
  selectDoctor,
  getDoctorServices,
  selectService,
  getAvailableDays,
  selectDay,
  getSlots,
  selectSlot,
};

export default slice.reducer;
