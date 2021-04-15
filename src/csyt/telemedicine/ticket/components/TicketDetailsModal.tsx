/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Dimmer,
  Grid,
  Header,
  Label,
  Loader,
  Modal,
} from 'semantic-ui-react';
import styled from 'styled-components';

import moment from 'moment';

import InfoRow, { toVND } from '@app/components/InfoRow';
import { useSelector, useDispatch, useFetchApi, useConfirm } from '@app/hooks';

import { selectTicket, getTicketFiles } from '../ticket.slice';

import FilePicker from '../../shared/FilePicker';
import AttachmentList from '../../shared/AttachmentList';
import telemedicineService from '../../shared/telemedicine.service';
import { TicketStatus } from '../../shared/telemedicine.model';

const ActionButtonsWrapper = styled.div`
  margin-top: 8px;
  position: relative;
`;

interface Props {
  onRefresh: () => void;
}

const TicketDetailsModal: React.FC<Props> = (props) => {
  const { onRefresh } = props;

  const dispatch = useDispatch();
  const {
    selectedTicket: data,
    getTicketsLoading,
    selectedTicketFileList,
    getSelectedTicketFilesLoading,
  } = useSelector((s) => s.csyt.telemedicine.ticket);

  const [newFileList, setNewFileList] = useState<File[]>([]);
  useEffect(() => {
    if (data?.Id) {
      dispatch(getTicketFiles(data.Id));
      setNewFileList([]);
    }
  }, [dispatch, data]);

  const statusMap = useSelector((s) => s.csyt.telemedicine.ticket.statusMap);

  const { fetch, fetching } = useFetchApi();

  const confirm = useConfirm();
  const handleUpdate = useCallback(
    (status: number) => {
      if (data) {
        confirm('Xác nhận cập nhật trạng thái?', async () => {
          await fetch(telemedicineService.updateTicket(data.Id, status));
          onRefresh();
        });
      }
    },
    [fetch, data, onRefresh, confirm],
  );

  const { UNFINISHED, CANCELED_BY_CONSUMER } = TicketStatus;
  return (
    <Modal
      open={Boolean(data)}
      onClose={(): void => {
        dispatch(selectTicket(undefined));
      }}
    >
      <Dimmer active={fetching || getTicketsLoading} inverted>
        <Loader inverted />
      </Dimmer>
      <Modal.Header>
        {data && (
          <Label
            basic
            size="large"
            color={statusMap[data.Status].color}
            content={statusMap[data.Status].label}
          />
        )}
      </Modal.Header>
      <Modal.Content>
        {data && (
          <Grid columns={2}>
            <Grid.Row>
              <Grid.Column>
                <Header content="Nơi đặt hẹn" />
                <InfoRow label="Cơ sở" content={data.Name} />
                {data.BookedBy?.From === 'Doctor' && (
                  <InfoRow label="Cán bộ" content={data.BookedBy.Name} />
                )}
              </Grid.Column>
              <Grid.Column>
                <Header content="Nơi nhận hẹn" />
                <InfoRow label="Cơ sở" content={data.Provider.Name} />
                <InfoRow label="Chuyên gia" content={data.Doctor.Name} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Header content="Thông tin lịch hẹn" />
                <InfoRow
                  label="Giờ hẹn"
                  content={`
                  ${data.Schedule.Time.substring(0, 5)}
                  |
                  ${moment(data.Schedule.Date).format('DD-MM-YYYY')}`}
                />
                <InfoRow label="Dịch vụ" content={data.Service.Name} />
                {data.PaymentAmount && (
                  <InfoRow
                    label="Thành tiền"
                    content={`${toVND(data.PaymentAmount)}
                    (Giảm ${
                      data.DiscountType === 1
                        ? `${data.Discount ?? 0}%`
                        : toVND(data.Discount ?? 0)
                    })`}
                  />
                )}
              </Grid.Column>
              <Grid.Column>
                <Header content="Thông tin bệnh nhân" />
                <InfoRow label="Họ tên" content={data.Customer.FullName} />
                {data.Customer.dateOfBirth && (
                  <InfoRow
                    label="Ngày sinh"
                    content={moment(data.Customer.dateOfBirth).format(
                      'DD-MM-YYYY',
                    )}
                  />
                )}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Header content="Thông tin thêm" />
                <InfoRow
                  label="Triệu chứng"
                  content={data.Form?.symptom ?? '...'}
                />
                <InfoRow
                  label="Chẩn đoán"
                  content={data.Form?.diagnosis ?? '...'}
                />
                <InfoRow
                  label="Ghi chú"
                  content={data.Form?.description ?? '...'}
                />
              </Grid.Column>
              <Grid.Column>
                <Header content="Đính kèm" />
                <Dimmer active={getSelectedTicketFilesLoading} inverted>
                  <Loader active />
                </Dimmer>
                <AttachmentList
                  value={selectedTicketFileList.filter((f) => f.Type === 1)}
                />

                {data?.Status === UNFINISHED && !fetching && (
                  <FilePicker value={newFileList} onChange={setNewFileList} />
                )}
                {!fetching && newFileList.length > 0 && (
                  <Button
                    primary
                    content="Xác nhận"
                    onClick={async () => {
                      if (!fetching) {
                        await fetch(
                          telemedicineService.uploadAttachments(
                            data.Id,
                            newFileList,
                            1,
                          ),
                        );
                        await dispatch(getTicketFiles(data.Id));
                        setNewFileList([]);
                      }
                    }}
                  />
                )}

                <Header content="Đính kèm phản hồi" />
                <AttachmentList
                  value={selectedTicketFileList.filter((f) => f.Type === 2)}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}
      </Modal.Content>
      {data?.Status === UNFINISHED && (
        <Modal.Content>
          {newFileList.length === 0 && (
            <ActionButtonsWrapper>
              <Button
                color={statusMap[CANCELED_BY_CONSUMER].color}
                content={statusMap[CANCELED_BY_CONSUMER].label}
                onClick={() => handleUpdate(CANCELED_BY_CONSUMER)}
              />
            </ActionButtonsWrapper>
          )}
        </Modal.Content>
      )}
    </Modal>
  );
};

export default TicketDetailsModal;
