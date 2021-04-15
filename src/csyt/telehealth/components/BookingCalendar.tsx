import React, { useCallback, useMemo } from 'react';

import moment from 'moment';

import { useSelector, useDispatch } from '@app/hooks';
import ScheduleCalendar, { Agenda } from '@app/components/schedule-calendar';

import { selectTelehealthSchedule, setFromTo } from '../telehealth.slice';

const BookingCalendar: React.FC = () => {
  const dispatch = useDispatch();

  const telehealthScheduleList = useSelector(
    (state) => state.csyt.telehealth.telehealthScheduleList,
  );
  const agendaList = useMemo(
    (): Agenda[] =>
      telehealthScheduleList.map((v) => ({
        date: moment(v.date).toDate(),
        id: v.id,
        status: v.status,
        time: v.interval.from,
        infoList: [
          {
            name: 'numId',
            label: 'Mã phiếu hẹn',
            content: `${v.interval.numId}`,
          },
          {
            name: 'customerName',
            label: 'Họ tên',
            content: v.customer.fullname,
          },
          {
            name: 'customerBirthday',
            label: 'Ngày sinh',
            content: moment(v.customer.birthDate).format('DD-MM-YYYY'),
          },
          {
            name: 'doctorName',
            label: 'Cán bộ',
            content: v.doctor.fullname,
          },
          {
            name: 'roomName',
            label: 'Buồng/Phòng',
            content: v.room.name,
          },
        ],
      })),
    [telehealthScheduleList],
  );

  const onAgendaClick = useCallback(
    (id: Agenda['id']) => {
      dispatch(
        selectTelehealthSchedule(
          telehealthScheduleList.find((v) => v.id === id)?.id,
        ),
      );
    },
    [dispatch, telehealthScheduleList],
  );

  const getServicesLoading = useSelector(
    (state) => state.csyt.catalog.service.getServicesLoading,
  );
  const { getTelehealthSchedulesLoading, from } = useSelector(
    (state) => state.csyt.telehealth,
  );
  const loading = useMemo(
    (): boolean => getServicesLoading || getTelehealthSchedulesLoading,
    [getServicesLoading, getTelehealthSchedulesLoading],
  );

  const statusMap = useSelector((state) => state.csyt.telehealth.statusMap);

  return (
    <>
      <ScheduleCalendar
        loading={loading}
        weekStartDate={from}
        agendaList={agendaList}
        onAgendaClick={onAgendaClick}
        statusMap={statusMap}
        onWeekChange={(f, t) => dispatch(setFromTo({ from: f, to: t }))}
      />
    </>
  );
};

export default BookingCalendar;
