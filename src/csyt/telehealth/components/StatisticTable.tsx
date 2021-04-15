/* eslint-disable no-nested-ternary */
import React, { useMemo, useState } from 'react';

import styled from 'styled-components';

import moment from 'moment';

import DataTable, { Column } from '@app/components/data-table';
import SearchBar, { filterArray } from '@app/components/SearchBar';
import { WeekPicker } from '@app/components/date-picker';

import { useSelector, useDispatch } from '@app/hooks';
import { selectTelehealthSchedule, setFromTo } from '../telehealth.slice';

import { TelehealthScheduleTableVM } from '../telehealth.model';

const Wrapper = styled.div`
  padding: 6px;
`;
const SearchBarWrapper = styled.div`
  padding-bottom: 6px;
`;

const StatisticTable: React.FC = () => {
  const dispatch = useDispatch();
  const {
    statusMap,
    telehealthScheduleList,
    getTelehealthSchedulesLoading,
    from,
  } = useSelector((state) => state.csyt.telehealth);

  const getServicesLoading = useSelector(
    (state) => state.csyt.catalog.service.getServicesLoading,
  );
  const columns = useMemo(
    (): Column<TelehealthScheduleTableVM>[] => [
      {
        accessor: 'numId',
        header: 'Mã phiếu',
        aggregate: 'count',
        renderAggregated: ({ value }) => `Tổng: ${value as string}`,
      },
      {
        accessor: 'customerName',
        header: 'Họ tên người tiêm',
      },
      { accessor: 'customerBirthday', header: 'Ngày sinh' },
      { accessor: 'roomName', header: 'Phòng/Buồng' },
      { accessor: 'doctorName', header: 'Cán bộ' },
      { accessor: 'date', header: 'Ngày' },
      { accessor: 'time', header: 'Giờ' },
      { accessor: 'status', header: 'Trạng thái' },
      { accessor: 'bookedByUser', header: 'Tài khoản đặt lịch' },
    ],
    [],
  );

  const [searchValue, setSearchValue] = useState('');
  const data = useMemo(
    (): TelehealthScheduleTableVM[] =>
      filterArray(
        telehealthScheduleList
          .slice()
          .sort((a, b) =>
            a.date === b.date
              ? a.interval.from > b.interval.from
                ? 1
                : -1
              : a.date > b.date
              ? 1
              : -1,
          )
          .map((s) => ({
            id: s.id,
            numId: s.interval.numId,
            customerName: s.customer.fullname,
            customerBirthday: moment(s.customer.birthDate).format('DD-MM-YYYY'),
            serviceName: s.service.name,
            roomName: s.room.name,
            doctorName: s.doctor.fullname,
            date: moment(s.date).format('DD-MM-YYYY'),
            time: s.interval.from,
            bookedByUser: s.bookedByUser,
            status: statusMap[s.status].label,
            note: s.note,
          })),
        searchValue,
      ),
    [telehealthScheduleList, searchValue, statusMap],
  );

  return (
    <Wrapper>
      <SearchBarWrapper>
        <SearchBar onChange={setSearchValue} />
      </SearchBarWrapper>
      <DataTable
        loading={getTelehealthSchedulesLoading || getServicesLoading}
        title={
          <WeekPicker
            weekStartDate={from}
            onChange={(ft) => dispatch(setFromTo(ft))}
          />
        }
        columns={columns}
        data={data}
        groupBy
        onRowClick={(r) => dispatch(selectTelehealthSchedule(r.id))}
      />
    </Wrapper>
  );
};

export default StatisticTable;
