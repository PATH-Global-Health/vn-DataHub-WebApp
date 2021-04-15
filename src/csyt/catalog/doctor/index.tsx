import React, { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiEdit3, FiTrash2 } from 'react-icons/fi';

import {
  useFetchApi,
  useRefreshCallback,
  useConfirm,
  useSelector,
  useDispatch,
} from '@app/hooks';
import DataTable, { Column } from '@app/components/data-table';
import { GroupKey, ComponentKey } from '@app/utils/component-tree';

import doctorService from './doctor.service';
import { getDoctors } from './doctor.slice';
import { Doctor } from './doctor.model';

import CreateModal from './components/CreateModal';
import UpdateModal from './components/UpdateModal';

const columns: Column<Doctor>[] = [
  { header: 'Mã', accessor: 'code' },
  { header: 'Họ tên', accessor: 'fullName' },
  { header: 'Chức danh', accessor: 'title' },
  {
    header: 'Giới tính',
    accessor: 'gender',
    render: (d): string => (d.gender ? 'Nam' : 'Nữ'),
  },
  // { header: 'Tài khoản', accessor: 'Username' },
];

const DoctorsPage: React.FC = () => {
  const { doctorList, getDoctorsLoading } = useSelector(
    (state) => state.csyt.catalog.doctor,
  );

  const dispatch = useDispatch();
  const getData = useCallback(() => {
    dispatch(getDoctors());
  }, [dispatch]);
  useRefreshCallback(GroupKey.CSYT_CATALOG, ComponentKey.CSYT_DOCTOR, getData);
  useEffect(getData, [getData]);

  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();

  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<Doctor>();

  return (
    <>
      <DataTable
        title="Cán bộ"
        sortBy={true}
        search
        columns={columns}
        data={doctorList}
        loading={getDoctorsLoading || fetching}
        tableActions={[
          {
            icon: <FiPlus />,
            color: 'green',
            title: 'Thêm',
            onClick: (): void => setOpenCreate(true),
          },
        ]}
        rowActions={[
          {
            icon: <FiEdit3 />,
            color: 'violet',
            title: 'Sửa',
            onClick: (d): void => setUpdateDetails(d),
          },
          {
            icon: <FiTrash2 />,
            color: 'red',
            title: 'Xoá',
            onClick: (d): void => {
              confirm('Xác nhận xoá', async () => {
                await fetch(doctorService.deleteDoctor(d.id));
                getData();
              });
            },
          },
        ]}
      />

      <CreateModal
        open={openCreate}
        onClose={(): void => setOpenCreate(false)}
        onRefresh={getData}
      />

      <UpdateModal
        data={updateDetails}
        onClose={(): void => setUpdateDetails(undefined)}
        onRefresh={getData}
      />
    </>
  );
};

export default DoctorsPage;
