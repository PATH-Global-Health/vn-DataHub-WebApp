import { combineReducers } from '@reduxjs/toolkit';

import patient from '@pqm/patient/reducers';

export default combineReducers({
  patient: combineReducers(patient),
  // NOTE: add other modules here
});
