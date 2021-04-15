import { combineReducers } from '@reduxjs/toolkit';

import catalog from './catalog/reducers';
import telemedicine from './telemedicine/reducers';
import workingSchedule from './working-schedule/working-schedule.slice';
import vaccination from './vaccination/vaccination.slice';
import examination from './examination/examination.slice';
import telehealth from './telehealth/telehealth.slice';

export default combineReducers({
  catalog: combineReducers(catalog),
  telemedicine: combineReducers(telemedicine),
  workingSchedule,
  vaccination,
  examination,
  telehealth,
});
