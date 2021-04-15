import React, { useCallback, useMemo } from 'react';

import moment from 'moment';

import { useSelector, useDispatch } from '@app/hooks';
import ScheduleCalendar, { Agenda } from '@app/components/schedule-calendar';

import { selectTicket, setFromTo } from '../schedule.slice';

const TicketCalendar: React.FC = () => {
  const dispatch = useDispatch();

  const {
    //
    from,
    ticketList,
    getTicketsLoading,
    statusMap,
  } = useSelector((state) => state.csyt.telemedicine.schedule);

  const agendaList = useMemo(
    (): Agenda[] =>
      ticketList.map((t) => ({
        date: moment(t.Schedule.Date).toDate(),
        id: t.Id,
        status: t.Status,
        time: t.Schedule.Time.substring(0, 5),
        infoList: [
          {
            name: 'hospitalName',
            label: 'Đơn vị đặt hẹn',
            content: t.Name,
          },
          {
            name: 'doctorName',
            label: 'Chuyên gia',
            content: t.Doctor.Name,
          },
          {
            name: 'customerName',
            label: 'Bệnh nhân',
            content: t.Customer.FullName,
          },
        ],
      })),
    [ticketList],
  );

  const onAgendaClick = useCallback(
    (id: Agenda['id']) => {
      dispatch(selectTicket(ticketList.find((t) => t.Id === id)?.Id));
    },
    [dispatch, ticketList],
  );

  return (
    <>
      <ScheduleCalendar
        loading={getTicketsLoading}
        weekStartDate={from}
        agendaList={agendaList}
        onAgendaClick={onAgendaClick}
        statusMap={statusMap}
        onWeekChange={(f, t) => dispatch(setFromTo({ from: f, to: t }))}
      />
    </>
  );
};

export default TicketCalendar;
