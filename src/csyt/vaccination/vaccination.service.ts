import { httpClient, apiLinks } from '@app/utils';
import moment from 'moment';
import {
  Interval,
  WorkingCalendar,
  WorkingCalendarDay,
  WorkingCalendarInterval,
} from '@csyt/working-schedule/working-schedule.model';
import { Hospital as CSYTHospital } from '@csyt/catalog/hospital/hospital.model';
import { Hospital as AdminHospital } from '@admin/manage-account/models/hospital';
import { Customer } from '@csyt/catalog/customer/customer.model';
import { Service } from '../catalog/service/service.model';
import { Doctor } from '../catalog/doctor/doctor.model';
import {
  VaccinationSchedule,
  InjectionObject,
  Ticket,
  ContactInfo,
  PaginationSchedule,
  VaccinationStatistic,
} from './vaccination.model';
import { Hospital } from '../catalog/hospital/hospital.model';

const getVaccinationSchedules = async (
  from: Date,
  to: Date,
  unitId: string,
): Promise<PaginationSchedule<VaccinationSchedule>> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.vaccination.getSchedules,
    params: {
      from: moment(from).format('YYYY-MM-DD'),
      to: moment(to).format('YYYY-MM-DD'),
      unitId,
    },
  });

  return result.data as PaginationSchedule<VaccinationSchedule>;
};

const getInjectionObjects = async (): Promise<InjectionObject[]> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.vaccination.getInjectionObjects,
  });

  return result.data as InjectionObject[];
};

const getBookingAvailableDays = async (
  hospitalId: string,
): Promise<string[]> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.vaccination.getAvailableDays(hospitalId),
  });

  return result.data as string[];
};

const getAvailableServiceIds = async (
  hospitalId: string,
  date: Date,
): Promise<string[]> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.vaccination.getAvailableServices(
      hospitalId,
      moment(date).format('YYYY-MM-DD'),
    ),
  });
  return result.data as string[];
};

const getAvailableDoctorIds = async (
  hospitalId: string,
  date: Date,
): Promise<string[]> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.vaccination.getAvailableDoctors(
      hospitalId,
      moment(date).format('YYYY-MM-DD'),
    ),
  });
  return result.data as string[];
};

const getTickets = async (
  hospitalId: string,
  date: Date,
  serviceId: Service['id'],
  doctorId?: Doctor['id'],
): Promise<Ticket[]> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.vaccination.getTicket,
    params: {
      hospitalId,
      date,
      serviceId,
      doctorId,
    },
  });

  return result.data as Ticket[];
};

const register = async (
  date: Date,
  interval: Interval,
  unit: CSYTHospital | AdminHospital,
  doctor: { id: string; fullname: string },
  room: { id: string; name: string },
  service: { id: string; name: string },
  injectionObject: { id: string; name: string },
  customer: Customer,
  contacts?: ContactInfo[],
  bookedByUser?: string,
  // _serviceId?: number,
): Promise<VaccinationSchedule> => {
  const result = await httpClient.post({
    url: apiLinks.csyt.vaccination.register,
    data: {
      date,
      interval,
      unit,
      doctor,
      room,
      service,
      customer,
      contacts,
      bookedByUser,
      injectionObject,
    },
  });

  return result.data as VaccinationSchedule;
};

const update = async (
  id: string,
  status: number,
  note?: string,
  form?: object,
): Promise<void> => {
  await httpClient.put({
    url: apiLinks.csyt.vaccination.update,
    data: {
      id,
      status,
      note,
      form,
    },
  });
};

const getTransferHospitals = async (serviceId: string): Promise<Hospital[]> => {
  const result = await httpClient.get({
    url: `${apiLinks.csyt.vaccination.getTransferHospitals}/${serviceId}`,
  });

  return result.data as Hospital[];
};

const getVaccinationServices = async (
  serviceTypeId: string,
  injectionObjectId: string,
): Promise<Service[]> => {
  const response = await httpClient.get({
    url: apiLinks.csyt.service.get,
    params: {
      serviceFormId: 'd2e89a14-b17c-4d86-d598-08d889ed7ae2', // dơ vl hic
      serviceTypeId,
      injectionObjectId,
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as Service[];
};

const getAvailableWorkingCalendar = async (
  serviceId: string,
  unitId: string,
): Promise<WorkingCalendar[]> => {
  const response = await httpClient.get({
    url: apiLinks.csyt.workingCalendar.getAvailableWorkingCalendar,
    params: {
      serviceId,
      unitId,
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as WorkingCalendar[];
};

const getAvailableReceptionDays = async (
  serviceId: string,
  unitId: string,
): Promise<WorkingCalendarDay[]> => {
  const result = await httpClient.get({
    url: `${apiLinks.csyt.workingCalendar.getDaysByUnitAndService}`,
    params: {
      serviceId,
      unitId,
    },
  });
  return result.data as WorkingCalendarDay[];
};

const getAvailableReceptionIntervals = async (
  dayId: string,
): Promise<WorkingCalendarInterval[]> => {
  const result = await httpClient.get({
    url: `${apiLinks.csyt.workingCalendar.getIntervals}/${dayId}`,
  });
  return result.data as WorkingCalendarInterval[];
};

const getAvailableDateForExport = async (unitId: string): Promise<Date[]> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.vaccination.getAvailableDateForExport,
    params: { unitId },
  });
  return result.data as Date[];
};

const exportExamReport = async (
  unitId: string,
  fromTime: Date,
  toTime: Date,
): Promise<void> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.vaccination.exportVaccReport,
    responseType: 'blob',
    params: {
      unitId,
      fromTime: moment(fromTime).format('YYYY-MM-DD'),
      toTime: moment(toTime).format('YYYY-MM-DD'),
    },
  });
  const url = window.URL.createObjectURL(new Blob([result.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    `report-${moment(fromTime).format('DD-MM')}|${moment(toTime).format(
      'DD-MM',
    )}.xlsx`,
  );
  document.body.appendChild(link);
  link.click();
};

const getVaccinationStatistic = async (
  from: Date,
  to: Date,
  unitId: string,
): Promise<VaccinationStatistic> => {
  const result = await httpClient.get({
    url: apiLinks.csyt.vaccination.getStatistic,
    params: {
      from: moment(from).format('YYYY-MM-DD'),
      to: moment(to).format('YYYY-MM-DD'),
      unitId,
    },
  });

  return result.data as VaccinationStatistic;
};

const vaccinationService = {
  getVaccinationSchedules,
  getInjectionObjects,
  getBookingAvailableDays,
  getAvailableServiceIds,
  getAvailableDoctorIds,
  getTickets,
  register,
  update,
  getTransferHospitals,
  getVaccinationServices,
  getAvailableWorkingCalendar,
  getAvailableReceptionDays,
  getAvailableReceptionIntervals,
  getAvailableDateForExport,
  exportExamReport,
  getVaccinationStatistic,
};

export default vaccinationService;
