import React, { useMemo, useEffect, useState } from 'react';
import { Modal } from 'semantic-ui-react';

import SimpleForm from '@app/components/simple-form';
import { FormField } from '@app/models/form-field';
import { useSelector, useFetchApi, useDispatch } from '@app/hooks';

import groupService from '../group/group.service';
import roleService from '../role/role.service';

import { getGroups } from '../group/group.slice';
import { getRoles } from '../role/role.slice';

interface Props {
  open: boolean;
  isGroup?: boolean;
  isRole?: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

interface FormModel {
  id: string;
}

const AddGroupRoleModal: React.FC<Props> = (props) => {
  const { isGroup, isRole, open, onClose, onRefresh } = props;
  const { selectedUser } = useSelector(
    (state) => state.admin.userManagement.user,
  );

  const { groupList } = useSelector(
    (state) => state.admin.userManagement.group,
  );
  const { roleList } = useSelector((state) => state.admin.userManagement.role);
  const [options, setOptions] = useState<{ text: string; value: string }[]>([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isGroup) {
      dispatch(getGroups());
    }
    if (isRole) {
      dispatch(getRoles());
    }
  }, [dispatch, isGroup, isRole]);

  useEffect(() => {
    if (isGroup) {
      setOptions(
        groupList.map((g) => ({
          text: g.name,
          value: g.id,
        })),
      );
    }
    if (isRole) {
      setOptions(
        roleList.map((r) => ({
          text: r.name,
          value: r.id,
        })),
      );
    }
  }, [isGroup, isRole, groupList, roleList]);

  const { fetch, fetching } = useFetchApi();
  const label = `
    ${isGroup ? 'Tên Group' : ''}
    ${isRole ? 'Tên Role' : ''}`;
  const formFields = useMemo(
    (): FormField<FormModel>[] => [
      {
        name: 'id',
        type: 'select',
        required: true,
        label,
        options,
      },
    ],
    [label, options],
  );

  const header = `Thêm ${selectedUser?.fullName ?? ''} vào 
    ${isGroup ? 'Group' : ''}
    ${isRole ? 'Role' : ''}`;

  const handleSubmit = async (d: FormModel): Promise<void> => {
    if (selectedUser) {
      if (isGroup) {
        await fetch(groupService.addUsersToGroup([selectedUser.id], d.id));
      }
      if (isRole) {
        await fetch(roleService.addUsersToRole([selectedUser.id], d.id));
      }
      onRefresh();
      onClose();
    }
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>{header}</Modal.Header>
      <Modal.Content>
        {selectedUser && (
          <SimpleForm
            loading={fetching}
            formFields={formFields}
            onSubmit={handleSubmit}
          />
        )}
      </Modal.Content>
    </Modal>
  );
};

export default AddGroupRoleModal;
