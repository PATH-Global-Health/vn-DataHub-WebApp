import { httpClient } from '@app/utils';
import { Customer } from '@csyt/catalog/customer/customer.model';

import { Hospital } from '../../catalog/hospital/hospital.model';
import { Doctor, DayFreeSlot, DoctorService, Slot } from './booking.model';

const getHospitals = async (): Promise<Hospital[]> => {
  const result = await httpClient.get({
    url: (al) => al.csyt.telemedicine.getHospitals,
  });

  return result.data as Hospital[];
};

const getDoctors = async (hospitalId: Hospital['id']): Promise<Doctor[]> => {
  const result = await httpClient.get({
    url: (al) => `${al.csyt.telemedicine.getDoctors}${hospitalId}`,
  });

  return result.data as Doctor[];
};

const getServices = async (
  doctorId: Doctor['Id'],
): Promise<DoctorService[]> => {
  const result = await httpClient.get({
    url: (al) => `${al.csyt.telemedicine.getServices}${doctorId}`,
  });

  return result.data as DoctorService[];
};

const getWorkingDays = async (
  doctorId: Doctor['Id'],
  serviceId: DoctorService['Id'],
): Promise<string[]> => {
  const result = await httpClient.get({
    url: (al) => `${al.csyt.telemedicine.getWorkingDays}`,
    params: { doctorId, serviceId },
  });

  return result.data as string[];
};

const getSlots = async (
  hospitalId: Hospital['id'],
  doctorId: Doctor['Id'],
  serviceId: DoctorService['Id'],
  date: Date,
): Promise<DayFreeSlot> => {
  const result = await httpClient.get({
    url: (al) => al.csyt.telemedicine.getSlots,
    params: {
      HospitalId: hospitalId,
      DoctorId: doctorId,
      ServiceId: serviceId,
      From: date,
      To: date,
    },
  });

  return (result.data as DayFreeSlot[])[0];
};

const register = async (
  hospitalId: Hospital['id'],
  doctorId: Doctor['Id'],
  serviceId: DoctorService['Id'],
  instanceId: Slot['TimeId'],
  customerId: Customer['id'],
  form?: object,
): Promise<{ Id: number }> => {
  const result = await httpClient.post({
    url: (al) => al.csyt.telemedicine.register,
    data: {
      CustomerId: customerId,
      DoctorId: doctorId,
      HospitalId: hospitalId,
      ServiceId: serviceId,
      InstanceId: instanceId,
      Form: form,
    },
  });

  return result.data as { Id: number };
};

const payment = async (
  ticketId: number,
  discountType: number,
  discount: number,
  paymentAmount: number,
): Promise<void> => {
  await httpClient.post({
    url: (al) => al.csyt.telemedicine.payment,
    data: {
      Id: ticketId,
      DiscountType: discountType,
      Discount: discount,
      PaymentAmount: paymentAmount,
    },
  });
};

const bookingService = {
  getHospitals,
  getDoctors,
  getServices,
  getWorkingDays,
  getSlots,
  register,
  payment,
};

export default bookingService;
