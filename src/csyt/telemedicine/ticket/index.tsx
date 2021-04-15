import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch, useRefreshCallback } from '@app/hooks';
import { ComponentKey, GroupKey } from '@app/utils/component-tree';

import { getTickets } from './ticket.slice';

import TicketCalendar from './components/TicketCalendar';
import TicketDetailsModal from './components/TicketDetailsModal';

const TelemedicineTicketPage: React.FC = () => {
  const dispatch = useDispatch();

  const { from, to } = useSelector((state) => state.csyt.telemedicine.ticket);

  const getData = useCallback(() => {
    if (from && to) {
      dispatch(getTickets({ from, to }));
    }
  }, [dispatch, from, to]);
  useRefreshCallback(
    GroupKey.CSYT_TELEMEDICINE,
    ComponentKey.CSYT_TELEMEDICINE_TICKET,
    getData,
  );
  useEffect(getData, [getData]);

  return (
    <>
      <TicketCalendar />
      <TicketDetailsModal onRefresh={getData} />
    </>
  );
};

export default TelemedicineTicketPage;
