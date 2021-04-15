export enum TicketStatus {
  UNFINISHED = 1,
  FINISHED = 2,
  CANCELED_BY_CONSUMER = 3,
  NOT_DOING = 4,
  CANCELED_BY_PROVIDER = 5,
}

export interface Ticket {
  Id: number;
  Name: string;
  Doctor: { Id: number; Name: string };
  Service: { Id: number; Name: string };
  Schedule: { Id: number; Date: string; Time: string };
  Provider: { Id: number; Name: string };
  Customer: {
    Id: number;
    FullName: string;
    Address: null | string;
    dateOfBirth: string;
  };
  Form?: { symptom?: string; diagnosis?: string; description?: string };
  Note?: string;
  BookedBy?: { Id: number; Name: string; From: string };
  Status: number;
  MedicalRecord?: object;
  Prescription?: Prescription[];
  Price?: number;
  Discount?: number;
  DiscountType?: number;
  PaymentAmount?: number;
  IsPaid?: boolean;
}

export interface Prescription {
  index: number;
  code: string;
  name: string;
  quantity: number;
  days: number;
}

export interface TicketFile {
  Id: number;
  Name: string;
  Type: number;
}
