export interface Doctor {
  Id: number;
  FullName: string;
  Image?: string;
  AcademicDegree: string;
  AcademicRank?: string;
  Address?: string;
  BirthDay?: string;
  Email?: string;
  Phone?: string;
  Specialized?: string;
  Summary?: string;
  GUID: string;
}

export interface DoctorService {
  Id: number;
  Name: string;
  Price: number;
  ServiceGroup: number;
}

export interface Slot {
  TimeId: number;
  From: string;
  Active: boolean;
}

export interface DayFreeSlot {
  Date: string;
  DateView: string;
  Morning: Slot[];
  Afternoon: Slot[];
}
