import React from 'react';
import { Modal } from 'semantic-ui-react';

import SimpleForm from '@app/components/simple-form';
import { FormField } from '@app/models/form-field';
import { useFetchApi } from '@app/hooks';

import doctorService from '../doctor.service';
import { DoctorCM } from '../doctor.model';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const formFields: FormField<DoctorCM>[] = [
  { name: 'code', label: 'Mã', required: true },
  { name: 'fullName', label: 'Họ tên', required: true },
  { name: 'identityCard', label: 'CMND/CCCD', required: true },
  { name: 'title', label: 'Chức danh' },
  { name: 'academicTitle', label: 'Học hàm - Học vị' },
  {
    name: 'gender',
    label: 'Giới tính',
    type: 'select',
    options: [
      { text: 'Nam', value: true },
      { text: 'Nữ', value: false },
    ],
    required: true,
  },
  { name: 'email', label: 'Email' },
  { name: 'phone', label: 'SĐT' },
  // { name: 'Username', label: 'Tên đăng nhập' },
  // { name: 'Password', label: 'Mật khẩu', inputType: 'password' },
];

const CreateModal: React.FC<Props> = (props) => {
  const { open, onClose, onRefresh } = props;
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
              await fetch(doctorService.createDoctor(d));
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
