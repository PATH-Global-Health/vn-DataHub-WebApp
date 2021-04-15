export interface Hospital {
  id: string;
  name: string;
  unitTypeId: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  website: string;
  phone: string;
  email: string;
  introduction: string;
  logo: string;
  username: string;
}

export interface HospitalCM extends Omit<Hospital, 'id'> {
  username: string;
  password: string;
}

export type HospitalUM = Required<Hospital>;
