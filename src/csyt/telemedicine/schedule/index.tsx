import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch, useRefreshCallback } from '@app/hooks';
import { ComponentKey, GroupKey } from '@app/utils/component-tree';

// import { Button } from 'semantic-ui-react';

import { getTickets } from './schedule.slice';

import TicketCalendar from './components/TicketCalendar';
import TicketDetailsModal from './components/TicketDetailsModal';

const TelemedicineSchedulePage: React.FC = () => {
  const dispatch = useDispatch();
  // const [isCalendar, setIsCalendar] = useState(true);

  const { from, to } = useSelector((state) => state.csyt.telemedicine.schedule);

  const getData = useCallback(() => {
    if (from && to) {
      dispatch(getTickets({ from, to }));
    }
  }, [dispatch, from, to]);
  useRefreshCallback(
    GroupKey.CSYT_TELEMEDICINE,
    ComponentKey.CSYT_TELEMEDICINE_SCHEDULE,
    getData,
  );
  useEffect(getData, [getData]);

  return (
    <>
      {/* <Button
      color={!isCalendar ? 'olive' : 'teal'}
      content={!isCalendar ? 'Lịch hẹn' : 'Thống kê'}
      onClick={() => setIsCalendar((b) => !b)}
      /> */}
      <TicketCalendar />
      <TicketDetailsModal onRefresh={getData} />
    </>
  );
};

export default TelemedicineSchedulePage;
