/* eslint-disable @typescript-eslint/unbound-method */
import React, { useState, useCallback } from 'react';
import { Button, Modal } from 'semantic-ui-react';

import { useFetchApi, useSelector } from '@app/hooks';
import { Doctor } from '@csyt/catalog/doctor/doctor.model';
import { Room } from '@csyt/catalog/room/room.model';
import { Service } from '@csyt/catalog/service/service.model';
import { Interval } from '@csyt/working-schedule/working-schedule.model';

import CustomerSection from './CustomerSection';
import ContactSection from './ContactSection';
import ScheduleSection from './ScheduleSection';

import { ContactInfo, InjectionObject } from '../../vaccination.model';
import vaccinationService from '../../vaccination.service';
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
  const [contact, setContact] = useState<ContactInfo>();
  const [injectionObject, setInjectionObject] = useState<InjectionObject>();
  const [ticket, setTicket] = useState<Interval>();
  const [service, setService] = useState<Service>();
  const [doctor, setDoctor] = useState<Doctor>();
  const [room, setRoom] = useState<Room>();
  const [date, setDate] = useState<Date>();

  const { selectedHospital } = useSelector((s) => s.csyt.vaccination);
  const bookedByUser = useSelector((state) => state.auth.userInfo?.id);
  const { fetch, fetching } = useFetchApi();
  const handleConfirm = useCallback(async () => {
    if (
      date &&
      customer &&
      ticket &&
      service &&
      selectedHospital &&
      doctor &&
      room &&
      injectionObject
    ) {
      let customerId = '';
      if (customer.id !== '-1') {
        customerId = customer?.id;
      } else {
        customerId = await fetch(customerService.createCustomer(customer));
      }

      await fetch(
        vaccinationService.register(
          date,
          ticket,
          selectedHospital,
          { id: doctor.id, fullname: doctor?.description ?? '' },
          { id: room.id, name: room?.description ?? '' },
          { id: service.id, name: service.name },
          { id: injectionObject.id, name: injectionObject.name },
          {
            ...customer,
            id: customerId,
            phone: customer.phoneNumber,
            districtCode: customer.district,
            provinceCode: customer.province,
            wardCode: customer.ward,
            birthDate: customer.dateOfBirth,
          },
          contact ? [contact] : [],
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
    contact,
    ticket,
    doctor,
    room,
    injectionObject,
    onRefresh,
    onClose,
    service,
  ]);

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Modal.Header content="Tiếp nhận" />
        <Modal.Content>
          <CustomerSection onChange={setCustomer} loading={fetching} />
          <ContactSection onChange={setContact} loading={fetching} />
          <ScheduleSection
            onChange={(i, t, s, d, r, selectedDay) => {
              setInjectionObject(i);
              setTicket(t);
              setService(s);
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
            disabled={!customer || !ticket}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default ReceptionBookingModal;
