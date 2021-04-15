/* eslint-disable no-nested-ternary */
import DataList from '@app/components/data-list';
import { useConfirm, useDispatch, useFetchApi, useSelector } from '@app/hooks';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
// import {
//   getPermissionsResource,
//   getPermissionsUI,
// } from '../permission/permission.slice';
import {
  getUsersOfRole,
  getPermissionsUIOfRole,
  getPermissionsResourceOfRole,
} from './role.slice';
import AddPermissionToRole from './AddPermissionToRole';
import AddUserToRole from './AddUserToRole';
import { getUsers } from '../user/user.slice';
import roleService from './role.service';
import permissionService from '../permission/permission.service';
import { HolderType } from '../utils/constants';

interface Props {
  isUser?: boolean;
  isPermissionUI?: boolean;
  isPermissionResource?: boolean;
}
interface UserOrPermissionType {
  id: string;
  username?: string;
  fullName?: string;
  name?: string;
  description?: string;
  url?: string;
  method?: string;
  code?: string;
}

const UserPermissionOfRole: React.FC<Props> = (props) => {
  const { isUser, isPermissionUI, isPermissionResource } = props;
  const [addUserModal, setAddUserModal] = useState(false);
  const [addPermissionModal, setAddPermissionModal] = useState(false);
  const {
    selectedRole,
    getRolesLoading,
    userOfRoleList,
    getUserOfRoleLoading,
    permissionUIOfRoleList,
    getPermissionUIOfRoleLoading,
    permissionResourceOfRoleList,
    getPermissionResourceOfRoleLoading,
  } = useSelector((state) => state.admin.userManagement.role);
  const title = useMemo(() => {
    if (selectedRole) {
      if (isUser) {
        return `User của ${selectedRole.name}`;
      }
      if (isPermissionUI) {
        return `Permission UI của ${selectedRole.name}`;
      }
      if (isPermissionResource) {
        return `Permission Resource của ${selectedRole.name}`;
      }
    }
    return '';
  }, [isUser, isPermissionUI, isPermissionResource, selectedRole]);
  const data = useMemo(() => {
    if (isUser) {
      return userOfRoleList;
    }
    if (isPermissionUI) {
      return permissionUIOfRoleList;
    }
    if (isPermissionResource) {
      return permissionResourceOfRoleList;
    }
    return [];
  }, [
    isUser,
    userOfRoleList,
    isPermissionUI,
    permissionUIOfRoleList,
    isPermissionResource,
    permissionResourceOfRoleList,
  ]);
  const dispatch = useDispatch();
  const getData = useCallback(() => {
    if (selectedRole) {
      if (isUser) {
        dispatch(getUsers());
        dispatch(getUsersOfRole(selectedRole.id));
      }
      if (isPermissionUI) {
        // dispatch(getPermissionsUI());
        dispatch(getPermissionsUIOfRole(selectedRole.id));
      }
      if (isPermissionResource) {
        // dispatch(getPermissionsResource());
        dispatch(getPermissionsResourceOfRole(selectedRole.id));
      }
    }
  }, [isUser, isPermissionUI, isPermissionResource, selectedRole, dispatch]);
  useEffect(getData, [getData]);

  const confirm = useConfirm();
  const { fetch, fetching } = useFetchApi();
  const handleRemove = async (row: UserOrPermissionType) => {
    if (selectedRole) {
      if (isUser) {
        // remove user from role
        await fetch(roleService.removeUserToRole(row.id, selectedRole.id));
      }
      if (isPermissionUI) {
        // remove permission UI from role
        await fetch(
          permissionService.deletePermission(
            row.id,
            selectedRole.id,
            HolderType.ROLE,
            true,
            false,
          ),
        );
      }
      if (isPermissionResource) {
        // remove permission Resource from role
        await fetch(
          permissionService.deletePermission(
            row.id,
            selectedRole.id,
            HolderType.ROLE,
            false,
            true,
          ),
        );
      }
      getData();
    }
  };

  return (
    <>
      <DataList
        search
        title={title}
        data={data as UserOrPermissionType[]}
        loading={
          fetching ||
          getRolesLoading ||
          getUserOfRoleLoading ||
          getPermissionUIOfRoleLoading ||
          getPermissionResourceOfRoleLoading
        }
        listActions={[
          {
            title: 'Thêm',
            color: 'green',
            icon: <FiPlus />,
            onClick: (): void => {
              if (isUser) {
                setAddUserModal(true);
              } else {
                setAddPermissionModal(true);
              }
            },
          },
        ]}
        itemActions={[
          {
            title: 'Xoá',
            color: 'red',
            icon: <FiTrash2 />,
            onClick: (row) => confirm('Xác nhận xóa?', () => handleRemove(row)),
          },
        ]}
        getRowKey={(d): string => d?.id ?? ''}
        itemHeaderRender={
          (d): string => (isUser ? d?.username ?? '' : d?.name ?? '')
          // eslint-disable-next-line react/jsx-curly-newline
        }
        itemContentRender={
          (d): string =>
            isUser
              ? d?.fullName ?? ''
              : isPermissionResource
              ? `${d?.method ?? ''} - ${d?.url ?? ''}`
              : `CODE: ${d?.code ?? ''}`
          // eslint-disable-next-line react/jsx-curly-newline
        }
      />
      <AddUserToRole
        open={addUserModal}
        onClose={() => setAddUserModal(false)}
        onRefresh={getData}
      />
      <AddPermissionToRole
        open={addPermissionModal}
        onClose={() => setAddPermissionModal(false)}
        onRefresh={getData}
        isPermissionUI={isPermissionUI}
        isPermissionResource={isPermissionResource}
      />
    </>
  );
};

export default UserPermissionOfRole;
