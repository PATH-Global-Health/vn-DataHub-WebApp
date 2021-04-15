import React from 'react';
import { Modal } from 'semantic-ui-react';

import { useFetchApi } from '@app/hooks';
import SimpleForm from '@app/components/simple-form';
import { FormField } from '@app/models/form-field';

import doctorService from '../doctor.service';
import { Doctor } from '../doctor.model';

interface Props {
  data?: Doctor;
  onClose: () => void;
  onRefresh: () => void;
}

const formFields: FormField<Doctor>[] = [
  { name: 'id', hidden: true },
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
              await fetch(doctorService.updateDoctor(d));
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
