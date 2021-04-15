import React from 'react';
import { Modal } from 'semantic-ui-react';

import { useFetchApi } from '@app/hooks';
import SimpleForm from '@app/components/simple-form';
import { FormField } from '@app/models/form-field';

import roomService from '../room.service';
import { Room } from '../room.model';

interface Props {
  data?: Room;
  onClose: () => void;
  onRefresh: () => void;
}

const formFields: FormField<Room>[] = [
  { name: 'id', hidden: true },
  { name: 'unitId', hidden: true },
  { name: 'code', label: 'Mã', required: true },
  { name: 'name', label: 'Tên', required: true },
];

const UpdateModal: React.FC<Props> = (props) => {
  const { data, onClose, onRefresh } = props;
  const { fetch, fetching } = useFetchApi();

  return (
    <>
      <Modal open={Boolean(data)} onClose={onClose}>
        <Modal.Header>Cập nhật</Modal.Header>
        <Modal.Content>
          <SimpleForm
            defaultValues={data}
            formFields={formFields}
            loading={fetching}
            onSubmit={async (d): Promise<void> => {
              await fetch(roomService.updateRoom(d));
              onRefresh();
              onClose();
            }}
          />
        </Modal.Content>
      </Modal>
    </>
  );
};

export default UpdateModal;
