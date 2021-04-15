import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import DataList from '@app/components/data-list';

import {
  useConfirm,
  useFetchApi,
  // useConfirm,
  // useFetchApi,
  useSelector,
} from '@app/hooks';
import { useDispatch } from 'react-redux';
import {
  getGroupsOfUser,
  getRolesOfUser,
  getPermissionsUIOfUser,
  getPermissionsResourceOfUser,
} from './user.slice';

import { Role } from '../role/role.model';
import { Group } from '../group/group.model';
import { Permission } from '../permission/permission.model';
import AddGroupRoleModal from './AddGroupRoleToUserModal';
import AddPermissionToUserModal from './AddPermissionToUser';

import groupService from '../group/group.service';
import roleService from '../role/role.service';
import permissionService from '../permission/permission.service';
import { HolderType } from '../utils/constants';

interface Props {
  isGroup?: boolean;
  isRole?: boolean;
  isPermissionUI?: boolean;
  isPermissionResource?: boolean;
}
interface GroupRolePermissionType {
  id: string;
  username?: string;
  fullName?: string;
  name?: string;
  description?: string;
  url?: string;
  method?: string;
  code?: string;
}

const GroupRolePermissionOfUser: React.FC<Props> = (props) => {
  const {
    isGroup = false,
    isRole = false,
    isPermissionUI = false,
    isPermissionResource = false,
  } = props;
  const {
    selectedUser,
    getUsersLoading,
    groupsOfUserList,
    getGroupsOfUserLoading,
    rolesOfUserList,
    getRolesOfUserLoading,
    permissionsUIOfUserList,
    getPermissionUIOfUserLoading,
    permissionsResourceOfUserList,
    getPermissionResourceOfUserLoading,
  } = useSelector((state) => state.admin.userManagement.user);

  const [data, setData] = useState<Group[] | Role[] | Permission[]>([]);
  const dispatch = useDispatch();
  const getData = useCallback(() => {
    if (selectedUser) {
      if (isGroup) {
        dispatch(getGroupsOfUser(selectedUser.id));
      }
      if (isRole) {
        dispatch(getRolesOfUser(selectedUser.id));
      }
      if (isPermissionUI) {
        dispatch(getPermissionsUIOfUser(selectedUser.id));
      }
      if (isPermissionResource) {
        dispatch(getPermissionsResourceOfUser(selectedUser.id));
      }
    }
  }, [
    dispatch,
    selectedUser,
    isGroup,
    isRole,
    isPermissionUI,
    isPermissionResource,
  ]);
  useEffect(getData, [getData]);

  useEffect(() => {
    if (isGroup) {
      setData(groupsOfUserList);
    }
    if (isRole) {
      setData(rolesOfUserList);
    }
    if (isPermissionUI) {
      setData(permissionsUIOfUserList);
    }
    if (isPermissionResource) {
      setData(permissionsResourceOfUserList);
    }
  }, [
    isGroup,
    isRole,
    isPermissionUI,
    isPermissionResource,
    groupsOfUserList,
    rolesOfUserList,
    permissionsUIOfUserList,
    permissionsResourceOfUserList,
  ]);

  const title = useMemo(() => {
    if (selectedUser) {
      if (isGroup) {
        return `Group của ${selectedUser.fullName}`;
      }
      if (isRole) {
        return `Role của ${selectedUser.fullName}`;
      }
      if (isPermissionUI) {
        return `Permission UI của ${selectedUser.fullName}`;
      }
      if (isPermissionResource) {
        return `Permission Resource của ${selectedUser.fullName}`;
      }
    }
    return '';
  }, [isGroup, isRole, isPermissionUI, isPermissionResource, selectedUser]);

  const [addGroupRoleModal, setAddGroupRoleModal] = useState(false);
  const [addPermissionModal, setAddPermissionModal] = useState(false);

  const confirm = useConfirm();
  const { fetch, fetching } = useFetchApi();

  const handleRemove = async (row: GroupRolePermissionType) => {
    if (selectedUser) {
      if (isGroup) {
        // remove user from role
        await fetch(groupService.removeUserToGroup(selectedUser.id, row.id));
      }
      if (isRole) {
        // remove user from role
        await fetch(roleService.removeUserToRole(selectedUser.id, row.id));
      }
      if (isPermissionUI) {
        // remove permission UI from role
        await fetch(
          permissionService.deletePermission(
            row.id,
            selectedUser.id,
            HolderType.USER,
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
            selectedUser.id,
            HolderType.USER,
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
        data={data}
        loading={
          fetching ||
          getUsersLoading ||
          getGroupsOfUserLoading ||
          getRolesOfUserLoading ||
          getPermissionUIOfUserLoading ||
          getPermissionResourceOfUserLoading
        }
        listActions={[
          {
            title: 'Thêm',
            color: 'green',
            icon: <FiPlus />,
            onClick: (): void => {
              if (isGroup || isRole) {
                setAddGroupRoleModal(true);
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
        itemHeaderRender={(d): string => d.name}
        getRowKey={(d): string => d.id}
      />

      <AddGroupRoleModal
        open={addGroupRoleModal}
        isGroup={isGroup}
        isRole={isRole}
        onRefresh={getData}
        onClose={(): void => setAddGroupRoleModal(false)}
      />

      <AddPermissionToUserModal
        open={addPermissionModal}
        onRefresh={getData}
        isPermissionUI={isPermissionUI}
        isPermissionResource={isPermissionResource}
        onClose={(): void => setAddPermissionModal(false)}
      />
    </>
  );
};

export default GroupRolePermissionOfUser;
