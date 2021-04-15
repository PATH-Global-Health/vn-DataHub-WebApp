// const baseUrl = 'https://smapi.vkhealth.vn';
const apigw = 'https://apigw.vkhealth.vn';
const csytUrl = 'https://api.vkhealth.vn';
const userGateway = 'http://202.78.227.202:31753/api';

const userManagementUrl = 'https://auth.vkhealth.vn';
const csytGateway = 'https://smapi.vkhealth.vn/api';
const examinationUrl = 'https://booking.vkhealth.vn';

const telehealthBookingUrl = 'http://202.78.227.99:32068';
const pqmUrl = 'http://202.78.227.175:31291';
const testingUrl = 'http://202.78.227.175:31291'

const apiLinks = {
  auth: {
    token: `${userGateway}/Users/Login`,
    userInfo: `${csytGateway}/Hospitals/infomation`,
    updateInfo: `${csytGateway}/Hospitals/infomation`,
    updateLogo: `${csytGateway}/Hospitals/Logo`,
  },
  manageAccount: {
    unitTypes: `${csytGateway}/UnitTypes/`,
    hospitals: `${csytGateway}/Hospitals/`,
  },
  admin: {
    userManagement: {
      user: {
        get: `${userManagementUrl}/api/Users`,
        create: `${userManagementUrl}/api/Users`,
        resetPassword: `${userManagementUrl}/api/Users/Tools/ResetDefaultPassword`,
        getGroups: `${userManagementUrl}/api/Users/Groups`,
        getRoles: `${userManagementUrl}/api/Users/Roles`,
        getPermissionsUI: `${userManagementUrl}/api/Users/Permissions/Ui`,
        getPermissionsResource: `${userManagementUrl}/api/Users/Permissions/Resource`,
      },
      group: {
        get: `${userManagementUrl}/api/Groups`,
        create: `${userManagementUrl}/api/Groups`,
        update: `${userManagementUrl}/api/Groups`,
        delete: `${userManagementUrl}/api/Groups`,
        getUsers: `${userManagementUrl}/api/Groups`,
        getRoles: `${userManagementUrl}/api/Groups`,
        getPermissionsUI: `${userManagementUrl}/api/Groups`,
        getPermissionsResource: `${userManagementUrl}/api/Groups`,
        addUser: `${userManagementUrl}/api/Groups`,
        removeUser: `${userManagementUrl}/api/Groups`,
        addRoles: `${userManagementUrl}/api/Groups`,
        removeRole: `${userManagementUrl}/api/Groups`,
        addPermissionsUI: `${userManagementUrl}/api/Groups`,
        addPermissionsResource: `${userManagementUrl}/api/Groups`,
      },
      role: {
        get: `${userManagementUrl}/api/Roles`,
        create: `${userManagementUrl}/api/Roles`,
        update: `${userManagementUrl}/api/Roles`,
        delete: `${userManagementUrl}/api/Roles`,
        addUser: `${userManagementUrl}/api/Roles`,
        removeUser: `${userManagementUrl}/api/Roles`,
        addPermissionsUI: `${userManagementUrl}/api/Roles`,
        addPermissionsResource: `${userManagementUrl}/api/Roles`,
        getUsers: `${userManagementUrl}/api/Roles`,
        getPermissionsUI: `${userManagementUrl}/api/Roles`,
        getPermissionsResource: `${userManagementUrl}/api/Roles`,
      },
      permission: {
        get: `${userManagementUrl}/api/Permissions`,
        create: `${userManagementUrl}/api/Permissions`,
        update: `${userManagementUrl}/api/Permissions`,
        delete: `${userManagementUrl}/api/Permissions`,
        addUser: `${userManagementUrl}/api/Permissions`,
      },
    },
  },
  csyt: {
    doctor: {
      get: `${csytGateway}/Doctors`,
      create: `${csytGateway}/Doctors`,
      update: `${csytGateway}/Doctors`,
      delete: `${csytGateway}/Doctors/`,
    },
    room: {
      get: `${csytGateway}/Rooms`,
      create: `${csytGateway}/Rooms`,
      update: `${csytGateway}/Rooms`,
      delete: `${csytGateway}/Rooms/`,
    },
    service: {
      get: `${csytGateway}/Services`,
      create: `${csytGateway}/Services`,
      update: `${csytGateway}/Services`,
      delete: `${csytGateway}/Services`,
      getServicesByServiceFormAndServiceType: `${csytGateway}/Services/ServiceFormAndServiceType`,
    },
    serviceForm: {
      get: `${csytGateway}/ServiceForms`,
      create: `${csytGateway}/ServiceForms`,
      update: `${csytGateway}/ServiceForms`,
      delete: `${csytGateway}/ServiceForms`,
    },
    serviceUnit: {
      get: `${csytGateway}/ServiceUnits`,
      create: `${csytGateway}/ServiceUnits`,
      update: `${csytGateway}/ServiceUnits`,
      delete: `${csytGateway}/ServiceUnits/`,
    },
    unitDoctor: {
      get: `${csytGateway}/UnitDoctors`,
      create: `${csytGateway}/UnitDoctors`,
      update: `${csytGateway}/UnitDoctors`,
      delete: `${csytGateway}/UnitDoctors/`,
    },
    injectionObject: {
      get: `${csytGateway}/InjectionObjects`,
      create: `${csytGateway}/InjectionObjects`,
      update: `${csytGateway}/InjectionObjects`,
      delete: `${csytGateway}/InjectionObjects/`,
    },
    unitType: {
      get: `${csytGateway}/UnitTypes`,
      create: `${csytGateway}/UnitTypes`,
      update: `${csytGateway}/UnitTypes`,
      delete: `${csytGateway}/UnitTypes/`,
    },
    hospital: {
      get: `${csytGateway}/Hospitals`,
      getLogo: `${csytGateway}/Hospitals/Logo`,
      create: `${csytGateway}/Hospitals`,
      update: `${csytGateway}/Hospitals`,
      delete: `${csytGateway}/Hospitals/`,
    },
    catalog: {
      customer: {
        get: `${csytUrl}/api/BkCustomer/Get/`,
        getDetails: `${csytUrl}/api/BkCustomer/GetById/`,
        create: `${csytUrl}/api/BkCustomer/Create`,
      },
      profile: {
        get: `${csytGateway}/Profiles/Filter`,
        getDetails: `${csytGateway}/Profiles/`,
        create: `${csytGateway}/Profiles/`,
      },
    },
    serviceType: {
      get: `${csytGateway}/ServiceTypes/`,
      create: `${csytGateway}/ServiceTypes/`,
      update: `${csytGateway}/ServiceTypes/`,
      delete: `${csytGateway}/ServiceTypes/`,
    },
    workingSchedule: {
      getGroupNameList: `${csytUrl}/api/ScheduleGroup/GetGroups/`,
      getScheduleGroupList: `${csytUrl}/api/ScheduleGroup/Get/`,
      getScheduleDayList: `${csytUrl}/api/Schedule/Get`,
      getScheduleInstanceList: `${csytUrl}/api/ScheduleInstance/Get`,
      createScheduleGroup: `${csytUrl}/api/ScheduleGroup/Create`,
      publishScheduleGroup: `${csytUrl}/api/ScheduleGroup/Publish/`,
      unPublishScheduleGroup: `${csytUrl}/api/ScheduleGroup/UnPublish/`,
      publishScheduleDay: `${csytUrl}/api/Schedule/Publish/`,
      unPublishScheduleDay: `${csytUrl}/api/Schedule/UnPublish/`,
      openScheduleInstances: `${csytUrl}/api/ScheduleInstance/Open/`,
      closeScheduleInstances: `${csytUrl}/api/ScheduleInstance/Close/`,
    },
    workingCalendar: {
      get: `${csytGateway}/WorkingCalendars/GetByUnit`,
      create: `${csytGateway}/WorkingCalendars`,
      delete: `${csytGateway}/WorkingCalendars/`,
      publish: `${csytGateway}/WorkingCalendars/Publish`,
      cancel: `${csytGateway}/WorkingCalendars/Cancel`,
      getDays: `${csytGateway}/WorkingCalendars/GetDays`,
      publishDays: `${csytGateway}/WorkingCalendars/Publish/Day`,
      cancelDays: `${csytGateway}/WorkingCalendars/Cancel/Day`,
      getIntervals: `${csytGateway}/WorkingCalendars/GetIntervals`,
      publishIntervals: `${csytGateway}/WorkingCalendars/Publish/Interval`,
      cancelIntervals: `${csytGateway}/WorkingCalendars/Cancel/Interval`,
      getAvailableWorkingCalendar: `${csytGateway}/WorkingCalendars/GetFullDaysByUnitAndService`,
      getDaysByUnitAndService: `${csytGateway}/WorkingCalendars/GetDaysByUnitAndService`,
      checkSchedule: `${csytGateway}/WorkingCalendars/CheckScheduledDoctor`,
    },
    vaccination: {
      getSchedules: `${examinationUrl}/api/Vaccinations`,
      getStatistic: `${examinationUrl}/api/Vaccinations/Statistic`,
      getInjectionObjects: `${csytGateway}/InjectionObjects`,
      getAvailableDays: (hospitalId: string): string =>
        `${apigw}/api/Hospitals/${hospitalId}/Days?form=5`,
      getAvailableServices: (hospitalId: string, date: string): string =>
        `${apigw}/api/Hospitals/${hospitalId}/Services?form=5&date=${date}`,
      getAvailableDoctors: (hospitalId: string, date: string): string =>
        `${apigw}/api/Hospitals/${hospitalId}/Doctors?form=5&date=${date}`,
      getTicket: `${apigw}/api/Tickets`,
      register: `${examinationUrl}/api/Vaccinations`,
      update: `${examinationUrl}/api/Vaccinations`,
      getTransferHospitals: `${csytUrl}/api/BkHospital/GetByHealthCareId`,
      getAvailableDateForExport: `${examinationUrl}/api/Excels/AvailableDatesForVaccReport`,
      exportVaccReport: `${examinationUrl}/api/Excels/VaccReport`,
    },
    examination: {
      register: `${examinationUrl}/api/Examinations`,
      getSchedules: `${examinationUrl}/api/Examinations`,
      getStatistic: `${examinationUrl}/api/Examinations/Statistic`,
      updateSchedule: `${examinationUrl}/api/Examinations`,
      getAvailableDateForExport: `${examinationUrl}/api/Excels/AvailableDatesForExamReport`,
      exportExamReport: `${examinationUrl}/api/Excels/ExamReport`,
      getAvailableDays: (hospitalId: string): string =>
        `${apigw}/api/Hospitals/${hospitalId}/Days?form=5`,
      getAvailableDoctors: (hospitalId: string, date: string): string =>
        `${apigw}/api/Hospitals/${hospitalId}/Doctors?form=5&date=${date}`,
      createResultForm: `${examinationUrl}/api/Examinations/CreateResultForm`,
      updateResultForm: `${examinationUrl}/api/Examinations/UpdateResultForm`,
    },
    telehealth: {
      register: `${telehealthBookingUrl}/api/Telehealths`,
      getSchedules: `${telehealthBookingUrl}/api/Telehealths`,
      updateSchedule: `${telehealthBookingUrl}/api/Telehealths`,
    },
    telemedicine: {
      getHospitals: `${csytUrl}/api/BkHospital/GetByForm?Form=3`,
      getDoctors: `${csytUrl}/api/BkHospital/GetDoctorByForm?Form=3&Id=`,
      getServices: `${csytUrl}/api/BkDoctor/GetServicesByDoctor?Form=3&DoctorId=`,
      getWorkingDays: `${csytUrl}/api/Telemedicine/GetWorkingDays`,
      getSlots: `${csytUrl}/api/BkHealthCareScheduler/GetByDoctor`,
      register: `${csytUrl}/api/Telemedicine/Register`,
      payment: `${csytUrl}/api/Telemedicine/Payment`,
      postFiles: `${csytUrl}/api/Telemedicine/PostFile/`,
      getTickets: `${csytUrl}/api/Telemedicine/GetTickets`,
      getSchedule: `${csytUrl}/api/Telemedicine/GetSchedules`,
      getFileList: `${csytUrl}/api/Telemedicine/GetFiles/`,
      update: `${csytUrl}/api/Telemedicine/Update/`,
      downloadFile: `${csytUrl}/api/Telemedicine/GetFile/`,
    },

  },
  pqm: {
    category: {
      ageGroup: {
        get: `${pqmUrl}/api/v1/pqm/AgeGroups/`,
        create: `${pqmUrl}/api/v1/pqm/AgeGroups/`,
        update: `${pqmUrl}/api/v1/pqm/AgeGroups/`,
        delete: `${pqmUrl}/api/v1/pqm/AgeGroups/`,
      },
      keyPopulation: {
        get: `${pqmUrl}/api/v1/pqm/KeyPopulations/`,
        create: `${pqmUrl}/api/v1/pqm/KeyPopulations/`,
        update: `${pqmUrl}/api/v1/pqm/KeyPopulations/`,
        delete: `${pqmUrl}/api/v1/pqm/KeyPopulations/`,
      },
      province: {
        get: `${pqmUrl}/api/v1/pqm/Locations/Provinces/`,
        create: `${pqmUrl}/api/v1/pqm/Locations/Provinces/`,
        update: `${pqmUrl}/api/v1/pqm/Locations/Provinces/`,
        delete: `${pqmUrl}/api/v1/pqm/Locations/Provinces/`,
      },
      district: {
        get: (code: string): string => `${pqmUrl}/api/v1/pqm/Locations/Districts${code ? `?provinceCode=${code}` : ''}`,
        create: `${pqmUrl}/api/v1/pqm/Locations/Districts/`,
        update: `${pqmUrl}/api/v1/pqm/Locations/Districts/`,
        delete: `${pqmUrl}/api/v1/pqm/Locations/Districts/`,
      },
      site: {
        get: (id: string): string => `${pqmUrl}/api/v1/pqm/Locations/Sites${id ? `?districtId=${id}` : ''}`,
        create: `${pqmUrl}/api/v1/pqm/Locations/Sites/`,
        update: `${pqmUrl}/api/v1/pqm/Locations/Sites/`,
        delete: `${pqmUrl}/api/v1/pqm/Locations/Sites/`,
      },
    },
    patient: {
      testing: {
        get: `${testingUrl}/api/v1/pqm-datahub/TestPatients`,
        create: `${testingUrl}/api/v1/pqm-datahub/TestPatients`,
        update: `${testingUrl}/api/v1/pqm-datahub/TestPatients`,
        delete: (id: string): string => `${testingUrl}/api/v1/pqm-datahub/TestPatients`,
        import: `${testingUrl}/api/v1/pqm-datahub/TestPatients/ImportTestPatient`,
      },
    },
  },
};

export default apiLinks;
