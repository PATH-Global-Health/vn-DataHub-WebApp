import React, { useMemo } from 'react';
import { Modal } from 'semantic-ui-react';

import SimpleForm from '@app/components/simple-form';
import { FormField } from '@app/models/form-field';
import { useFetchApi, useSelector } from '@app/hooks';

import serviceService from '../service.service';
import { ServiceCM } from '../service.model';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const CreateModal: React.FC<Props> = (props) => {
  const { open, onClose, onRefresh } = props;
  const { fetch, fetching } = useFetchApi();

  const serviceTypeList = useSelector(
    (state) => state.csyt.catalog.serviceType.serviceTypeList,
  );
  const injectionObjectList = useSelector(
    (state) => state.csyt.catalog.injectionObject.injectionObjectList,
  );
  const getServiceTypesLoading = useSelector(
    (state) => state.csyt.catalog.serviceType.getServiceTypesLoading,
  );
  const serviceFormList = useSelector(
    (state) => state.csyt.catalog.serviceForm.serviceFormList,
  );
  const getServiceFormsLoading = useSelector(
    (state) => state.csyt.catalog.serviceForm.getServiceFormsLoading,
  );

  const formFields = useMemo(
    (): FormField<ServiceCM>[] => [
      { name: 'code', label: 'Mã' },
      { name: 'name', label: 'Dịch vụ' },
      {
        name: 'serviceFormId',
        label: 'Hình thức',
        type: 'select',
        options: serviceFormList.map((e) => ({
          text: e.name,
          value: e.id,
        })),
        required: true,
      },
      {
        name: 'serviceTypeId',
        label: 'Loại hình',
        type: 'select',
        options: serviceTypeList.map((e) => ({
          text: e.description,
          value: e.id,
        })),
        required: true,
      },
      {
        name: 'injectionObjectId',
        label: 'Đối tượng',
        type: 'select',
        options: injectionObjectList.map((e) => ({
          text: e.name,
          value: e.id,
        })),
      },
    ],
    [injectionObjectList, serviceTypeList, serviceFormList],
  );

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Modal.Header>Tạo mới</Modal.Header>
        <Modal.Content>
          <SimpleForm
            formFields={formFields}
            loading={
              fetching || getServiceTypesLoading || getServiceFormsLoading
            }
            onSubmit={async (d): Promise<void> => {
              await fetch(serviceService.createService(d));
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
