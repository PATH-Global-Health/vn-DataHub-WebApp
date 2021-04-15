import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { FiPlus, FiEdit3, FiTrash2, FiUpload } from 'react-icons/fi';
import { Image } from 'semantic-ui-react';

import { GroupKey, ComponentKey } from '@app/utils/component-tree';
import DataTable, { Column } from '@app/components/data-table';
import locations from '@app/assets/mock/locations.json';
import { apiLinks } from '@app/utils';

import {
  useSelector,
  useDispatch,
  useRefreshCallback,
  useConfirm,
  useFetchApi,
} from '@app/hooks';

import { getHospitals } from '../slices/hospital';
import { getUnitTypes } from '../slices/unit-type';

import CreateModal from '../components/hospital/CreateModal';
import { Hospital } from '../models/hospital';
import UpdateModal from '../components/hospital/UpdateModal';
import { hospitalService } from '../services';

const HospitalAccountsPage: React.FC = () => {
  const { hospitalList, getHospitalsLoading } = useSelector(
    (state) => state.admin.account.hospital,
  );
  const { unitTypeList, getUnitTypesLoading } = useSelector(
    (state) => state.admin.account.unitType,
  );
  const dispatch = useDispatch();

  const getData = useCallback(() => {
    dispatch(getHospitals());
    dispatch(getUnitTypes());
  }, [dispatch]);

  useRefreshCallback(
    GroupKey.ADMIN_ACCOUNT,
    ComponentKey.ADMIN_HOSPITALS,
    getData,
  );
  useEffect(getData, [getData]);

  const { fetch, fetching } = useFetchApi();
  const [selecting, setSelecting] = useState<Hospital>();

  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File>();
  const handleClick = () => {
    if (fileRef.current !== null) {
      fileRef.current.click();
    }
  };
  useEffect(() => {
    if (selectedFile && selecting) {
      const formData = new FormData();
      formData.append('Id', selecting.id);
      formData.append('Picture', selectedFile);
      fetch(hospitalService.updateLogo(formData)).then(getData);
    }
    // eslint-disable-next-line
  }, [fetch, selectedFile]);

  const columns: Column<Hospital>[] = useMemo(
    (): Column<Hospital>[] => [
      {
        header: 'Ảnh',
        accessor: 'logo',
        render: (d) => (
          <>
            <Image
              circular
              size="tiny"
              src={`${apiLinks.csyt.hospital.getLogo}/${d.id}`}
            />
            <input
              hidden
              id="selectImage"
              type="file"
              accept="image/*"
              ref={fileRef}
              onChange={(e) => {
                if (e.target !== null && e.target.files !== null) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
            />
          </>
        ),
      },
      {
        header: 'Tên',
        accessor: 'name',
      },
      {
        header: 'Loại hình',
        accessor: 'unitTypeId',
        render: (d): string =>
          unitTypeList.find((u) => u.id === d.unitTypeId)?.typeName ?? '',
      },
      {
        header: 'Tỉnh/Thành',
        accessor: 'province',
        render: (d): string => {
          const province = locations.find((p) => p.value === d.province);
          return province?.label ?? '';
        },
      },
      {
        header: 'Quận/Huyện',
        accessor: 'district',
        render: (d): string => {
          const province = locations.find((p) => p.value === d.province);
          const district = province?.districts.find(
            (dt) => dt.value === d.district,
          );
          return district?.label ?? '';
        },
      },
      {
        header: 'Phường/Xã',
        accessor: 'ward',
        render: (d): string => {
          const province = locations.find((p) => p.value === d.province);
          const district = province?.districts.find(
            (dt) => dt.value === d.district,
          );
          const ward = district?.wards.find((w) => w.value === d.ward);
          return ward?.label ?? '';
        },
      },
    ],
    [unitTypeList],
  );

  const confirm = useConfirm();

  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

  const loading = getHospitalsLoading || getUnitTypesLoading;
  return (
    <>
      <DataTable
        search
        title="Đơn vị"
        loading={loading || fetching}
        columns={columns}
        data={hospitalList}
        tableActions={[
          {
            icon: <FiPlus />,
            color: 'green',
            title: 'Thêm',
            onClick: (): void => {
              setCreateModal(true);
              setSelecting(undefined);
            },
          },
        ]}
        rowActions={[
          {
            icon: <FiUpload />,
            title: 'Cập nhật ảnh',
            color: 'blue',
            onClick: (r): void => {
              setSelecting(r);
              handleClick();
            },
          },
          {
            icon: <FiEdit3 />,
            title: 'Sửa',
            color: 'violet',
            onClick: (r): void => {
              setUpdateModal(true);
              setSelecting(r);
            },
          },
          {
            icon: <FiTrash2 />,
            title: 'Xoá',
            color: 'red',
            onClick: (r): void => {
              confirm(
                'Xác nhận xóa?',
                async (): Promise<void> => {
                  await fetch(hospitalService.deleteHospital(r.id));
                  getData();
                },
              );
            },
          },
        ]}
      />

      <CreateModal
        open={createModal}
        onClose={(): void => setCreateModal(false)}
        onRefresh={getData}
      />

      <UpdateModal
        open={updateModal}
        onClose={(): void => setUpdateModal(false)}
        data={selecting}
        onRefresh={getData}
      />
    </>
  );
};

export default HospitalAccountsPage;
