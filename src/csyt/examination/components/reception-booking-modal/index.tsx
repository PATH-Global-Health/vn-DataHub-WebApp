/* eslint-disable @typescript-eslint/unbound-method */
import React, { useState, useCallback } from 'react';
import { Button, Modal } from 'semantic-ui-react';

import { useFetchApi, useSelector } from '@app/hooks';
import { Doctor } from '@csyt/catalog/doctor/doctor.model';
import { Room } from '@csyt/catalog/room/room.model';
import { Interval } from '@csyt/working-schedule/working-schedule.model';
import { ExitInformation } from '@csyt/examination/examination.model';

import CustomerSection from './CustomerSection';
import ScheduleSection from './ScheduleSection';
import CustomerExitSection from './CustomerExitSection';

import examinationService from '../../examination.service';
import { Customer } from '../../../catalog/customer/customer.model';
import customerService from '../../../catalog/customer/customer.service';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const ReceptionBookingModal: React.FC<Props> = (props) => {
  const { open, onClose, onRefresh } = props;

  const [customer, setCustomer] = useState<Customer>();
  const [ticket, setTicket] = useState<Interval>();
  const [doctor, setDoctor] = useState<Doctor>();
  const [room, setRoom] = useState<Room>();
  const [date, setDate] = useState<Date>();
  const [exitInformation, setExitInformation] = useState<ExitInformation>();

  const bookedByUser = useSelector((state) => state.auth.userInfo?.id);
  const { selectedHospital } = useSelector((s) => s.csyt.examination);
  const { fetch, fetching } = useFetchApi();
  const handleConfirm = useCallback(async () => {
    if (
      date &&
      customer &&
      ticket &&
      selectedHospital &&
      doctor &&
      room &&
      exitInformation
    ) {
      let customerId = '';
      if (customer.id !== '-1') {
        customerId = customer?.id;
      } else {
        customerId = await fetch(customerService.createCustomer(customer));
      }

      await fetch(
        examinationService.register(
          date,
          ticket,
          selectedHospital,
          exitInformation,
          { id: doctor.id, fullname: doctor?.description ?? '' },
          { id: room.id, name: room?.description ?? '' },
          {
            id: 'f2490f62-1d28-4edd-362a-08d8a7232229',
            name: 'Xét nghiệm COVID-19',
          },
          {
            ...customer,
            id: customerId,
            phone: customer.phoneNumber,
            districtCode: customer.district,
            provinceCode: customer.province,
            wardCode: customer.ward,
            birthDate: customer.dateOfBirth,
          },
          bookedByUser,
        ),
      );
      onRefresh();
      onClose();
    }
  }, [
    fetch,
    date,
    selectedHospital,
    bookedByUser,
    customer,
    ticket,
    doctor,
    room,
    exitInformation,
    onRefresh,
    onClose,
  ]);

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Modal.Header content="Tiếp nhận" />
        <Modal.Content>
          <CustomerSection onChange={setCustomer} loading={fetching} />
          <CustomerExitSection
            onChange={setExitInformation}
            loading={fetching}
          />
          <ScheduleSection
            onChange={(t, d, r, selectedDay) => {
              setTicket(t);
              setDoctor(d);
              setRoom(r);
              setDate(selectedDay);
            }}
            loading={fetching}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            primary
            content="Xác nhận"
            loading={fetching}
            onClick={!fetching ? handleConfirm : () => {}}
            disabled={!customer || !ticket || !exitInformation}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default ReceptionBookingModal;
