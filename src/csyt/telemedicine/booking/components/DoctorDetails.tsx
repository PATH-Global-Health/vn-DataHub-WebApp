import React, { useEffect } from 'react';
import { Button, Dimmer, Grid, Header, Label, Loader } from 'semantic-ui-react';
import { FiArrowLeft } from 'react-icons/fi';
import styled from 'styled-components';

import moment from 'moment';

import { toVND } from '@app/utils/helpers';
import { useSelector, useDispatch } from '@app/hooks';
import {
  getDoctorServices,
  selectService,
  getAvailableDays,
  selectDay,
  getSlots,
  selectSlot,
  selectDoctor,
} from '../booking.slice';

import DoctorCard from './DoctorCard';
import BookingModal from './booking-modal';

const BackButtonWrapper = styled.div`
  margin-bottom: 18px;
`;
const TicketWrapper = styled.div`
  position: relative;
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

const DoctorDetails: React.FC = () => {
  const {
    selectedHospital,
    selectedDoctor,
    doctorServiceList,
    getDoctorServicesLoading,
    selectedService,
    doctorWorkingDayList,
    getDoctorWorkingDaysLoading,
    selectedDoctorDay,
    doctorFreeSlotList,
    getDoctorFreeSlotsLoading,
    selectedSlotTimeId,
  } = useSelector((s) => s.csyt.telemedicine.booking);

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedDoctor) {
      dispatch(getDoctorServices(selectedDoctor.Id));
    }
  }, [dispatch, selectedDoctor]);

  useEffect(() => {
    if (doctorServiceList.length > 0 && !selectedService) {
      dispatch(selectService(doctorServiceList[0].Id));
    }
  }, [dispatch, doctorServiceList, selectedService]);

  useEffect(() => {
    if (selectedDoctor && selectedService) {
      dispatch(
        getAvailableDays({
          doctorId: selectedDoctor.Id,
          serviceId: selectedService.Id,
        }),
      );
    }
  }, [dispatch, selectedDoctor, selectedService]);

  useEffect(() => {
    if (doctorWorkingDayList.length > 0 && !selectedDoctorDay) {
      dispatch(selectDay(doctorWorkingDayList[0]));
    }
  }, [dispatch, doctorWorkingDayList, selectedDoctorDay]);

  useEffect(() => {
    if (
      selectedHospital &&
      selectedDoctor &&
      selectedService &&
      selectedDoctorDay
    ) {
      dispatch(
        getSlots({
          hospitalId: selectedHospital.id,
          doctorId: selectedDoctor.Id,
          serviceId: selectedService.Id,
          date: selectedDoctorDay,
        }),
      );
    }
  }, [
    dispatch,
    selectedHospital,
    selectedDoctor,
    selectedService,
    selectedDoctorDay,
  ]);

  return (
    <>
      <BackButtonWrapper>
        <Button
          basic
          animated="vertical"
          onClick={() => dispatch(selectDoctor(undefined))}
        >
          <Button.Content visible content={<FiArrowLeft />} />
          <Button.Content hidden content="Cán bộ" />
        </Button>
      </BackButtonWrapper>
      <Grid>
        <Grid.Row>
          <Grid.Column width={4}>
            {selectedDoctor && (
              <DoctorCard
                fullName={selectedDoctor.FullName ?? ''}
                academicDegree={selectedDoctor.AcademicDegree ?? ''}
                email={selectedDoctor.Email ?? ''}
                phone={selectedDoctor.Phone ?? ''}
              />
            )}
          </Grid.Column>
          <Grid.Column width={12}>
            <Header content="Chuyên khoa" />
            <TicketWrapper>
              <Dimmer inverted active={getDoctorServicesLoading}>
                <Loader active />
              </Dimmer>
              {doctorServiceList.map((s) => (
                <Label
                  key={s.Id}
                  color="teal"
                  size="large"
                  basic={selectedService?.Id !== s.Id}
                  content={`${s.Name} (${toVND(s.Price)})`}
                  onClick={() => dispatch(selectService(s.Id))}
                />
              ))}
            </TicketWrapper>

            <Header content="Ngày" />
            <TicketWrapper>
              <Dimmer inverted active={getDoctorWorkingDaysLoading}>
                <Loader active />
              </Dimmer>
              {doctorWorkingDayList.map((d) => (
                <Label
                  key={d.getDate()}
                  size="large"
                  color="orange"
                  className="day-label"
                  onClick={() => dispatch(selectDay(d))}
                  content={moment(d).format('DD-MM-YYYY')}
                  basic={selectedDoctorDay?.getDate() !== d.getDate()}
                />
              ))}
            </TicketWrapper>

            <Header content="Giờ" />
            <TicketWrapper>
              <Dimmer inverted active={getDoctorFreeSlotsLoading}>
                <Loader active />
              </Dimmer>
              {doctorFreeSlotList &&
                [
                  ...doctorFreeSlotList.Morning,
                  ...doctorFreeSlotList.Afternoon,
                ].map((fsd) => (
                  <Label
                    key={fsd.TimeId}
                    size="large"
                    className="time-label"
                    color={fsd.Active ? 'violet' : 'grey'}
                    basic={fsd.TimeId !== selectedSlotTimeId && fsd.Active}
                    content={fsd.From.substring(0, 5)}
                    onClick={() => {
                      if (fsd.Active) {
                        dispatch(selectSlot(fsd.TimeId));
                      }
                    }}
                  />
                ))}

              {doctorFreeSlotList &&
                doctorFreeSlotList.Morning.length +
                  doctorFreeSlotList.Afternoon.length ===
                  0 && <span>Bác sĩ hiện không có lịch làm việc</span>}
            </TicketWrapper>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      {selectedHospital &&
        selectedDoctor &&
        selectedService &&
        selectedDoctorDay && (
          <BookingModal
            key={selectedSlotTimeId}
            onRefresh={() => {
              dispatch(
                getSlots({
                  hospitalId: selectedHospital.id,
                  doctorId: selectedDoctor.Id,
                  serviceId: selectedService.Id,
                  date: selectedDoctorDay,
                }),
              );
            }}
          />
        )}
    </>
  );
};

export default DoctorDetails;
