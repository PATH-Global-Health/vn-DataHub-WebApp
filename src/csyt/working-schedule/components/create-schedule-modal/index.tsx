import React, { useState, useCallback, useMemo } from 'react';
import {
  Modal,
  Form,
  Header,
  Grid,
  Button,
  // Message,
} from 'semantic-ui-react';

import moment from 'moment';
// import { v4 as uuidv4 } from 'uuid';

import { DatePicker } from '@app/components/date-picker';
import { useAuth, useFetchApi, useSelector } from '@app/hooks';

import ServicePicker from './ServicePicker';
import VaccinationServicePicker from './VaccinationServicePicker';
import ExaminationServicePicker from './ExaminationServicePicker';
import DaysInWeekList, { ScheduleWeekDays } from './DaysInWeekList';
import DoctorRoomList, { DoctorRoom } from './DoctorRoomList';

import {
  DayCreateModel,
  // DoctorStatusMap,
  WorkingCalendarCM,
} from '../../working-schedule.model';
import workingScheduleService from '../../working-schedule.service';

interface DddFormat {
  ddd: string;
  from: string;
  to: string;
}
interface DateList {
  date: string;
  ddd: string;
}
interface Props {
  open: boolean;
  onClose: () => void;
  onCreateFinish: () => void;
}

