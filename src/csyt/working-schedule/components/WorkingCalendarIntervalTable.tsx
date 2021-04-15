import React, { useEffect, useCallback } from 'react';
import { FiUnlock, FiLock } from 'react-icons/fi';

import DataTable, { Column } from '@app/components/data-table';

import { useSelector, useDispatch, useFetchApi } from '@app/hooks';

import workingScheduleService from '../working-schedule.service';
import {
  WorkingCalendarInterval,
  WorkingCalendarStatus,
} from '../working-schedule.model';
import { getWorkingCalendarIntervals } from '../working-schedule.slice';

const WorkingCalendarIntervalTable: React.FC = () => {
  const {
    selectedWorkingCalendarDay,
    workingCalendarIntervalList,
    getWorkingCalendarIntervalsLoading,
  } = useSelector((state) => state.csyt.workingSchedule);

  const dispatch = useDispatch();
  const getData = useCallback(() => {
    if (selectedWorkingCalendarDay) {
      dispatch(getWorkingCalendarIntervals(selectedWorkingCalendarDay.id));
    }
  }, [dispatch, selectedWorkingCalendarDay]);
  useEffect(getData, [getData]);

  const { fetch, fetching } = useFetchApi();

  const { POSTED } = WorkingCalendarStatus;
  const statusMap = useSelector(
    (state) => state.csyt.workingSchedule.statusMap,
  );
  const columns: Column<WorkingCalendarInterval>[] = [
    {
      accessor: 'from',
      header: 'Thời gian',
      render: (r) => `${r.from} - ${r.to}`,
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
        data={workingCalendarIntervalList}
        loading={getWorkingCalendarIntervalsLoading || fetching}
        rowActions={[
          {
            icon: <FiUnlock />,
            color: 'violet',
            title: 'Mở',
            hidden: (row): boolean => row.status === POSTED,
            onClick: (row): void => {
              fetch(
                workingScheduleService.publishWorkingCalendarIntervals(
                  row.intervals.map((i) => i.id),
                ),
              ).then(getData);
            },
          },
          {
            icon: <FiLock />,
            color: 'yellow',
            title: 'Đóng',
            hidden: (row): boolean => row.status !== POSTED,
            onClick: (row): void => {
              fetch(
                workingScheduleService.cancelWorkingCalendarIntervals(
                  row.intervals.map((i) => i.id),
                ),
              ).then(getData);
            },
          },
        ]}
        tableActions={[
          {
            icon: <FiUnlock />,
            color: 'blue',
            title: 'Mở khung giờ đã chọn',
            disabled: (rows) =>
              rows.length === 0 || rows.some((r) => r.status === POSTED),
            onClick: (rows): void => {
              fetch(
                workingScheduleService.publishWorkingCalendarIntervals(
                  rows
                    .map((r) => r.intervals.map((i) => i.id))
                    .reduce((a, b) => [...a, ...b], []),
                ),
              ).then(getData);
            },
          },
          {
            icon: <FiLock />,
            color: 'red',
            title: 'Đóng khung giờ đã chọn',
            disabled: (rows) =>
              rows.length === 0 || rows.some((r) => r.status !== POSTED),
            onClick: (rows): void => {
              fetch(
                workingScheduleService.cancelWorkingCalendarIntervals(
                  rows
                    .map((r) => r.intervals.map((i) => i.id))
                    .reduce((a, b) => [...a, ...b], []),
                ),
              ).then(getData);
            },
          },
        ]}
      />
    </>
  );
};

export default WorkingCalendarIntervalTable;
