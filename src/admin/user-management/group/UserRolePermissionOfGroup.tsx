import DataList from '@app/components/data-list';
import { useConfirm, useDispatch, useFetchApi, useSelector } from '@app/hooks';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import permissionService from '../permission/permission.service';
import { getRoles } from '../role/role.slice';
import { getUsers } from '../user/user.slice';
import { HolderType } from '../utils/constants';
import AddPermissionToGroupModal from './AddPermissionToGroupModal';
import AddUserRoleToGroupModal from './AddUserRoleToGroupModal';
import groupService from './group.service';
import {
  getUsersOfGroup,
  getRolesOfGroup,
  getPermissionsUIOfGroup,
  getPermissionsResourceOfGroup,
} from './group.slice';

interface Props {
  isUser?: boolean;
  isRole?: boolean;
  isPermissionUI?: boolean;
  isPermissionResource?: boolean;
}
interface UserOrRoleType {
  id: string;
  name: string;
  username: string;
  fullName: string;
  description: string;
}
const UserRolePermissionOfGroup: React.FC<Props> = (props) => {
  const { isUser, isRole, isPermissionUI, isPermissionResource } = props;
  const [addUserRoleModal, setAddUserRoleModal] = useState(false);
  const [addPermissionModal, setAddPermissionModal] = useState(false);
  const {
    selectedGroup,
    roleOfGroupList,
    userOfGroupList,
    permissionUIOfGroupList,
    permissionResourceOfGroupList,
    getRolesOfGroupLoading,
    getUsersOfGroupLoading,
    getPermissionsUIOfGroupLoading,
    getPermissionsResourceOfGroupLoading,
  } = useSelector((state) => state.admin.userManagement.group);
  const data = useMemo(() => {
    if (isUser) {
      return userOfGroupList;
    }
    if (isRole) {
      return roleOfGroupList;
    }
    if (isPermissionUI) {
      return permissionUIOfGroupList;
    }
    if (isPermissionResource) {
      return permissionResourceOfGroupList;
    }
    return [];
  }, [
    userOfGroupList,
    roleOfGroupList,
    permissionUIOfGroupList,
    permissionResourceOfGroupList,
    isPermissionUI,
    isPermissionResource,
    isRole,
    isUser,
  ]);

  const dispatch = useDispatch();
  const title = useMemo(() => {
    if (selectedGroup) {
      if (isUser) {
        return `User của ${selectedGroup.name}`;
      }
      if (isRole) {
        return `Role của ${selectedGroup.name}`;
      }
      if (isPermissionUI) {
        return `Permission UI của ${selectedGroup.name}`;
      }
      if (isPermissionResource) {
        return `Permission Resource của ${selectedGroup.name}`;
      }
    }
    return '';
  }, [isUser, isRole, isPermissionUI, isPermissionResource, selectedGroup]);
  const getData = useCallback(() => {
    if (selectedGroup) {
      if (isUser) {
        dispatch(getUsers());
        dispatch(getUsersOfGroup(selectedGroup.id));
      }
      if (isRole) {
        dispatch(getRoles());
        dispatch(getRolesOfGroup(selectedGroup.id));
      }
      if (isPermissionUI) {
        dispatch(getPermissionsUIOfGroup(selectedGroup.id));
      }
      if (isPermissionResource) {
        dispatch(getPermissionsResourceOfGroup(selectedGroup.id));
      }
    }
  }, [
    isUser,
    isRole,
    isPermissionUI,
    isPermissionResource,
    selectedGroup,
    dispatch,
  ]);
  useEffect(getData, [getData]);
  const confirm = useConfirm();
  const { fetch, fetching } = useFetchApi();

  const handleRemove = async (row: UserOrRoleType) => {
    if (selectedGroup) {
      if (isUser) {
        // remove user from group
        await fetch(groupService.removeUserToGroup(row.id, selectedGroup.id));
      }
      if (isRole) {
        // remove role from group
        await fetch(groupService.removeRoleToGroup(row.id, selectedGroup.id));
      }
      if (isPermissionUI) {
        // remove permission UI from group
        await fetch(
          permissionService.deletePermission(
            row.id,
            selectedGroup.id,
            HolderType.GROUP,
            true,
            false,
          ),
        );
      }
      if (isPermissionResource) {
        // remove permission Resource from group
        await fetch(
          permissionService.deletePermission(
            row.id,
            selectedGroup.id,
            HolderType.GROUP,
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
        data={data as UserOrRoleType[]}
        loading={
          fetching ||
          getUsersOfGroupLoading ||
          getRolesOfGroupLoading ||
          getPermissionsUIOfGroupLoading ||
          getPermissionsResourceOfGroupLoading
        }
        listActions={[
          {
            title: 'Thêm',
            color: 'green',
            icon: <FiPlus />,
            onClick: (): void => {
              if (isUser || isRole) {
                setAddUserRoleModal(true);
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
        getRowKey={(d): string => d.id}
        itemHeaderRender={(d): string => (isUser ? d.username : d.name)}
        itemContentRender={(d): string => (isUser ? d.fullName : d.description)}
      />

      <AddUserRoleToGroupModal
        isRole={isRole}
        open={addUserRoleModal}
        onRefresh={getData}
        onClose={(): void => setAddUserRoleModal(false)}
      />

      <AddPermissionToGroupModal
        open={addPermissionModal}
        onRefresh={getData}
        isPermissionUI={isPermissionUI}
        isPermissionResource={isPermissionResource}
        onClose={(): void => setAddPermissionModal(false)}
      />
    </>
  );
};

export default UserRolePermissionOfGroup;
