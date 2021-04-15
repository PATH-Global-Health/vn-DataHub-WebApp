import { combineReducers } from '@reduxjs/toolkit';

import manageAccount from './manage-account/slices';
import userManagement from './user-management';

export default combineReducers({
  account: combineReducers(manageAccount),
  userManagement: combineReducers(userManagement),
});
