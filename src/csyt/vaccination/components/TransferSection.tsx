import React, { useState, useEffect, useMemo } from 'react';
import {
  // Button,
  Card,
  Dimmer,
  Header,
  Label,
  Loader,
} from 'semantic-ui-react';
import styled from 'styled-components';

import moment from 'moment';

import { useFetchApi } from '@app/hooks';
import PopupText from '@app/components/PopupText';

import vaccinationService from '../vaccination.service';
import {
  ContactInfo,
  Ticket,
  // VaccinationStatus,
} from '../vaccination.model';
import { Hospital } from '../../catalog/hospital/hospital.model';

const Wrapper = styled.div`
  position: relative;
  & .card .content {
    color: #000000;
  }
`;
const TicketWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  margin: 0 -4px 40px -4px;
  .label {
    font-size: 16px;
    cursor: pointer;
    text-align: center;
    margin: 4px !important;
  }
  .label.day-label {
    width: 150px;
  }
  .label.time-label {
    width: 80px;
  }
`;

interface Props {
  serviceId: string;
  serviceGuid: string;
  serviceName: string;
  customerId: string;
  referenceId: string;
  contactInfo?: ContactInfo[];
  onRefresh: () => void;
  onClose: () => void;
}

const TransferSection: React.FC<Props> = (props) => {
  const { serviceId, serviceGuid } = props;
  const { fetch, fetching } = useFetchApi();

  const [hospitalList, setHospitalList] = useState<Hospital[]>([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>();
  useEffect(() => {
    const fetchHospitals = async () => {
      const result = await fetch(
        vaccinationService.getTransferHospitals(serviceId),
      );
      setHospitalList(result);
    };

    fetchHospitals();
  }, [fetch, serviceId]);
  const hospitalListNode = useMemo(
    () => (
      <>
        <Header size="small" content="Danh sách cơ sở tuyến trên" />
        <Card.Group itemsPerRow={4}>
          {hospitalList.map((h) => (
            <Card
              key={h.id}
              fluid
              raised={selectedHospitalId === h.id}
              image={h.image}
              description={<PopupText content={h.name} />}
              onClick={() => setSelectedHospitalId(h.id)}
            />
          ))}
        </Card.Group>
      </>
    ),
    [hospitalList, selectedHospitalId],
  );

  const [availableDayList, setAvailableDayList] = useState<Date[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date>();
  useEffect(() => {
    if (selectedHospitalId) {
      fetch(vaccinationService.getBookingAvailableDays(selectedHospitalId))
        .then((dateString) => dateString.sort().map((d) => moment(d).toDate()))
        .then(setAvailableDayList);
    }
  }, [fetch, selectedHospitalId]);
  const availableDayListNode = useMemo(
    () => (
      <>
        {availableDayList.length > 0 && <Header size="small" content="Ngày" />}
        <TicketWrapper>
          {availableDayList.map((d) => (
            <Label
              key={d.getTime()}
              basic={d.getTime() !== selectedDay?.getTime()}
              color="teal"
              size="large"
              className="day-label"
              content={moment(d).format('DD-MM-YYYY')}
              onClick={() => setSelectedDay(d)}
            />
          ))}
        </TicketWrapper>
      </>
    ),
    [availableDayList, selectedDay],
  );

  const [ticketList, setTicketList] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<number>();
  useEffect(() => {
    if (selectedHospitalId && selectedDay) {
      // prettier-ignore
      fetch(
        vaccinationService.getTickets(
          selectedHospitalId,
          selectedDay,
          serviceGuid,
        ),
      ).then((res) => {
        const sorted = [...res].sort((t1, t2) => {
          const t1time = moment(t1.time, 'hh:mm:ss');
          const t2time = moment(t2.time, 'hh:mm:ss');
          return t1time.isBefore(t2time) ? -1 : 1;
        });
        return sorted;
      }).then(setTicketList);
    }
  }, [fetch, serviceGuid, selectedHospitalId, selectedDay]);
  const ticketListNode = useMemo(
    () => (
      <>
        {ticketList.length > 0 && <Header size="small" content="Giờ" />}
        <TicketWrapper>
          {ticketList.map((t) => (
            <Label
              key={t.id}
              basic={t.id !== selectedTicketId}
              color="violet"
              size="large"
              className="time-label"
              content={t.time.substring(0, 5)}
              onClick={() => setSelectedTicketId(t.id)}
            />
          ))}
        </TicketWrapper>
      </>
    ),
    [ticketList, selectedTicketId],
  );

  // const {
  //   customerId,
  //   referenceId,
  //   serviceName,
  //   contactInfo,
  //   onRefresh,
  //   onClose,
  // } = props;
  return (
    <Wrapper>
      {fetching && (
        <Dimmer active inverted>
          <Loader inverted />
        </Dimmer>
      )}
      {hospitalListNode}
      {availableDayListNode}
      {ticketListNode}
      {/* {selectedTicketId && (
        <Button
          primary
          content="Xác nhận"
          onClick={async () => {
            const ticket = await fetch(
              vaccinationService.register(
                customerId,
                selectedTicketId,
                serviceId,
                contactInfo,
                referenceId,
                // undefined,
              ),
            );

            await fetch(
              vaccinationService.update(
                referenceId,
                VaccinationStatus.TRANSFERRED,
                serviceId,
                undefined,
                {
                  TransferredTo: {
                    Id: selectedHospitalId,
                    Name: hospitalList.find((h) => h.id === selectedHospitalId)
                      ?.name,
                  },
                  Ticket: ticket,
                },
              ),
            );

            onRefresh();
            onClose();
          }}
        />
      )} */}
    </Wrapper>
  );
};

export default TransferSection;
