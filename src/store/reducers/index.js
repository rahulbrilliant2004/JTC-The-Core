import {combineReducers} from 'redux';
import {reducer as FormReducer} from 'redux-form';

import originReducer from './originReducer';
import destReducer from './destReducer';
import otherInfoReducer from './otherInfoReducer';
import allReducer from './allReducers';
import almtPenerimaReducer from './Fetch_almtPenerima';
import almtPenerimaExistingChecker from './almtPenerimaChecker';
import resetAllForms from './resetFormReducer';
import saveBaseTariff from './savedBaseTariff';

import userReducer from '../../data/user/userReducer';
import authReducer from '../../data/auth/authReducer';
import routeReducer from '../../data/routing/routeReducer';
import connoteReducer from '../../data/connote/connoteReducer';
import manifestReducer from '../../data/manifest/manifestReducer';
import bagReducer from '../../data/bag/bagReducer';
import permissionReducer from '../../data/permission/permissionReducer';
import nodeReducer from '../../data/node/nodeReducer';
import inventoryBaggingReducer from '../../data/inventoryBagging/inventoryBaggingReducer';
import notificationReducer from '../../data/notification/notificationReducer';
import globalSearchReducer from '../../data/globalSearch/globalSearchReducer';
import employeeReducer from '../../data/employee/employeeReducer';
import vehicleReducer from '../../data/vehicle/vehicleReducer';

export default combineReducers({
  auth: authReducer,
  user: userReducer,
  router: routeReducer,
  connote: connoteReducer,
  manifest: manifestReducer,
  bag: bagReducer,
  permission: permissionReducer,
  node: nodeReducer,
  inventoryBagging: inventoryBaggingReducer,
  notification: notificationReducer,
  globalSearch: globalSearchReducer,
  employee: employeeReducer,
  vehicle: vehicleReducer,
  originReducer,
  destReducer,
  otherInfoReducer,
  allReducer,
  saveBaseTariff,
  almtPenerimaChecker: almtPenerimaExistingChecker,
  almtPenerimaReducer,
  resetAllForms,
  form: FormReducer,
});
