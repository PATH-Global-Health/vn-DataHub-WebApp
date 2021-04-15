import httpClient from '@app/utils/http-client';
import apiLinks from '@app/utils/api-links';

import { Doctor, DoctorCM } from './doctor.model';

const getDoctors = async (): Promise<Doctor[]> => {
  const response = await httpClient.get({
    url: apiLinks.csyt.doctor.get,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data as Doctor[];
};

const createDoctor = async (data: DoctorCM): Promise<void> => {
  await httpClient.post({
    url: apiLinks.csyt.doctor.create,
    data,
  });
};

const updateDoctor = async (data: Doctor): Promise<void> => {
  await httpClient.put({
    url: apiLinks.csyt.doctor.update,
    data,
  });
};

const deleteDoctor = async (id: string): Promise<void> => {
  await httpClient.delete({
    url: apiLinks.csyt.doctor.delete + id,
  });
};

const doctorService = {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};

export default doctorService;
