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

import roomService from './room.service';
import { getRooms } from './room.slice';
import { Room } from './room.model';

import CreateModal from './components/CreateModal';
import UpdateModal from './components/UpdateModal';

const columns: Column<Room>[] = [
  { header: 'Mã', accessor: 'code' },
  { header: 'Tên', accessor: 'name' },
];

const RoomTable: React.FC = () => {
  const { selectedHospital, roomList } = useSelector(
    (state) => state.csyt.catalog.room,
  );
  const getRoomsLoading = useSelector(
    (state) => state.csyt.catalog.room.getRoomsLoading,
  );

  const dispatch = useDispatch();
  const getData = useCallback(() => {
    if (selectedHospital) {
      dispatch(getRooms(selectedHospital.id));
    }
  }, [dispatch, selectedHospital]);
  useRefreshCallback(GroupKey.CSYT_CATALOG, ComponentKey.CSYT_ROOM, getData);
  useEffect(getData, [getData]);

  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();

  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<Room>();

  return (
    <>
      <DataTable
        search
        columns={columns}
        data={roomList}
        loading={getRoomsLoading || fetching}
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
                await fetch(roomService.deleteRoom(d.id));
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

export default RoomTable;
