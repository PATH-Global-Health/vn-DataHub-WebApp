import React from 'react';
import { Modal } from 'semantic-ui-react';

import SimpleForm from '@app/components/simple-form';
import { FormField } from '@app/models/form-field';
import { useFetchApi, useSelector } from '@app/hooks';

import roomService from '../room.service';
import { RoomCM } from '../room.model';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const formFields: FormField<RoomCM>[] = [
  { name: 'code', label: 'Mã', required: true },
  { name: 'name', label: 'Tên', required: true },
];

const CreateModal: React.FC<Props> = (props) => {
  const { open, onClose, onRefresh } = props;
  const { selectedHospital } = useSelector((s) => s.csyt.catalog.room);
  const { fetch, fetching } = useFetchApi();

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Modal.Header>Tạo mới</Modal.Header>
        <Modal.Content>
          <SimpleForm
            formFields={formFields}
            loading={fetching}
            onSubmit={async (d): Promise<void> => {
              if (selectedHospital) {
                await fetch(
                  roomService.createRoom({
                    ...d,
                    unitId: selectedHospital.id,
                  }),
                );
              }
              onRefresh();
              onClose();
            }}
          />
        </Modal.Content>
      </Modal>
    </>
  );
};

export default CreateModal;
