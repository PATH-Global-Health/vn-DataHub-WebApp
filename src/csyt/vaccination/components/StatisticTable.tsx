/* eslint-disable no-nested-ternary */
import React, { useMemo, useState } from 'react';

import styled from 'styled-components';

import moment from 'moment';

import DataTable, { Column } from '@app/components/data-table';
import SearchBar, { filterArray } from '@app/components/SearchBar';
import { WeekPicker } from '@app/components/date-picker';

import { useSelector, useDispatch } from '@app/hooks';
import { selectVaccinationSchedule, setFromTo } from '../vaccination.slice';

import { VaccinationScheduleTableVM } from '../vaccination.model';

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
    vaccinationScheduleList,
    getVaccinationSchedulesLoading,
    from,
  } = useSelector((state) => state.csyt.vaccination);

  const getServicesLoading = useSelector(
    (state) => state.csyt.catalog.service.getServicesLoading,
  );
  const columns = useMemo(
    (): Column<VaccinationScheduleTableVM>[] => [
      {
        accessor: 'numId',
        header: 'Mã phiếu',
        aggregate: 'count',
        renderAggregated: ({ value }) => `Tổng: ${value as string}`,
      },
      { accessor: 'customerName', header: 'Họ tên người tiêm' },
      { accessor: 'customerBirthday', header: 'Ngày sinh' },
      { accessor: 'injectionObjectName', header: 'Đối tượng' },
      { accessor: 'serviceName', header: 'Mũi tiêm' },
      { accessor: 'roomName', header: 'Phòng/Buồng' },
      { accessor: 'doctorName', header: 'Cán bộ' },
      { accessor: 'date', header: 'Ngày' },
      { accessor: 'time', header: 'Giờ' },
      {
        accessor: 'status',
        header: 'Trạng thái',
        render: (r) => statusMap[r?.status]?.label,
      },
      { accessor: 'bookedByUser', header: 'Tài khoản đặt lịch' },
    ],
    [statusMap],
  );

  const [searchValue, setSearchValue] = useState('');
  const data = useMemo(
    (): VaccinationScheduleTableVM[] =>
      filterArray(
        vaccinationScheduleList
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
            date: moment(s.date).format('DD-MM-YYYY'),
            time: s.interval.from,
            doctorName: s.doctor.fullname,
            roomName: s.room.name,
            bookedByUser: s.bookedByUser,
            injectionObjectName: s.injectionObject.name,
            serviceName: s.service.name,
            note: s.note,
            status: s.status,
          })),
        searchValue,
      ),
    [vaccinationScheduleList, searchValue],
  );

  return (
    <Wrapper>
      <SearchBarWrapper>
        <SearchBar onChange={setSearchValue} />
      </SearchBarWrapper>
      <DataTable
        loading={getVaccinationSchedulesLoading || getServicesLoading}
        title={
          <WeekPicker
            weekStartDate={from}
            onChange={(ft) => dispatch(setFromTo(ft))}
          />
        }
        columns={columns}
        data={data}
        groupBy
        onRowClick={(r) => dispatch(selectVaccinationSchedule(r.id))}
      />
    </Wrapper>
  );
};

export default StatisticTable;
