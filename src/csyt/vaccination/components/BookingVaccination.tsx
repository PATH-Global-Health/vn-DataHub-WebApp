import React, { useState, useEffect, useCallback } from 'react';
import { Button } from 'semantic-ui-react';
import styled from 'styled-components';

import { useSelector, useDispatch, useRefreshCallback } from '@app/hooks';
import { GroupKey } from '@app/utils/component-tree';

import { getDoctors } from '../../catalog/doctor/doctor.slice';
import { getServices } from '../../catalog/service/service.slice';
import { getCustomers } from '../../catalog/customer/customer.slice';
import { getServiceTypes } from '../../catalog/service-type/service-type.slice';
import {
  getInjectionObjects,
  getVaccinationSchedules,
} from '../vaccination.slice';

import BookingCalendar from './BookingCalendar';
import BookingDetailsModal from './BookingDetailsModal';
import StatisticTable from './StatisticTable';
import ReceptionBookingModal from './reception-booking-modal';
import ExportExcelModal from './ExportExcelModal';

const ButtonWrapper = styled.div`
  padding-left: 6px;
`;

const BookingVaccination: React.FC = () => {
  const dispatch = useDispatch();

  const [isCalendar, setIsCalendar] = useState(true);
  const [exportModal, setExportModal] = useState(false);

  const from = useSelector((state) => state.csyt.vaccination.from);
  const to = useSelector((state) => state.csyt.vaccination.to);
  const selectedHospital = useSelector(
    (s) => s.csyt.vaccination.selectedHospital,
  );

  const getData = useCallback(() => {
    if (from && to && selectedHospital) {
      dispatch(
        getVaccinationSchedules({ from, to, unitId: selectedHospital.id }),
      );
    }
  }, [dispatch, from, to, selectedHospital]);
  useRefreshCallback(
    GroupKey.CSYT_VACCINATION,
    GroupKey.CSYT_VACCINATION,
    getData,
  );
  useEffect(getData, [getData]);

  useEffect(() => {
    const asyncFunc = async (): Promise<void> => {
      await Promise.all([
        dispatch(getDoctors()),
        dispatch(getServices()),
        dispatch(getServiceTypes()),
      ]);
    };
    asyncFunc();
    dispatch(getInjectionObjects());
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

export default BookingVaccination;
