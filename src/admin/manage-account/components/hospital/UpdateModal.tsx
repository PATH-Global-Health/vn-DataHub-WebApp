import React, { useMemo } from 'react';
import { Modal } from 'semantic-ui-react';

import { useSelector, useFetchApi } from '@app/hooks';
import SimpleForm, { Location } from '@app/components/simple-form';
import { FormField } from '@app/models/form-field';

import { hospitalService } from '../../services';
import { Hospital } from '../../models/hospital';

interface Props {
  open: boolean;
  onClose: () => void;
  data?: Hospital;
  onRefresh: () => void;
}

interface FormModel extends Hospital {
  location?: Location;
}

const UpdateModal: React.FC<Props> = (props) => {
  const { open, onClose, data, onRefresh } = props;

  const { unitTypeList } = useSelector((state) => state.admin.account.unitType);
  const { fetch, fetching } = useFetchApi();

  const formFields = useMemo(
    (): FormField<FormModel>[] => [
      { name: 'id', hidden: true },
      { name: 'username', hidden: true },
      { name: 'province', hidden: true },
      { name: 'district', hidden: true },
      { name: 'ward', hidden: true },
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
        locationData: {
          districtCode: data?.district ?? '',
          provinceCode: data?.province ?? '',
          wardCode: data?.ward ?? '',
        },
      },
    ],
    [unitTypeList, data],
  );

  const onSubmit = async (d: FormModel): Promise<void> => {
    const formData = { ...d, location: undefined };
    await fetch(
      hospitalService.updateHospital({
        ...formData,
        province: d.location?.provinceCode ?? d?.province,
        district: d.location?.districtCode ?? d?.district,
        ward: d.location?.wardCode ?? d?.ward,
      }),
    );
    onClose();
    onRefresh();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Sửa thông tin đơn vị</Modal.Header>
      <Modal.Content>
        <SimpleForm
          defaultValues={data}
          loading={fetching}
          formFields={formFields}
          onSubmit={onSubmit}
        />
      </Modal.Content>
    </Modal>
  );
};

export default UpdateModal;
