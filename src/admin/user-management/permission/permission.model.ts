export interface Permission {
  id: string;
  name: string;
  code: string;
  description: string;
  url: string;
  normalizedUrl: string;
  method: string;
  normalizedMethod: string;
  permissionType: number;
}

export interface PermissionCM {
  permission?: Permission;
  holderId: string;
  isGroup?: boolean;
  isRole?: boolean;
  isUser?: boolean;
  isPermissionUI?: boolean;
  isPermissionResource?: boolean;
}
export interface AddPermissionModel {
  ids: string[];
}
