import { httpClient, apiLinks } from '@app/utils';

import { Hospital, HospitalCM } from '../models/hospital';

const getHospitals = async (): Promise<Hospital[]> => {
  try {
    const result = await httpClient.get({
      url: apiLinks.manageAccount.hospitals,
    });
    return result.data as Hospital[];
  } catch (error) {
    return [];
  }
};

type CreateError<T> = {
  [P in keyof T]?: string[];
};

const createHospital = async (
  data: HospitalCM,
): Promise<CreateError<HospitalCM>> => {
  try {
    await httpClient.post({
      url: apiLinks.manageAccount.hospitals,
      data,
    });
    return {};
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return error.response.data.errors as CreateError<HospitalCM>;
  }
};

const updateHospital = async (data: Hospital): Promise<void> => {
  try {
    await httpClient.put({
      url: apiLinks.manageAccount.hospitals,
      data,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteHospital = async (id: string): Promise<void> => {
  try {
    await httpClient.delete({
      url: apiLinks.manageAccount.hospitals,
      params: { id },
    });
  } catch (error) {
    console.log(error);
  }
};

const updateLogo = async (data: FormData): Promise<void> => {
  try {
    await httpClient.put({
      url: apiLinks.auth.updateLogo,
      contentType: 'application/x-www-form-urlencoded',
      data,
    });
  } catch (error) {
    console.log(error);
  }
};

const hospitalService = {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
  updateLogo,
};

export default hospitalService;
