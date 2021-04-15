import React, { useEffect, useCallback } from 'react';
import moment from 'moment';
import { Popup } from 'semantic-ui-react';
import { FiUploadCloud, FiCloudOff } from 'react-icons/fi';

import DataTable, { Column } from '@app/components/data-table';

import { useSelector, useDispatch, useFetchApi } from '@app/hooks';
import {
  getWorkingCalendarDays,
  selectWorkingCalendarDay,
} from '../working-schedule.slice';
import workingScheduleService from '../working-schedule.service';
import {
  WorkingCalendarDay,
  WorkingCalendarStatus,
} from '../working-schedule.model';

const WorkingCalendarDayTable: React.FC = () => {
  const {
    selectedWorkingCalendar,
    workingCalendarDayList,
    getWorkingCalendarDaysLoading,
  } = useSelector((state) => state.csyt.workingSchedule);

  const dispatch = useDispatch();
  const getData = useCallback(() => {
    if (selectedWorkingCalendar) {
      dispatch(getWorkingCalendarDays(selectedWorkingCalendar.id));
    }
  }, [dispatch, selectedWorkingCalendar]);
  useEffect(getData, [getData]);

  const { fetch, fetching } = useFetchApi();

  const { POSTED } = WorkingCalendarStatus;
  const statusMap = useSelector(
    (state) => state.csyt.workingSchedule.statusMap,
  );

  const columns: Column<WorkingCalendarDay>[] = [
    {
      accessor: 'date',
      header: 'Ngày',
      render: (row) => moment(row.date).format('DD/MM/YYYY'),
    },
    {
      accessor: 'schedules',
      header: 'Thời gian',
      render: (r): string => `${r.schedules.from} - ${r.schedules.to}`,
    },
    {
      accessor: 'time',
      header: 'Thời gian khám',
      render: (r) => `${r.time} phút`,
    },
    {
      accessor: 'room',
      header: 'Phòng/Buồng',
      render: (row) => row.room.description,
    },
    {
      accessor: 'service',
      header: 'Dịch vụ',
      render: (row): React.ReactNode => (
        <Popup
          className="top center flowing-popup"
          flowing
          size="tiny"
          content={`${row.service.map((s) => s.description).join(', ')}`}
          trigger={
            <span>
              {`${row.service
                .map((s) => s.description)
                .join(', ')
                .substring(0, 30)}${
                row.service.map((s) => s.description).length > 30 ? '...' : ''
              }`}
            </span>
          }
        />
      ),
    },
    {
      accessor: 'doctor',
      header: 'Cán bộ',
      render: (row) => row.doctor.description,
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
        data={workingCalendarDayList}
        loading={getWorkingCalendarDaysLoading || fetching}
        onRowClick={(row): void => {
          dispatch(selectWorkingCalendarDay(row));
        }}
        rowActions={[
          {
            icon: <FiUploadCloud />,
            color: 'violet',
            title: 'Đăng lịch',
            hidden: (row): boolean => row.status === POSTED,
            onClick: (row): void => {
              fetch(
                workingScheduleService.publishWorkingCalendarDays([row.id]),
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
                workingScheduleService.cancelWorkingCalendarDays([row.id]),
              ).then(getData);
            },
          },
        ]}
        tableActions={[
          {
            icon: <FiUploadCloud />,
            color: 'blue',
            title: 'Đăng lịch đã chọn',
            disabled: (rows) =>
              rows.length === 0 || rows.some((r) => r.status === POSTED),
            onClick: (rows): void => {
              fetch(
                workingScheduleService.publishWorkingCalendarDays(
                  rows.map((r) => r.id),
                ),
              ).then(getData);
            },
          },
          {
            icon: <FiCloudOff />,
            color: 'red',
            title: 'Huỷ đăng lịch đã chọn',
            disabled: (rows) =>
              rows.length === 0 || rows.some((r) => r.status !== POSTED),
            onClick: (rows): void => {
              fetch(
                workingScheduleService.cancelWorkingCalendarDays(
                  rows.map((r) => r.id),
                ),
              ).then(getData);
            },
          },
        ]}
      />
    </>
  );
};

export default WorkingCalendarDayTable;
