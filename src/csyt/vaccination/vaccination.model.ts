import { Customer } from '@csyt/catalog/customer/customer.model';

export interface PaginationSchedule<T> {
  data: T[];
  errorMessage: string;
  succeed: boolean;
}
export interface InjectionObject {
  readonly id: string;
  name: string;
  // Description?: string;
  fromDaysOld?: number;
  toDaysOld?: number;
}

export enum VaccinationStatus {
  UNFINISHED = 1,
  FINISHED = 2,
  CANCELED_BY_CUSTOMER = 3,
  NOT_DOING = 4,
  CANCELED = 5,
  TRANSFERRED = 6,
}

export interface VaccinationSchedule {
  readonly id: string;
  numId: number;
  doctor: { id: string; fullname: string };
  service: { id: string; name: string };
  room: { id: string; name: string };
  injectionObject: { id: string; name: string };
  date: string;
  interval: Interval;
  customer: Customer;
  note: string;
  bookedByUser: string;
  status: VaccinationStatus;
  unit: Unit;
  contacts?: ContactInfo[];
  // schedule: Schedule;
}

export interface VaccinationScheduleTableVM
  extends Pick<VaccinationSchedule, 'id' | 'note' | 'bookedByUser' | 'status'> {
  numId: number;
  customerName: string;
  customerBirthday: string;
  injectionObjectName: string;
  serviceName: string;
  doctorName: string;
  roomName: string;
  date: string;
  time: string;
}

export interface ContactInfo {
  fullname: string;
  phone: string;
  relationship: string;
}

export interface Schedule {
  readonly id: number;
  date: Date;
  time: string;
}

export interface Ticket {
  id: number;
  time: string;
}

export interface Unit {
  id: string;
  name: string;
  information: string;
  address: string;
  username: string;
}

export interface Interval {
  id?: string;
  from: string;
  to: string;
  status: number;
  numId: number;
}
export interface VaccinationStatistic {
  total: number;
  unfinished: number;
  finished: number;
  canceleD_BY_CUSTOMER: number;
  noT_DOING: number;
  canceled: number;
  resulted: number;
}
