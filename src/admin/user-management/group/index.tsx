import React, { useEffect, useState, useCallback } from 'react';
import { Grid, Tab } from 'semantic-ui-react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

import DataList from '@app/components/data-list';
import { useDispatch, useSelector, useConfirm, useFetchApi } from '@app/hooks';
import { getGroups, selectGroup } from './group.slice';
import { Group } from './group.model';

import GroupModal from './GroupModal';
import groupService from './group.service';
import UserRolePermissionOfGroup from './UserRolePermissionOfGroup';

const panes = [
  {
    menuItem: 'User',
    render: (): JSX.Element => (
      <Tab.Pane attached={false}>
        <UserRolePermissionOfGroup isUser />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Role',
    render: (): JSX.Element => (
      <Tab.Pane attached={false}>
        <UserRolePermissionOfGroup isRole />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Permission UI',
    render: (): JSX.Element => (
      <Tab.Pane attached={false}>
        <UserRolePermissionOfGroup isPermissionUI />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Permission Resource',
    render: (): JSX.Element => (
      <Tab.Pane attached={false}>
        <UserRolePermissionOfGroup isPermissionResource />
      </Tab.Pane>
    ),
  },
];

const GroupPage: React.FC = () => {
  const { groupList, selectedGroup, getGroupsLoading } = useSelector(
    (state) => state.admin.userManagement.group,
  );

  const dispatch = useDispatch();
  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();

  const [groupModal, setGroupModal] = useState(false);
  const [selected, setSelected] = useState<Group>();

  const getData = useCallback(() => {
    dispatch(getGroups());
  }, [dispatch]);
  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Grid>
      <Grid.Column width={selectedGroup?.id ? 8 : 16}>
        <DataList
          search
          toggle
          title="Danh sách Group"
          data={groupList}
          loading={fetching || getGroupsLoading}
          listActions={[
            {
              title: 'Tạo',
              color: 'green',
              icon: <FiPlus />,
              onClick: (): void => {
                setSelected(undefined);
                setGroupModal(true);
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
                setGroupModal(true);
              },
            },
            {
              title: 'Xóa',
              color: 'red',
              icon: <FiTrash2 />,
              onClick: (row): void => {
                confirm('Xác nhận xóa?', () => {
                  fetch(groupService.deleteGroup(row.id));
                });
              },
            },
          ]}
          onRowClick={(row: Group): void => {
            if (selectedGroup?.id === row?.id) {
              dispatch(selectGroup(undefined));
            } else {
              dispatch(selectGroup(row));
            }
          }}
          getRowKey={(d): string => d.id}
          itemHeaderRender={(d): string => d.name}
          itemContentRender={(d): string => `Miêu tả: ${d.description}`}
        />
      </Grid.Column>
      {selectedGroup?.id && (
        <Grid.Column width={8}>
          <Tab
            panes={panes}
            renderActiveOnly
            menu={{ secondary: true, pointing: true }}
          />
        </Grid.Column>
      )}
      <GroupModal
        open={groupModal}
        onClose={(): void => setGroupModal(false)}
        onRefresh={getData}
        data={selected}
      />
    </Grid>
  );
};

export default GroupPage;