const CreateScheduleModal: React.FC<Props> = (props) => {
  const { open, onClose, onCreateFinish } = props;
  const { selectedHospital } = useSelector((s) => s.csyt.workingSchedule);

  const [createGroup, setCreateGroup] = useState('');
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [interval, setInterval] = useState(0);
  const [shiftCount, setShiftCount] = useState(1);
  const [limitedDayView, setLimitedDayView] = useState(0);
  const [showAfter, setShowAfter] = useState(0);

  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [daysInWeekList, setDaysInWeekList] = useState<ScheduleWeekDays[]>([]);
  const [doctorRoomList, setDoctorRoomList] = useState<DoctorRoom[]>([]);
  // const [checkedError, setCheckedError] = useState<boolean>(false);
  // const [checkedResponse, setCheckedResponse] = useState<DoctorStatusMap[]>([]);
  const { fetch, fetching } = useFetchApi();

  const handleConfirm = useCallback(async () => {
    const name = createGroup;
    let tmpDayCreateModels: DayCreateModel[] = [];
    const dayCreateModels: DayCreateModel[] = [];
    if (fromDate && toDate) {
      const dateList: DateList[] = [];
      const startOfFromDate = moment(fromDate).startOf('days').clone();
      const startOfToDate = moment(toDate).startOf('days');
      while (startOfFromDate.isSameOrBefore(startOfToDate)) {
        dateList.push({
          date: startOfFromDate.format('YYYY-MM-DD'),
          ddd: startOfFromDate.format('ddd'),
        });
        startOfFromDate.add(1, 'days');
      }
      const selectingDDD: DddFormat[] = [];
      daysInWeekList.map((diw) => {
        if (diw.Mon)
          selectingDDD.push({
            ddd: 'T2',
            from: diw.FromHour,
            to: diw.ToHour,
          });
        if (diw.Tue)
          selectingDDD.push({
            ddd: 'T3',
            from: diw.FromHour,
            to: diw.ToHour,
          });
        if (diw.Wed)
          selectingDDD.push({
            ddd: 'T4',
            from: diw.FromHour,
            to: diw.ToHour,
          });
        if (diw.Thu)
          selectingDDD.push({
            ddd: 'T5',
            from: diw.FromHour,
            to: diw.ToHour,
          });
        if (diw.Fri)
          selectingDDD.push({
            ddd: 'T6',
            from: diw.FromHour,
            to: diw.ToHour,
          });
        if (diw.Sat)
          selectingDDD.push({
            ddd: 'T7',
            from: diw.FromHour,
            to: diw.ToHour,
          });
        if (diw.Sun)
          selectingDDD.push({
            ddd: 'CN',
            from: diw.FromHour,
            to: diw.ToHour,
          });
        return selectingDDD;
      });
      tmpDayCreateModels = selectingDDD.map((s) => ({
        ...s,
        date: dateList.filter((d) => d.ddd === s.ddd).map((d) => d.date),
        ddd: undefined,
      }));

      tmpDayCreateModels.forEach((e) => {
        const existing = dayCreateModels.filter((v) => {
          return v.from === e.from && v.to === e.to;
        });
        if (existing.length) {
          const existingIndex = dayCreateModels.indexOf(existing[0]);
          dayCreateModels[existingIndex].date = [
            ...dayCreateModels[existingIndex].date,
            ...e.date,
          ];
        } else {
          if (typeof e.date === 'string') {
            e.date = [e.date];
          }
          dayCreateModels.push(e);
        }
      });
    }
    const creatingData: WorkingCalendarCM = {
      name,
      bookingBefore: limitedDayView,
      bookingAfter: showAfter,
      interval,
      dayCreateModels,
      doctorRooms: doctorRoomList.map((dr) => ({
        doctorId: dr.Doctor.id,
        roomId: dr.Room.id,
      })),
      services: serviceIds,
      fromDate,
      toDate,
      shiftCount,
      unitId: selectedHospital?.id ?? '',
    };

    // if (fromDate && toDate) {
    // const result = await Promise.all(
    //   doctorRoomList.map((dr) =>
    //     workingScheduleService.checkSchedule(
    //       dr.Doctor.id,
    //       fromDate,
    //       toDate,
    //       dr.Doctor.fullName,
    //     ),
    //   ),
    // );
    // setCheckedResponse(result);
    // if (result.filter((res) => res.status === 200).length > 0) {
    //   setCheckedError(true);
    // } else {
    //   setCheckedError(false);
    await fetch(workingScheduleService.createWorkingCalendar(creatingData));
    onCreateFinish();
    onClose();
    // }
    // }
  }, [
    fetch,
    onClose,
    onCreateFinish,
    serviceIds,
    daysInWeekList,
    doctorRoomList,
    createGroup,
    fromDate,
    toDate,
    interval,
    limitedDayView,
    showAfter,
    shiftCount,
    selectedHospital,
  ]);

  const disableConfirmButton = useMemo((): boolean => {
    if (
      daysInWeekList.length === 0 ||
      doctorRoomList.length === 0 ||
      serviceIds.length === 0 ||
      !createGroup ||
      !fromDate ||
      !toDate
    ) {
      return true;
    }
    return false;
  }, [
    daysInWeekList,
    doctorRoomList,
    serviceIds,
    createGroup,
    fromDate,
    toDate,
  ]);

  const { hasPermission } = useAuth();

  return (
    <>
      <Modal open={open}>
        <Modal.Header content="Tạo lịch trực" />
        <Modal.Content>
          <Form loading={fetching}>
            <Header content="Thông tin" />
            <Form.Group widths="equal">
              <Form.Input
                label="Tên lịch"
                onChange={(e, { value }) => setCreateGroup(value)}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                control={DatePicker}
                label="Ngày bắt đầu"
                onChange={(value: Date) => setFromDate(value)}
              />
              <Form.Field
                control={DatePicker}
                label="Ngày kết thúc"
                onChange={(value: Date) => setToDate(value)}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Input
                label="Thời gian (phút)"
                type="number"
                onChange={(e, { value }) => {
                  setInterval(() => parseInt(value, 10));
                }}
              />
              <Form.Input
                label="Số lần gộp lượt khám"
                type="number"
                value={shiftCount}
                onChange={(e, { value }) => {
                  setShiftCount(() => parseInt(value, 10));
                }}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Input
                label="Cho phép đặt trước (ngày)"
                type="number"
                onChange={(e, { value }) => {
                  setLimitedDayView(() => parseInt(value, 10));
                }}
              />
              <Form.Input
                label="Cho phép đặt sau (ngày)"
                type="number"
                onChange={(e, { value }) => {
                  setShowAfter(() => parseInt(value, 10));
                }}
              />
            </Form.Group>

            {!hasPermission('CSYT_EXAMINATION') && <Header content="Dịch vụ" />}
            {hasPermission('CSYT_EXAMINATION') && (
              <ExaminationServicePicker onChange={setServiceIds} />
            )}
            {!(
              hasPermission('CSYT_VACCINATION') ||
              hasPermission('CSYT_EXAMINATION')
            ) && <ServicePicker onChange={setServiceIds} />}
            {hasPermission('CSYT_VACCINATION') && (
              <VaccinationServicePicker
                onChange={setServiceIds}
                selectedIdList={serviceIds}
              />
            )}

            <Grid columns={2}>
              <Grid.Column>
                <DaysInWeekList onChange={setDaysInWeekList} />
              </Grid.Column>
              <Grid.Column>
                {/* {checkedError && (
                  <Message negative size="tiny">
                    <p>
                      {`Bác sĩ ${checkedResponse
                        .filter((res) => res.status === 200)
                        .map((res) => res.doctorName)
                        .join(', ')} đã có lịch từ trước`}
                    </p>
                  </Message>
                )} */}
                <DoctorRoomList
                  onClearError={() => {}}
                  onChange={setDoctorRoomList}
                />
              </Grid.Column>
            </Grid>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            primary
            content="Xác nhận"
            disabled={disableConfirmButton}
            onClick={handleConfirm}
          />
          <Button content="Huỷ" onClick={onClose} />
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default CreateScheduleModal;
