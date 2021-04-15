import React, { useCallback, useMemo } from 'react';

import moment from 'moment';

import { useSelector, useDispatch } from '@app/hooks';
import ScheduleCalendar, { Agenda } from '@app/components/schedule-calendar';

import { selectVaccinationSchedule, setFromTo } from '../vaccination.slice';

const BookingCalendar: React.FC = () => {
  const dispatch = useDispatch();

  const vaccinationScheduleList = useSelector(
    (state) => state.csyt.vaccination.vaccinationScheduleList,
  );
  const agendaList = useMemo(
    (): Agenda[] =>
      vaccinationScheduleList.map((v) => ({
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
            name: 'injectionObject',
            label: 'Đối tượng',
            content: v.injectionObject?.name,
          },
          { name: 'serviceName', label: 'Mũi tiêm', content: v.service.name },
          { name: 'doctor', label: 'Cán bộ', content: v.doctor.fullname },
          { name: 'room', label: 'Phòng/Buồng', content: v.room.name },
          {
            name: 'customer',
            label: 'Người tiêm',
            content: v.customer.fullname,
          },
        ],
      })),
    [vaccinationScheduleList],
  );

  const onAgendaClick = useCallback(
    (id: Agenda['id']) => {
      dispatch(
        selectVaccinationSchedule(
          vaccinationScheduleList.find((v) => v.id === id)?.id,
        ),
      );
    },
    [dispatch, vaccinationScheduleList],
  );

  const getServicesLoading = useSelector(
    (state) => state.csyt.catalog.service.getServicesLoading,
  );
  const { getVaccinationSchedulesLoading, from } = useSelector(
    (state) => state.csyt.vaccination,
  );
  const loading = useMemo(
    (): boolean => getServicesLoading || getVaccinationSchedulesLoading,
    [getServicesLoading, getVaccinationSchedulesLoading],
  );

  const statusMap = useSelector((state) => state.csyt.vaccination.statusMap);

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
