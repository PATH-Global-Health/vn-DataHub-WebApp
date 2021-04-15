import { PermissionType } from './constants';

const permissionTypeList = [
  { value: PermissionType.ALLOW, text: 'Cho phép' },
  { value: PermissionType.DENY, text: 'Từ chối' },
];

const methodList = [
  { value: 'GET', text: 'GET', color: 'blue' },
  { value: 'POST', text: 'POST', color: 'green' },
  { value: 'PUT', text: 'PUT', color: 'yellow' },
  { value: 'DELETE', text: 'DELETE', color: 'red' },
];

export { permissionTypeList, methodList };
