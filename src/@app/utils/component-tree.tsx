import React, { ReactNode } from 'react';

import HospitalsPage from '@admin/manage-account/pages/HospitalsPage';
import UnitTypesPage from '@admin/manage-account/pages/UnitTypesPage';

import UserPage from '@admin/user-management/user';
import GroupPage from '@admin/user-management/group';
import RolePage from '@admin/user-management/role';
// import PermissionPage from '@admin/user-management/permission';

import DoctorsPage from '@csyt/catalog/doctor';
import RoomsPage from '@csyt/catalog/room';
import ServicesPage from '@csyt/catalog/service';
import ServiceTypesPage from '@csyt/catalog/service-type';
import WorkingSchedulePage from '@csyt/working-schedule';
import VaccinationPage from '@csyt/vaccination';
import ExaminationPage from '@csyt/examination';
import TelemedicineBookingPage from '@csyt/telemedicine/booking';
import TelemedicineSchedulePage from '@csyt/telemedicine/schedule';
import TelemedicineTicketPage from '@csyt/telemedicine/ticket';
import ProfilePage from '@app/pages/ProfilePage';
import ServiceFormsPage from '@csyt/catalog/service-form';
import InjectionObjectsPage from '@csyt/catalog/injection-object';
import VaccinationStatisticPage from '@csyt/vaccination/components/statistic';
import ExaminationStatisticPage from '@csyt/examination/components/statistic';
import TelehealthPage from '@csyt/telehealth';
import TestingPatientPage from '@pqm/patient/testing';

export enum GroupKey {
  // #region admin
  ADMIN_ACCOUNT = 'ADMIN_ACCOUNT',
  ADMIN_USER_MANAGEMENT = 'ADMIN_USER_MANAGEMENT',
  // #endregion

  // #region csyt
  CSYT_CATALOG = 'CSYT_CATALOG',
  CSYT_WORKING_SCHEDULE = 'CSYT_WORKING_SCHEDULE',
  CSYT_VACCINATION = 'CSYT_VACCINATION',
  CSYT_EXAMINATION = 'CSYT_EXAMINATION',
  CSYT_TELEHEALTH = 'CSYT_TELEHEALTH',
  CSYT_TELEMEDICINE = 'CSYT_TELEMEDICINE',
  CSYT_VACCINATION_STATISTIC = 'CSYT_VACCINATION_STATISTIC',
  CSYT_EXAMINATION_STATISTIC = 'CSYT_EXAMINATION_STATISTIC',
  PQM_PATIENT = 'PQM_PATIENT',
  // #endregion
}

export enum ComponentKey {
  // #region admin
  ADMIN_UNIT_TYPES = 'ADMIN_UNIT_TYPES',
  ADMIN_HOSPITALS = 'ADMIN_HOSPITALS',

  ADMIN_USER = 'ADMIN_USER',
  ADMIN_GROUP = 'ADMIN_GROUP',
  ADMIN_ROLE = 'ADMIN_ROLE',
  // ADMIN_PERMISSION = 'ADMIN_PERMISSION',
  // #endregion

  // #region csyt
  CSYT_DOCTOR = 'CSYT_DOCTOR',
  CSYT_ROOM = 'CSYT_ROOM',
  CSYT_SERVICE = 'CSYT_SERVICE',
  CSYT_SERVICE_TYPE = 'CSYT_SERVICE_TYPE',
  CSYT_SERVICE_FORM = 'CSYT_SERVICE_FORM',
  CSYT_SERVICE_UNIT = 'CSYT_SERVICE_UNIT',
  CSYT_UNIT_DOCTOR = 'CSYT_UNIT_DOCTOR',
  CSYT_INJECTION_OBJECT = 'CSYT_INJECTION_OBJECT',
  CSYT_UNIT_TYPE = 'CSYT_UNIT_TYPE',

  CSYT_TELEMEDICINE_BOOKING = 'CSYT_TELEMEDICINE_BOOKING',
  CSYT_TELEMEDICINE_TICKET = 'CSYT_TELEMEDICINE_TICKET',
  CSYT_TELEMEDICINE_SCHEDULE = 'CSYT_TELEMEDICINE_SCHEDULE',
  // #endregion
  PROFILE = 'PROFILE',
}

interface Component {
  key: GroupKey | ComponentKey;
  title: string;
  component?: ReactNode;
  childrenList?: Component[];
  permissionCode?: string;
}

