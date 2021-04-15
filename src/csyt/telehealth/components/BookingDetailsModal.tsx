/* eslint-disable no-underscore-dangle */
import React, { useState, useCallback } from 'react';
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
import { selectTelehealthSchedule } from '../telehealth.slice';
import { TelehealthStatus } from '../telehealth.model';
import telehealthService from '../telehealth.service';

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
  const { selectedSchedule: data, getTelehealthSchedulesLoading } = useSelector(
    (s) => s.csyt.telehealth,
  );

  const { FINISHED, CANCELED } = TelehealthStatus;
  const statusMap = useSelector((s) => s.csyt.telehealth.statusMap);

  const { fetch, fetching } = useFetchApi();

  const confirm = useConfirm();
  const [note, setNote] = useState('');
  const handleUpdate = useCallback(
    (status: number) => {
      if (data) {
        confirm('Xác nhận cập nhật trạng thái?', async () => {
          await fetch(
            telehealthService.updateTelehealthSchedule(data.id, status, note),
          );
          onRefresh();
        });
      }
    },
    [fetch, data, onRefresh, note, confirm],
  );

  return (
    <Modal
      open={Boolean(data)}
      onClose={(): void => {
        dispatch(selectTelehealthSchedule(undefined));
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
                  content={moment(data.date).format('hh:mm | DD-MM-YYYY')}
                />
                <InfoRow label="Cán bộ" content={data.doctor.fullname} />
                <InfoRow label="Buồng/Phòng" content={data.room.name} />
                <InfoRow label="Ghi chú" content={data.note} />
              </Grid.Column>
              <Grid.Column>
                <Header content="Thông tin người được tư vấn sức khỏe từ xa" />
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
                  label="Hộ chiếu"
                  content={data.customer?.passportNumber ?? '...'}
                />
                <InfoRow
                  label="Quốc tịch"
                  content={data.customer?.nation ?? '...'}
                />
                <InfoRow label="Địa chỉ" content={data.customer.address} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}
      </Modal.Content>
      {data?.status === TelehealthStatus.UNFINISHED && (
        <Modal.Content>
          {!getTelehealthSchedulesLoading && (
            <Form>
              <Form.TextArea
                label="Ghi chú"
                disabled={fetching}
                onChange={(e, { value }) => setNote(value as string)}
              />
            </Form>
          )}
          {!getTelehealthSchedulesLoading && (
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
            </ActionButtonsWrapper>
          )}
        </Modal.Content>
      )}
    </Modal>
  );
};

export default BookingDetailsModal;
