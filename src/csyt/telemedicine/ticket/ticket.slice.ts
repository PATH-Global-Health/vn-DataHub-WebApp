import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  CaseReducer,
} from '@reduxjs/toolkit';

import moment from 'moment';

import { StatusMap } from '@app/components/schedule-calendar';

import telemedicineService from '../shared/telemedicine.service';
import { Ticket, TicketFile, TicketStatus } from '../shared/telemedicine.model';

interface State {
  statusMap: StatusMap;
  from: Date;
  to: Date;
  ticketList: Ticket[];
  getTicketsLoading: boolean;
  selectedTicket?: Ticket;
  selectedTicketFileList: TicketFile[];
  getSelectedTicketFilesLoading: boolean;
}

const {
  UNFINISHED,
  FINISHED,
  CANCELED_BY_CONSUMER,
  NOT_DOING,
  CANCELED_BY_PROVIDER,
} = TicketStatus;

const initialState: State = {
  statusMap: {
    [UNFINISHED]: { color: 'blue', label: 'Chưa khám' },
    [FINISHED]: { color: 'green', label: 'Đã thực hiện' },
    [CANCELED_BY_CONSUMER]: { color: 'grey', label: 'Huỷ' },
    [NOT_DOING]: { color: 'brown', label: 'Không thực hiện' },
    [CANCELED_BY_PROVIDER]: { color: 'red', label: 'Bên nhận huỷ' },
  },
  from: moment().startOf('isoWeek').toDate(),
  to: moment().startOf('isoWeek').add(7, 'days').toDate(),
  ticketList: [],
  getTicketsLoading: false,
  selectedTicketFileList: [],
  getSelectedTicketFilesLoading: false,
};

const setFromToCR: CR<{ from: Date; to: Date }> = (state, action) => ({
  ...state,
  ...action.payload,
});

const getTickets = createAsyncThunk(
  'csyt/telemedicine/ticket/getTickets',
  async (arg: { from: Date; to: Date }) => {
    const { from, to } = arg;
    const result = await telemedicineService.getTickets(from, to);
    return result.map((e) =>
      e.Status === UNFINISHED &&
      moment(e.Schedule.Date).isBefore(moment().startOf('day'))
        ? { ...e, Status: NOT_DOING }
        : e,
    );
  },
);

type CR<T> = CaseReducer<State, PayloadAction<T>>;

const selectTicketCR: CR<Ticket['Id'] | undefined> = (state, action) => ({
  ...state,
  selectedTicket: state.ticketList.find((t) => t.Id === action.payload),
  selectedTicketFileList: [],
});

const getTicketFiles = createAsyncThunk(
  'csyt/telemedicine/ticket/getTicketFiles',
  async (ticketId: Ticket['Id']) => {
    const result = await telemedicineService.getTicketFileList(ticketId);
    return result;
  },
);

const slice = createSlice({
  name: 'csyt/telemedicine/ticket',
  initialState,
  reducers: {
    setFromTo: setFromToCR,
    selectTicket: selectTicketCR,
  },
  extraReducers: (builder) => {
    builder.addCase(getTickets.pending, (state) => ({
      ...state,
      getTicketsLoading: true,
    }));
    builder.addCase(getTickets.fulfilled, (state, action) => ({
      ...state,
      ticketList: action.payload,
      getTicketsLoading: false,
      selectedTicket: action.payload.find(
        (t) => t.Id === state.selectedTicket?.Id,
      ),
    }));
    builder.addCase(getTickets.rejected, (state) => ({
      ...state,
      getTicketsLoading: false,
    }));

    builder.addCase(getTicketFiles.pending, (state) => ({
      ...state,
      getSelectedTicketFilesLoading: true,
    }));
    builder.addCase(getTicketFiles.fulfilled, (state, action) => ({
      ...state,
      selectedTicketFileList: action.payload,
      getSelectedTicketFilesLoading: false,
    }));
    builder.addCase(getTicketFiles.rejected, (state) => ({
      ...state,
      getSelectedTicketFilesLoading: false,
    }));
  },
});

const { setFromTo, selectTicket } = slice.actions;

export { setFromTo, getTickets, selectTicket, getTicketFiles };

export default slice.reducer;
