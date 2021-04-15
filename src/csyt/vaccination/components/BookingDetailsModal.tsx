/* eslint-disable no-underscore-dangle */
import React, { useState, useMemo, useCallback } from 'react';
import {
  Button,
  Dimmer,
  Form,
  Grid,
  Header,
  Label,
  Loader,
  Modal,
} from 'semantic-ui-react';
import styled from 'styled-components';

import moment from 'moment';

import InfoRow from '@app/components/InfoRow';

import { useSelector, useDispatch, useFetchApi, useConfirm } from '@app/hooks';
import { selectVaccinationSchedule } from '../vaccination.slice';
import { VaccinationStatus } from '../vaccination.model';
import vaccinationService from '../vaccination.service';
import TransferSection from './TransferSection';

const ActionButtonsWrapper = styled.div`
  margin-top: 8px;
  position: relative;
`;

interface Props {
  onRefresh: () => void;
}

const BookingDetailsModal: React.FC<Props> = (props) => {
  const { onRefresh } = props;

  const dispatch = useDispatch();
  const {
    selectedSchedule: data,
    getVaccinationSchedulesLoading,
    vaccinationServiceList,
  } = useSelector((s) => s.csyt.vaccination);
  // const sList = useSelector((s) => s.csyt.catalog.service.serviceList);
  // const injectionObjectLabel = useMemo(() => {
  //   if (data) {
  //     return (
  //       sList.find((s) => s.id === data.service?.id)?.InjectionObject?.Name ??
  //       ''
  //     );
  //   }
  //   return '';
  // }, [data, sList]);

  const { FINISHED, CANCELED, TRANSFERRED } = VaccinationStatus;
  const statusMap = useSelector((s) => s.csyt.vaccination.statusMap);

  const { fetch, fetching } = useFetchApi();

  const [reselectService, setReselectService] = useState(false);
  const { serviceList, getServicesLoading } = useSelector(
    (s) => s.csyt.catalog.service,
  );
  const { injectionObjectList, getInjectionObjectsLoading } = useSelector(
    (s) => s.csyt.vaccination,
  );
  const [injectionObjectId, setInjectionObjectId] = useState<number>();
  const injectionObjectSelect = (
    <Form.Select
      search
      deburr
      label="Đối tượng"
      className="m-0 m-t-2"
      options={injectionObjectList.map((io) => ({
        text: io.name,
        value: io.id,
      }))}
      // set value cho khỏi báo warning
      value={injectionObjectId}
      onChange={(e, { value }) => setInjectionObjectId(value as number)}
    />
  );

  const [serviceId, setServiceId] = useState<string>();
  const serviceSelect = (
    <Form.Select
      search
      deburr
      label="Mũi tiêm"
      className="m-0 m-t-2"
      options={vaccinationServiceList.map((s) => ({
        text: s.name,
        value: s.id,
      }))}
      onChange={(e, { value }) => setServiceId(value as string)}
    />
  );

  const reselectActionsNode = (
    <ActionButtonsWrapper>
      <Button
        positive
        size="mini"
        content="Xác nhận"
        onClick={async () => {
          const sv = vaccinationServiceList.find((s) => s.id === serviceId);
          if (data && sv) {
            await fetch(
              vaccinationService.update(
                data.id,
                VaccinationStatus.UNFINISHED,
                '',
              ),
            );
            onRefresh();
          }
          setReselectService(false);
        }}
      />
      <Button
        size="mini"
        content="Huỷ"
        onClick={() => setReselectService(false)}
      />
    </ActionButtonsWrapper>
  );

  const serviceGuid = useMemo(
    () => serviceList.find((s) => s.id === data?.service.id)?.id ?? '',
    [serviceList, data],
  );

  const confirm = useConfirm();
  const [note, setNote] = useState('');
  const handleUpdate = useCallback(
    (status: number) => {
      if (data) {
        confirm('Xác nhận cập nhật trạng thái?', async () => {
          await fetch(vaccinationService.update(data.id, status, note));
          onRefresh();
        });
      }
    },
    [
      fetch,
      data,
      onRefresh,
      note,
      confirm,
      // serviceGuid,
    ],
  );

  const [openTransfer, setOpenTransfer] = useState(false);
  const transferNode = useMemo(
    () => (
      <>
        {data && openTransfer && (
          <TransferSection
            customerId={data.customer.id}
            referenceId={data.id}
            contactInfo={data.contacts}
            serviceId={data.service.id}
            serviceGuid={serviceGuid}
            serviceName={data.service.name}
            onRefresh={() => {
              setOpenTransfer(false);
              onRefresh();
            }}
            onClose={() => setOpenTransfer(false)}
          />
        )}
      </>
    ),
    [data, openTransfer, onRefresh, serviceGuid],
  );

  return (
    <Modal
      open={Boolean(data)}
      onClose={(): void => {
        dispatch(selectVaccinationSchedule(undefined));
      }}
    >
      <Modal.Header>
        {data && (
          <Label
            basic
            size="large"
            color={statusMap[data.status].color}
            content={`${data.interval.numId} - ${statusMap[data.status].label}`}
          />
        )}
      </Modal.Header>
      <Modal.Content>
        {data && (
          <Grid columns={2}>
            <Grid.Row>
              <Grid.Column>
                <Header content="Thông tin lịch hẹn" />
                <InfoRow
                  label="Giờ hẹn"
                  content={`
                  ${data.interval.from}
                  |
                  ${moment(data.date).format('DD-MM-YYYY')}`}
                />
                {!reselectService && (
                  <div>
                    {getVaccinationSchedulesLoading && (
                      <Dimmer active inverted>
                        <Loader inverted />
                      </Dimmer>
                    )}
                    {/* <InfoRow label="Đối tượng" content={injectionObjectLabel} /> */}
                    <InfoRow label="Mũi tiêm" content={data.service.name} />
                  </div>
                )}
                {reselectService && (
                  <Form
                    size="tiny"
                    loading={
                      fetching ||
                      getInjectionObjectsLoading ||
                      getServicesLoading ||
                      getVaccinationSchedulesLoading
                    }
                  >
                    {injectionObjectSelect}
                    {serviceSelect}
                    {reselectActionsNode}
                  </Form>
                )}
                <InfoRow label="Cán bộ" content={data.doctor.fullname} />
                <InfoRow label="Buồng/Phòng" content={data.room.name} />
                <InfoRow label="Ghi chú" content={data.note} />
              </Grid.Column>
              <Grid.Column>
                <Header content="Thông tin người được tiêm" />
                <InfoRow label="Họ tên" content={data.customer.fullname} />
                <InfoRow
                  label="Ngày sinh"
                  content={
                    data.customer.birthDate
                      ? moment(data.customer.birthDate).format('DD-MM-YYYY')
                      : ''
                  }
                />
                <InfoRow
                  label="Địa chỉ"
                  content={data.customer.address ?? ''}
                />
                <Header content="Thông tin người liên hệ" />
                {data.contacts?.map((c) => (
                  <React.Fragment key={`${c.phone}-${c.fullname}`}>
                    <InfoRow label="Họ tên" content={c.fullname} />
                    <InfoRow label="SĐT" content={c.phone} />
                    <InfoRow label="Mối quan hệ" content={c.relationship} />
                  </React.Fragment>
                ))}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}
      </Modal.Content>
      {data?.status === VaccinationStatus.UNFINISHED && (
        <Modal.Content>
          {!(
            reselectService ||
            getVaccinationSchedulesLoading ||
            openTransfer
          ) && (
            <Form>
              <Form.TextArea
                label="Ghi chú"
                disabled={fetching}
                onChange={(e, { value }) => setNote(value as string)}
              />
            </Form>
          )}
          {!(
            reselectService ||
            getVaccinationSchedulesLoading ||
            openTransfer
          ) && (
            <ActionButtonsWrapper>
              <Dimmer active={fetching} inverted>
                <Loader inverted />
              </Dimmer>
              <Button
                color={statusMap[FINISHED].color}
                content={statusMap[FINISHED].label}
                onClick={() => handleUpdate(FINISHED)}
              />
              <Button
                color={statusMap[CANCELED].color}
                content={statusMap[CANCELED].label}
                onClick={() => handleUpdate(CANCELED)}
              />
              <Button
                disabled
                color="yellow"
                content="Đổi mũi tiêm"
                onClick={() => setReselectService(true)}
              />
              <Button
                disabled
                color={statusMap[TRANSFERRED].color}
                content={statusMap[TRANSFERRED].label}
                onClick={() => setOpenTransfer(true)}
              />
            </ActionButtonsWrapper>
          )}

          {transferNode}
        </Modal.Content>
      )}
    </Modal>
  );
};

export default BookingDetailsModal;
