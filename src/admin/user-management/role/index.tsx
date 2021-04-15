import React, { useEffect, useState, useCallback } from 'react';
import { Grid, Tab } from 'semantic-ui-react';
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';

import DataList from '@app/components/data-list';
import { useDispatch, useSelector, useConfirm, useFetchApi } from '@app/hooks';
import UserPermissionOfRole from './UserPermissionOfRole';
import { getRoles, selectRole } from './role.slice';
import { Role } from './role.model';
import RoleModal from './RoleModal';
import roleService from './role.service';

const panes = [
  {
    menuItem: 'User',
    render: (): JSX.Element => (
      <Tab.Pane attached={false}>
        <UserPermissionOfRole isUser />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Permission UI',
    render: (): JSX.Element => (
      <Tab.Pane attached={false}>
        <UserPermissionOfRole isPermissionUI />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Permission Resource',
    render: (): JSX.Element => (
      <Tab.Pane attached={false}>
        <UserPermissionOfRole isPermissionResource />
      </Tab.Pane>
    ),
  },
];

const RolePage: React.FC = () => {
  const { selectedRole, roleList, getRolesLoading } = useSelector(
    (state) => state.admin.userManagement.role,
  );

  const dispatch = useDispatch();
  const confirm = useConfirm();
  const { fetch, fetching } = useFetchApi();

  const [roleModal, setRoleModal] = useState(false);
  const [selected, setSelected] = useState<Role>();

  const getData = useCallback(() => {
    dispatch(getRoles());
  }, [dispatch]);
  useEffect(getData, [getData]);

  return (
    <Grid>
      <Grid.Column width={selectedRole?.id ? 8 : 16}>
        <DataList
          search
          toggle
          title="Danh sách Role"
          data={roleList}
          loading={fetching || getRolesLoading}
          listActions={[
            {
              title: 'Tạo',
              color: 'green',
              icon: <FiPlus />,
              onClick: (): void => {
                setSelected(undefined);
                setRoleModal(true);
              },
            },
          ]}
          itemActions={[
            {
              title: 'Sửa',
              color: 'violet',
              icon: <FiEdit2 />,
              onClick: (row): void => {
                setSelected(row);
                setRoleModal(true);
              },
            },
            {
              title: 'Xóa',
              color: 'red',
              icon: <FiTrash2 />,
              onClick: (row): void => {
                confirm('Xác nhận xóa?', () => {
                  fetch(roleService.deleteRole(row.id));
                });
              },
            },
          ]}
          onRowClick={(row: Role): void => {
            if (selectedRole?.id === row?.id) {
              dispatch(selectRole(undefined));
            } else {
              dispatch(selectRole(row));
            }
          }}
          itemHeaderRender={(d): string => d.name}
          itemContentRender={(d): string => d.description}
          getRowKey={(d): string => d.id}
        />
      </Grid.Column>
      {selectedRole?.id && (
        <Grid.Column width={8}>
          <Tab
            panes={panes}
            renderActiveOnly
            menu={{ secondary: true, pointing: true }}
          />
        </Grid.Column>
      )}
      <RoleModal
        open={roleModal}
        onClose={(): void => setRoleModal(false)}
        onRefresh={getData}
        data={selected}
      />
    </Grid>
  );
};

export default RolePage;
