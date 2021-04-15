import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { Popup } from 'semantic-ui-react';
import { FiCloudOff, FiPlus, FiTrash2, FiUploadCloud } from 'react-icons/fi';

import DataTable, { Column } from '@app/components/data-table';
import { useSelector, useDispatch, useFetchApi, useConfirm } from '@app/hooks';

import { getRooms } from '@csyt/catalog/room/room.slice';
import {
  getWorkingCalendars,
  selectWorkingCalendar,
} from '../working-schedule.slice';
import CreateScheduleModal from './create-schedule-modal';
import {
  WorkingCalendar,
  WorkingCalendarStatus,
} from '../working-schedule.model';
import workingScheduleService from '../working-schedule.service';

const WorkingCalendarTable: React.FC = () => {
  const {
    selectedHospital,
    workingCalendarList,
    getWorkingCalendarLoading,
  } = useSelector((state) => state.csyt.workingSchedule);
  const { POSTED } = WorkingCalendarStatus;
  const statusMap = useSelector(
    (state) => state.csyt.workingSchedule.statusMap,
  );

  const dispatch = useDispatch();
  const getData = useCallback(() => {
    if (selectedHospital) {
      dispatch(getRooms(selectedHospital.id));
      dispatch(getWorkingCalendars(selectedHospital.id));
    }
  }, [dispatch, selectedHospital]);
  useEffect(getData, [getData]);

  const confirm = useConfirm();
  const { fetch, fetching } = useFetchApi();
  const [adding, setAdding] = useState(false);

  const columns: Column<WorkingCalendar>[] = [
    {
      accessor: 'description',
      header: 'Tên lịch',
      render: ({ description }): React.ReactNode => description,
    },
    {
      accessor: 'fromDate',
      header: 'Từ ngày',
      render: (row): React.ReactNode =>
        `${moment(row.fromDate).format('DD-MM-YYYY')}`,
    },
    {
      accessor: 'toDate',
      header: 'Tới ngày',
      render: (row): React.ReactNode =>
        `${moment(row.toDate).format('DD-MM-YYYY')}`,
    },
    {
      accessor: 'fromTo',
      header: 'Khung thời gian',
      render: (row): React.ReactNode => row.fromTo,
    },
    {
      accessor: 'bookingBeforeDate',
      header: 'Đặt trước',
      render: ({ bookingBeforeDate }): React.ReactNode =>
        `${bookingBeforeDate} ngày`,
    },
    {
      accessor: 'bookingAfterDate',
      header: 'Đặt sau',
      render: ({ bookingAfterDate }): React.ReactNode =>
        `${bookingAfterDate} ngày`,
    },
    {
      accessor: 'room',
      header: 'Phòng/Buồng',
      render: (row) => row.room.name,
    },
    {
      accessor: 'doctor',
      header: 'Cán bộ',
      render: (row) => row.doctor.fullName,
    },
    {
      accessor: 'services',
      header: 'Dịch vụ',
      render: (row): React.ReactNode => (
        <Popup
          className="top center flowing-popup"
          flowing
          size="tiny"
          content={`${row.services.map((s) => s.service.name).join(', ')}`}
          trigger={
            <span>
              {`${row.services
                .map((s) => s.service.name)
                .join(', ')
                .substring(0, 30)}${
                row.services.map((s) => s.service.name).length > 30 ? '...' : ''
              }`}
            </span>
          }
        />
      ),
    },
    {
      accessor: 'status',
      header: 'Trạng thái',
      render: (row): React.ReactNode => statusMap[row.status].label,
    },
  ];

  return (
    <>
      <DataTable
        search
        selectable
        columns={columns}
        data={workingCalendarList}
        loading={fetching || getWorkingCalendarLoading}
        onRowClick={(row): void => {
          dispatch(selectWorkingCalendar(row));
        }}
        rowActions={[
          {
            icon: <FiUploadCloud />,
            color: 'violet',
            title: 'Đăng lịch',
            hidden: (row): boolean => row.status === POSTED,
            onClick: (row): void => {
              fetch(
                workingScheduleService.publishWorkingCalendars([row.id]),
              ).then(getData);
            },
          },
          {
            icon: <FiCloudOff />,
            color: 'yellow',
            title: 'Huỷ đăng lịch',
            hidden: (row): boolean => row.status !== POSTED,
            onClick: (row): void => {
              fetch(
                workingScheduleService.cancelWorkingCalendars([row.id]),
              ).then(getData);
            },
          },
          {
            icon: <FiTrash2 />,
            color: 'red',
            title: 'Xóa lịch',
            onClick: (row): void => {
              confirm('Xóa lịch này?', async () => {
                await fetch(
                  workingScheduleService.deleteWorkingCalendar(row.id),
                );
                getData();
              });
            },
          },
        ]}
        tableActions={[
          {
            icon: <FiUploadCloud />,
            color: 'blue',
            title: 'Đăng lịch đã chọn',
            disabled: workingCalendarList.every((e) => e.status === POSTED),
            onClick: (rows): void => {
              fetch(
                workingScheduleService.publishWorkingCalendars(
                  rows.map((r) => r.id),
                ),
              ).then(getData);
            },
          },
          {
            icon: <FiCloudOff />,
            color: 'red',
            title: 'Huỷ đăng lịch đã chọn',
            disabled: workingCalendarList.every((e) => e.status !== POSTED),
            onClick: (rows): void => {
              fetch(
                workingScheduleService.cancelWorkingCalendars(
                  rows.map((r) => r.id),
                ),
              ).then(getData);
            },
          },
          {
            icon: <FiPlus />,
            color: 'green',
            title: 'Tạo lịch',
            onClick: (): void => setAdding(true),
          },
        ]}
      />

      <CreateScheduleModal
        open={adding}
        onClose={(): void => setAdding(false)}
        onCreateFinish={getData}
      />
    </>
  );
};

export default WorkingCalendarTable;
