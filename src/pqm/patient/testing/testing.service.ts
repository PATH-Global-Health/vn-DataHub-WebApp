import { httpClient, apiLinks } from '@app/utils';

import {
  Testing,
  TestingCM,
  TestingUM,
  TestingDM,
} from './testing.model';

const getTestingPatient = async ({
  pageSize = 0,
  pageIndex = 10,
}: {
  pageSize?: number;
  pageIndex?: number;
}): Promise<Testing[]> => {
  const response = await httpClient.get({
    url: apiLinks.pqm.patient.testing.get,
    params: {
      pageIndex: 1,
      pageSize: 1000,
    }
  });
  console.log(response.data);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data.data as Testing[];
};

const createTestingPatient = async (data: TestingCM): Promise<void> => {
  await httpClient.post({
    url: apiLinks.pqm.patient.testing.create,
    data,
  });
};
const updateTestingPatient = async (data: TestingUM): Promise<void> => {
  await httpClient.put({
    url: apiLinks.pqm.patient.testing.update,
    data,
  });
};

const deleteTestingPatient = async (id: string): Promise<void> => {
  await httpClient.delete({
    url: apiLinks.pqm.patient.testing.delete(id),
  });
};
const uploadTestingPatient = async (data: any): Promise<void> => {
  await httpClient.post({
    url: apiLinks.pqm.patient.testing.import,
    data,
  });
};

const testingService = {
  getTestingPatient,
  createTestingPatient,
  updateTestingPatient,
  deleteTestingPatient,
  uploadTestingPatient,
};

export default testingService;
