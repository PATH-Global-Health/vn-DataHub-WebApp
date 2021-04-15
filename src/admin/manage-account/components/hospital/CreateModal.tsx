import React, { useMemo } from 'react';
import { Modal } from 'semantic-ui-react';

import { useSelector, useFetchApi } from '@app/hooks';
import SimpleForm, { Location } from '@app/components/simple-form';
import { FormField } from '@app/models/form-field';

import { hospitalService } from '../../services';
import { HospitalCM } from '../../models/hospital';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

interface FormModel extends HospitalCM {
  location: Location;
}

const CreateModal: React.FC<Props> = (props) => {
  const { open, onClose, onRefresh } = props;

  const { unitTypeList } = useSelector((state) => state.admin.account.unitType);
  const { fetch, fetching } = useFetchApi();

  const formFields = useMemo(
    (): FormField<FormModel>[] => [
      // {
      //   name: 'username',
      //   label: 'Tên đăng nhập',
      // },
      // {
      //   name: 'password',
      //   label: 'Mật khẩu',
      //   inputType: 'password',
      // },
      {
        name: 'unitTypeId',
        type: 'select',
        label: 'Loại hình',
        options: unitTypeList.map((u) => ({
          text: u.typeName,
          value: u.id,
          key: u.id,
        })),
        required: true,
      },
      {
        name: 'name',
        label: 'Tên đơn vị',
      },
      {
        name: 'phone',
        label: 'SĐT',
      },
      {
        name: 'email',
        label: 'Email',
      },
      {
        name: 'website',
        label: 'Trang web',
      },
      {
        name: 'introduction',
        type: 'textarea',
        label: 'Giới thiệu',
      },
      {
        name: 'address',
        label: 'Địa chỉ',
      },
      {
        name: 'location',
        type: 'location',
      },
    ],
    [unitTypeList],
  );

  const onSubmit = async (d: FormModel): Promise<void> => {
    const createResult = await fetch(
      hospitalService.createHospital({
        ...d,
        province: d.location?.provinceCode,
        district: d.location?.districtCode,
        ward: d.location?.wardCode,
      }),
    );
    if (Object.keys(createResult).length === 0) {
      onClose();
      onRefresh();
    } else {
      // TODO: add error validation
      console.log(createResult);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Tạo mới đơn vị</Modal.Header>
      <Modal.Content>
        <SimpleForm
          loading={fetching}
          formFields={formFields}
          onSubmit={onSubmit}
        />
      </Modal.Content>
    </Modal>
  );
};

export default CreateModal;
