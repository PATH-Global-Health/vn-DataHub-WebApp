import React, { useState, useEffect, useCallback } from 'react';
import { Button } from 'semantic-ui-react';
import styled from 'styled-components';

import { useSelector, useDispatch, useRefreshCallback } from '@app/hooks';
import { GroupKey } from '@app/utils/component-tree';
import { getCustomers } from '@csyt/catalog/customer/customer.slice';
import { getDoctors } from '@csyt/catalog/doctor/doctor.slice';

import { getExaminationSchedules } from '../examination.slice';

import BookingCalendar from './BookingCalendar';
import BookingDetailsModal from './BookingDetailsModal';
import ExportExcelModal from './ExportExcelModal';
import StatisticTable from './StatisticTable';
import ReceptionBookingModal from './reception-booking-modal';

const ButtonWrapper = styled.div`
  padding-left: 6px;
`;

const ExaminationPage: React.FC = () => {
  const dispatch = useDispatch();

  const [isCalendar, setIsCalendar] = useState(true);
  const [exportModal, setExportModal] = useState(false);

  const from = useSelector((state) => state.csyt.examination.from);
  const to = useSelector((state) => state.csyt.examination.to);
  const selectedHospital = useSelector(
    (s) => s.csyt.examination.selectedHospital,
  );

  const getData = useCallback(() => {
    if (from && to && selectedHospital) {
      dispatch(
        getExaminationSchedules({ from, to, unitId: selectedHospital.id }),
      );
    }
  }, [dispatch, from, to, selectedHospital]);
  useRefreshCallback(
    GroupKey.CSYT_EXAMINATION,
    GroupKey.CSYT_EXAMINATION,
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

  const [openReceptionBooking, setOpenReceptionBooking] = useState(false);

  return (
    <>
      <ButtonWrapper>
        <Button
          primary
          content="Tiếp nhận"
          onClick={() => setOpenReceptionBooking(true)}
        />
        <Button
          color={!isCalendar ? 'olive' : 'teal'}
          content={!isCalendar ? 'Lịch hẹn' : 'Thống kê'}
          onClick={() => setIsCalendar((b) => !b)}
        />
        <Button
          color="violet"
          content="Xuất báo cáo"
          onClick={() => setExportModal(true)}
        />
      </ButtonWrapper>

      <ReceptionBookingModal
        open={openReceptionBooking}
        onClose={() => setOpenReceptionBooking(false)}
        onRefresh={() => {
          getData();
          setOpenReceptionBooking(false);
        }}
      />

      {isCalendar && <BookingCalendar />}
      {!isCalendar && <StatisticTable />}

      <BookingDetailsModal onRefresh={getData} />

      <ExportExcelModal
        open={exportModal}
        onClose={() => setExportModal(false)}
      />
    </>
  );
};

export default ExaminationPage;
