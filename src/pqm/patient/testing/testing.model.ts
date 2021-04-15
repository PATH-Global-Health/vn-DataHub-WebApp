export interface Testing {
  id: string;
  patientCode: string;
  gender: string;
  verifiedResult: string;
  verifiedTestDate: string;
  quickResult: string;
  hivTreatmentCode: string;
  arvRegisterTreatmentDate: string;
  registeredTreatmentUnit: string;
  arvTransferTreatmentDate: string;
  isVerified: boolean;
  site: string;
  keyPopulation: string;
  yearOrBirth: number;
}

export type TestingCM = Omit<Testing, 'id'>;

/* export interface TestingCM extends Omit<Testing, 'id'> {
  fieldPlus: string ;
}
 */

export type TestingUM = Testing;

export type TestingDM = Pick<Testing, 'id'>;
export const keyPopulation: {
  [key: string]: string;
} = {
  nghien_ma_tuy: 'Nghiện chích ma túy',
  nu_ban_dam: 'Người bán dâm',
  nu_mang_thai: 'Phụ nữ mang thai',
  nguoi_hien_mau: ' Người hiến máu',
};
