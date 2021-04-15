import React, { useState, useEffect, useCallback } from 'react';
import { Button } from 'semantic-ui-react';
import styled from 'styled-components';

import { useSelector, useDispatch, useRefreshCallback } from '@app/hooks';
import { GroupKey } from '@app/utils/component-tree';
import { getCustomers } from '@csyt/catalog/customer/customer.slice';
import { getDoctors } from '@csyt/catalog/doctor/doctor.slice';

import { getTelehealthSchedules } from '../telehealth.slice';

import BookingCalendar from './BookingCalendar';
import BookingDetailsModal from './BookingDetailsModal';
// import ExportExcelModal from './ExportExcelModal';
import StatisticTable from './StatisticTable';

const ButtonWrapper = styled.div`
  padding-left: 6px;
`;

const TelehealthPage: React.FC = () => {
  const dispatch = useDispatch();

  const [isCalendar, setIsCalendar] = useState(true);
  // const [exportModal, setExportModal] = useState(false);

  const from = useSelector((state) => state.csyt.telehealth.from);
  const to = useSelector((state) => state.csyt.telehealth.to);
  const selectedHospital = useSelector(
    (s) => s.csyt.telehealth.selectedHospital,
  );

  const getData = useCallback(() => {
    if (from && to && selectedHospital) {
      dispatch(
        getTelehealthSchedules({ from, to, unitId: selectedHospital.id }),
      );
    }
  }, [dispatch, from, to, selectedHospital]);
  useRefreshCallback(
    GroupKey.CSYT_TELEHEALTH,
    GroupKey.CSYT_TELEHEALTH,
    getData,
  );
  useEffect(getData, [getData]);

  useEffect(() => {
    const asyncFunc = async (): Promise<void> => {
      await dispatch(getDoctors());
    };
    asyncFunc();
    dispatch(getCustomers());
  }, [dispatch]);

  return (
    <>
      <ButtonWrapper>
        <Button
          color={!isCalendar ? 'olive' : 'teal'}
          content={!isCalendar ? 'Lịch hẹn' : 'Thống kê'}
          onClick={() => setIsCalendar((b) => !b)}
        />
        {/* <Button
          color="violet"
          content="Xuất báo cáo"
          onClick={() => setExportModal(true)}
        /> */}
      </ButtonWrapper>

      {isCalendar && <BookingCalendar />}
      {!isCalendar && <StatisticTable />}

      <BookingDetailsModal onRefresh={getData} />

      {/* <ExportExcelModal
        open={exportModal}
        onClose={() => setExportModal(false)}
      /> */}
    </>
  );
};

export default TelehealthPage;