const componentTree: Component[] = [
  {
    key: GroupKey.ADMIN_ACCOUNT,
    title: 'Tài khoản',
    permissionCode: 'ALL',
    childrenList: [
      // {
      //   key: ComponentKey.ADMIN_UNIT_TYPES,
      //   title: 'Loại hình đơn vị',
      //   component: <UnitTypesPage />,
      //   permissionCode: 'ADMIN',
      // },
      {
        key: ComponentKey.ADMIN_HOSPITALS,
        title: 'Tài khoản đơn vị',
        component: <HospitalsPage />,
        // permissionCode: 'admin',
      },
      {
        key: ComponentKey.PROFILE,
        title: 'Thông tin tài khoản',
        component: <ProfilePage />,
      },
    ],
  },
  {
    key: GroupKey.ADMIN_USER_MANAGEMENT,
    title: 'Quản lý người dùng',
    permissionCode: 'ADMIN',
    childrenList: [
      {
        key: ComponentKey.ADMIN_GROUP,
        title: 'Group',
        component: <GroupPage />,
      },
      {
        key: ComponentKey.ADMIN_ROLE,
        title: 'Role',
        component: <RolePage />,
      },
      {
        key: ComponentKey.ADMIN_USER,
        title: 'User',
        component: <UserPage />,
      },
      // {
      //   key: ComponentKey.ADMIN_PERMISSION,
      //   title: 'Permission',
      //   component: <PermissionPage />,
      // },
    ],
  },
  /*  {
     key: GroupKey.CSYT_CATALOG,
     title: 'Danh mục',
     permissionCode: 'CSYT_CATALOG',
     childrenList: [
       {
         key: ComponentKey.CSYT_DOCTOR,
         title: 'Cán bộ',
         component: <DoctorsPage />,
       },
       {
         key: ComponentKey.CSYT_ROOM,
         title: 'Phòng/Buồng',
         component: <RoomsPage />,
       },
       {
         key: ComponentKey.CSYT_SERVICE_FORM,
         title: 'Loại dịch vụ',
         component: <ServiceFormsPage />,
         permissionCode: 'ADMIN',
       },
       {
         key: ComponentKey.CSYT_SERVICE_TYPE,
         title: 'Loại hình dịch vụ',
         component: <ServiceTypesPage />,
         permissionCode: 'ADMIN',
       },
       {
         key: ComponentKey.CSYT_INJECTION_OBJECT,
         title: 'Đối tượng',
         component: <InjectionObjectsPage />,
         permissionCode: 'ADMIN',
       },
       {
         key: ComponentKey.CSYT_SERVICE,
         title: 'Dịch vụ',
         component: <ServicesPage />,
         permissionCode: 'ADMIN',
       },
       {
         key: ComponentKey.CSYT_UNIT_TYPE,
         title: 'Loại hình đơn vị',
         component: <UnitTypesPage />,
         permissionCode: 'ADMIN',
       },
     ],
   },
   {
     key: GroupKey.CSYT_WORKING_SCHEDULE,
     title: 'Lịch làm việc',
     permissionCode: 'CSYT_WORKING_SCHEDULE',
     component: <WorkingSchedulePage />,
   },
   {
     key: GroupKey.CSYT_TELEMEDICINE,
     title: 'Telemedicine',
     permissionCode: 'CSYT_TELEMEDICINE',
     childrenList: [
       {
         key: ComponentKey.CSYT_TELEMEDICINE_BOOKING,
         title: 'Đặt lịch',
         component: <TelemedicineBookingPage />,
       },
       {
         key: ComponentKey.CSYT_TELEMEDICINE_SCHEDULE,
         title: 'Lịch nhận hẹn',
         component: <TelemedicineSchedulePage />,
       },
       {
         key: ComponentKey.CSYT_TELEMEDICINE_TICKET,
         title: 'Lịch hẹn',
         component: <TelemedicineTicketPage />,
       },
     ],
   },
   {
     key: GroupKey.CSYT_VACCINATION,
     title: 'Lịch hẹn tiêm chủng',
     permissionCode: 'CSYT_VACCINATION',
     component: <VaccinationPage />,
   },
   {
     key: GroupKey.CSYT_EXAMINATION,
     title: 'Lịch hẹn xét nghiệm',
     permissionCode: 'CSYT_EXAMINATION',
     component: <ExaminationPage />,
   },
   {
     key: GroupKey.CSYT_TELEHEALTH,
     title: 'Lịch hẹn tư vấn sức khỏe từ xa',
     permissionCode: 'CSYT_TELEHEALTH',
     component: <TelehealthPage />,
   },
   {
     key: GroupKey.CSYT_VACCINATION_STATISTIC,
     title: 'Thống kê',
     permissionCode: 'CSYT_VACCINATION',
     component: <VaccinationStatisticPage />,
   },
   {
     key: GroupKey.CSYT_EXAMINATION_STATISTIC,
     title: 'Thống kê',
     permissionCode: 'CSYT_EXAMINATION',
     component: <ExaminationStatisticPage />,
   }, */
  {
    key: GroupKey.PQM_PATIENT,
    permissionCode: 'CSYT_EXAMINATION',
    title: 'Testing Patient',
    component: <TestingPatientPage />,
  },
];

const getGroup = (groupKey: string): Component | null => {
  const group = componentTree.find((g) => g.key === groupKey);
  return group ?? null;
};

const getComponent = (groupKey: string, key: string): Component | null => {
  const group = componentTree.find((g) => g.key === groupKey);
  if (group) {
    if (!group.childrenList) {
      return group;
    }
    const childComponent = group.childrenList.find((c) => c.key === key);
    return childComponent ?? null;
  }
  return null;
};

export default componentTree;
export { getGroup, getComponent };
