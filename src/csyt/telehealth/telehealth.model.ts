export enum TelehealthStatus {
  UNFINISHED = 1,
  FINISHED = 2,
  CANCELED_BY_CUSTOMER = 3,
  NOT_DOING = 4,
  CANCELED = 5,
}

export interface ExitInformation {
  destination: string;
  exitingDate: string;
  entryingDate: string;
}
export interface TelehealthSchedule {
  readonly id: string;
  numId: number;
  doctor: Doctor;
  service: Room;
  interval: Interval;
  room: Room;
  date: string;
  customer: Customer;
  note: string;
  bookedByUser: string;
  status: TelehealthStatus;
  unit: Unit;
  contacts?: Contact[];
  exitInformation: ExitInformation;
}

export interface TelehealthScheduleTableVM
  extends Pick<TelehealthSchedule, 'id' | 'note' | 'bookedByUser'> {
  numId: number;
  date: string;
  time: string;
  doctorName: string;
  roomName: string;
  serviceName: string;
  customerName: string;
  customerBirthday: string;
  status: string;
}

export interface Contact {
  fullname: string;
  phone: string;
  relationship: string;
}

export interface Customer {
  id: number;
  fullname: string;
  phone: string;
  email: string;
  address: string;
  dateOfBirth: string;
  birthDate: string;
  gender: boolean;
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  ic: string;
  passportNumber?: string;
  nation?: string;
}

export interface Doctor {
  id: string;
  fullname: string;
}

export interface Instance {
  id: number;
  dateTime: string;
}

export interface Room {
  id: string;
  name: string;
}

export interface Unit {
  id: number;
  name: string;
  information: string;
  address: string;
  username: string;
}
export interface PaginationSchedule<T> {
  data: T[];
  errorMessage: string;
  succeed: boolean;
}

export interface Interval {
  id?: string;
  from: string;
  to: string;
  status: number;
  numId: number;
}
