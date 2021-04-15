import React, { useMemo } from 'react';
import { Modal } from 'semantic-ui-react';

import { useFetchApi, useSelector } from '@app/hooks';
import { FormField } from '@app/models/form-field';
import SimpleForm from '@app/components/simple-form';

import { Permission } from '../permission/permission.model';
import permissionService from '../permission/permission.service';
import { methodList, permissionTypeList } from '../utils/helpers';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  isPermissionUI?: boolean;
  isPermissionResource?: boolean;
}

const AddPermissionToUserModal: React.FC<Props> = (props) => {
  const {
    open,
    onClose,
    onRefresh,
    isPermissionUI,
    isPermissionResource,
  } = props;
  const { selectedUser } = useSelector(
    (state) => state.admin.userManagement.user,
  );
  const formFields = useMemo((): FormField<Permission>[] => {
    return [
      {
        name: 'name',
        label: 'Tên Permission',
      },
      {
        name: 'code',
        label: 'Code',
        hidden: isPermissionResource,
      },
      {
        name: 'method',
        type: 'select',
        required: true,
        label: 'Method',
        options: methodList.map((m) => ({
          text: m.text,
          value: m.value,
          label: {
            color: m.color,
            empty: true,
            circular: true,
          },
        })),
        hidden: isPermissionUI,
      },
      {
        name: 'url',
        label: 'URL',
        hidden: isPermissionUI,
      },
      {
        name: 'permissionType',
        type: 'select',
        required: true,
        label: 'Permission Type',
        options: permissionTypeList,
      },
      {
        name: 'description',
        label: 'Miêu tả',
      },
    ];
  }, [isPermissionResource, isPermissionUI]);
  const { fetch, fetching } = useFetchApi();
  const handleSubmit = async (d: Permission): Promise<void> => {
    if (selectedUser) {
      await fetch(
        permissionService.createPermission({
          permission: d,
          holderId: selectedUser.id,
          isUser: true,
          isPermissionUI,
          isPermissionResource,
        }),
      );
      onRefresh();
      onClose();
    }
  };

  const title = useMemo(() => {
    if (isPermissionUI) {
      return 'Thêm Permission UI';
    }
    if (isPermissionResource) {
      return 'Thêm Permission Resource';
    }
    return '';
  }, [isPermissionUI, isPermissionResource]);
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content>
        <SimpleForm
          formFields={formFields}
          loading={fetching}
          onSubmit={handleSubmit}
        />
      </Modal.Content>
    </Modal>
  );
};

export default AddPermissionToUserModal;
