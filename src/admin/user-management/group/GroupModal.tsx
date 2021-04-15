import React, { useMemo } from 'react';

import { Modal } from 'semantic-ui-react';

import SimpleForm from '@app/components/simple-form';
import { FormField } from '@app/models/form-field';
import { useSelector, useFetchApi } from '@app/hooks';

import { Group } from './group.model';
import groupService from './group.service';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  data?: Group;
}

const GroupModal: React.FC<Props> = (props) => {
  const { data, open, onClose, onRefresh } = props;
  const { getGroupsLoading } = useSelector(
    (state) => state.admin.userManagement.group,
  );

  const formFields = useMemo(
    (): FormField<Group>[] => [
      {
        name: 'id',
        hidden: true,
      },
      {
        name: 'name',
        label: 'Tên group',
      },
      {
        name: 'description',
        label: 'Miêu tả',
      },
    ],
    [],
  );

  const { fetch, fetching } = useFetchApi();

  const handleSubmit = async (d: Group): Promise<void> => {
    await fetch(
      d.id ? groupService.updateGroup(d) : groupService.createGroup(d),
    );
    onRefresh();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        {data ? 'Sửa ' : 'Tạo '}
        Group
      </Modal.Header>
      <Modal.Content>
        <SimpleForm
          defaultValues={data}
          formFields={formFields}
          loading={fetching || getGroupsLoading}
          onSubmit={handleSubmit}
        />
      </Modal.Content>
    </Modal>
  );
};

export default GroupModal;
