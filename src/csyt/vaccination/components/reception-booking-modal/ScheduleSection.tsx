import React, { useState, useEffect, useMemo } from 'react';
import {
  Dimmer,
  Form,
  Header,
  Label,
  Loader,
  Segment,
} from 'semantic-ui-react';
import styled from 'styled-components';

import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

import { DatePicker } from '@app/components/date-picker';

import { useSelector, useDispatch } from '@app/hooks';
import { Doctor } from '@csyt/catalog/doctor/doctor.model';
import { Room } from '@csyt/catalog/room/room.model';
import { Service } from '@csyt/catalog/service/service.model';
import { InjectionObject } from '@csyt/vaccination/vaccination.model';
import {
  Interval,
  WorkingCalendarInterval,
  // WorkingCalendarStatus,
} from '@csyt/working-schedule/working-schedule.model';
import {
  getAvailableReceptionDays,
  getAvailableReceptionIntervals,
  getVaccinationServices,
} from '../../vaccination.slice';

const TicketWrapper = styled(Segment)`
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  margin-left: -4px;
  margin-right: -4px;
  .label {
    width: 67px;
    font-size: 16px;
    cursor: pointer;
    text-align: center;
    margin: 4px !important;
  }
`;

interface Props {
  onChange: (
    injectionObject: InjectionObject,
    interval: Interval,
    service: Service,
    doctor: Doctor,
    room: Room,
    date: Date,
  ) => void;
  loading?: boolean;
}

const ScheduleSection: React.FC<Props> = (props) => {
  const { loading } = props;
  const dispatch = useDispatch();

  const [serviceType, setServiceType] = useState('');
  const { serviceTypeList } = useSelector((s) => s.csyt.catalog.serviceType);
  const serviceTypeSelectNode = useMemo(
    () => (
      <Form.Select
        fluid
        search
        label="Loại hình"
        value={serviceType}
        onChange={(e, { value }) => setServiceType(value as string)}
        options={serviceTypeList.map((e) => ({
          text: e.description,
          value: e.id,
        }))}
      />
    ),
    [serviceType, serviceTypeList],
  );

  const [selectedDay, setSelectedDay] = useState<Date>();

  const {
    injectionObjectList,
    getInjectionObjectsLoading,
    vaccinationServiceList,
    getVaccinationServiceLoading,
    selectedHospital,
    availableReceptionDayList,
    getAvailableReceptionDayLoading,
    availableReceptionIntervalList,
    getAvailableReceptionIntervalLoading,
  } = useSelector((state) => state.csyt.vaccination);

  const [injectionObjectId, setInjectionObjectId] = useState<string>();
  useEffect(() => {
    if (selectedDay) {
      const selectedDayId = availableReceptionDayList.find((wcd) =>
        moment(wcd.date).isSame(selectedDay, 'day'),
      )?.id;
      if (selectedDayId) {
        dispatch(getAvailableReceptionIntervals(selectedDayId));
      }
    }
  }, [dispatch, selectedDay, availableReceptionDayList]);
  // useEffect(() => setInjectionObjectId(undefined), [selectedDay, serviceType]);

  // const injectionObjectMap = useMemo(() => {
  //   const result: { [key: number]: boolean } = {};
  //   availableServices.forEach((s) => {
  //     if (s.injectionObject && s.serviceTypeId === serviceType) {
  //       result[s.injectionObject.id] = true;
  //     }
  //   });
  //   return result;
  // }, [availableServices, serviceType]);

  const injectionObjectSelectNode = (
    <Form.Select
      fluid
      search
      deburr
      label="Đối tượng"
      value={injectionObjectId ?? ''}
      loading={getInjectionObjectsLoading}
      options={injectionObjectList
        // .filter((io) => injectionObjectMap[io.id])
        .map((io) => ({
          text: io.name,
          value: io.id,
        }))}
      onChange={(e, { value }) => setInjectionObjectId(value as string)}
    />
  );

  useEffect(() => {
    if (injectionObjectId && serviceType) {
      dispatch(
        getVaccinationServices({
          serviceTypeId: serviceType,
          injectionObjectId,
        }),
      );
    }
  }, [dispatch, injectionObjectId, serviceType]);

  const [service, setService] = useState<Service>();

  const [ticketList, setTicketList] = useState<WorkingCalendarInterval[]>([]);
  useEffect(() => setTicketList([]), [
    selectedDay,
    serviceType,
    injectionObjectId,
    service,
    // doctorId,
  ]);
  useEffect(() => {
    setTicketList(
      availableReceptionIntervalList.map((wci) => ({ ...wci, id: uuidv4() })),
    );
  }, [availableReceptionIntervalList]);
  // const getTickets = useCallback(
  //   (day?: Date, sId?: string, dId?: string) => {
  //     if (hospitalId && day && sId) {
  //       fetch(vaccinationService.getTickets(hospitalId, day, sId, dId)).then(
  //         (res) => {
  //           res.sort((t1, t2) => {
  //             const t1time = moment(t1.time, 'hh:mm:ss');
  //             const t2time = moment(t2.time, 'hh:mm:ss');
  //             return t1time.isBefore(t2time) ? -1 : 1;
  //           });
  //           setTicketList(res);
  //         },
  //       );
  //     } else {
  //       setTicketList([]);
  //     }
  //   },
  //   [fetch, hospitalId],
  // );

  const serviceSelectNode = (
    <Form.Select
      fluid
      search
      deburr
      clearable
      label="Mũi tiêm"
      loading={getVaccinationServiceLoading}
      value={service?.id ?? ''}
      options={vaccinationServiceList
        .filter((s) => s.injectionObjectId === injectionObjectId)
        .map((s) => ({
          text: `${
            s.serviceTypeId === '4c090002-2a07-4064-2d6f-08d88ab71c2b'
              ? 'Không thu phí'
              : 'Thu phí'
          } - ${s.name}`,
          value: s.id,
        }))}
      onChange={(e, { value }) => {
        setService(vaccinationServiceList.find((s) => s.id === value));
        if (selectedHospital) {
          dispatch(
            getAvailableReceptionDays({
              serviceId: value as string,
              unitId: selectedHospital.id,
            }),
          );
        }
      }}
    />
  );

  const [doctor, setDoctor] = useState<Doctor>();
  const [room, setRoom] = useState<Room>();

  const daySelectNode = (
    <Form.Field
      fluid
      label="Ngày"
      name="availableDay"
      control={DatePicker}
      onChange={(date: Date) => {
        setSelectedDay(date);
        setDoctor(
          availableReceptionDayList.find((d) =>
            moment(d.date).isSame(moment(date), 'date'),
          )?.doctor,
        );
        setRoom(
          availableReceptionDayList.find((d) =>
            moment(d.date).isSame(moment(date), 'date'),
          )?.room,
        );
      }}
      disabled={getAvailableReceptionDayLoading}
      disabledDays={(d: Date) =>
        !(availableReceptionDayList.length === 0
          ? []
          : availableReceptionDayList
        )
          .map((ad) => moment(ad.date).format('YYYY-MM-DD'))
          .includes(moment(d).format('YYYY-MM-DD'))
      }
    />
  );

  const [selectedTicketId, setSelectedTicketId] = useState<
    WorkingCalendarInterval['id']
  >();

  const { onChange } = props;
  const ticketListFiltered = ticketList
    .filter((t) => {
      if (
        moment(selectedDay).isSame(moment(), 'date') &&
        moment().isAfter(moment(t.from, 'hh:mm'))
      ) {
        return null;
      }
      return t;
    })
    .filter((t) => t.intervals.filter((i) => i.isAvailable).length > 0);
  const ticketListNode = (
    <TicketWrapper>
      {(getAvailableReceptionIntervalLoading || loading) && (
        <Dimmer active inverted>
          <Loader inverted />
        </Dimmer>
      )}
      {ticketListFiltered.map((t) => (
        <Label
          color="violet"
          basic={t.id !== selectedTicketId}
          key={t.id}
          onClick={() => {
            setSelectedTicketId(t.id);
            const firstAvailableInterval = t.intervals.find(
              (it) => it.isAvailable,
            );
            const injectionObject = injectionObjectList.find(
              (i) => i.id === injectionObjectId,
            );
            if (
              injectionObject &&
              service &&
              firstAvailableInterval &&
              doctor &&
              room &&
              selectedDay
            ) {
              onChange(
                injectionObject,
                firstAvailableInterval,
                service,
                doctor,
                room,
                selectedDay,
              );
            }
          }}
        >
          {t.from}
        </Label>
      ))}
      {ticketListFiltered.length === 0 &&
        selectedDay &&
        !(getAvailableReceptionIntervalLoading || loading) && (
          <Header
            as="h4"
            color="red"
            content="Lịch trong ngày đã hết, vui lòng chọn ngày khác!"
          />
        )}
    </TicketWrapper>
  );

  return (
    <>
      <Form loading={loading}>
        <Header content="Thông tin lịch hẹn" />
        <Form.Group widths="equal">
          {injectionObjectSelectNode}
          {serviceTypeSelectNode}
        </Form.Group>
        <Form.Group widths="equal">
          {serviceSelectNode}
          {/* {doctorSelectNode} */}
        </Form.Group>
        <Form.Group widths="equal">
          {/* {workingCalendarSelectNode} */}
          {daySelectNode}
        </Form.Group>
      </Form>
      {ticketListNode}
    </>
  );
};

export default ScheduleSection;
