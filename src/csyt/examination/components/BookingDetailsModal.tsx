/* eslint-disable no-underscore-dangle */
import React, { useState, useCallback, useMemo, useRef } from 'react';
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
import { selectExaminationSchedule } from '../examination.slice';
import { ExaminationStatus } from '../examination.model';
import examinationService from '../examination.service';

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
    getExaminationSchedulesLoading,
  } = useSelector((s) => s.csyt.examination);

  const { FINISHED, CANCELED } = ExaminationStatus;
  const statusMap = useSelector((s) => s.csyt.examination.statusMap);

  const { fetch, fetching } = useFetchApi();

  const confirm = useConfirm();
  const [note, setNote] = useState('');
  const [resultDate, setResultDate] = useState<string>();
  const [result, setResult] = useState<string>();

  const handleUpdate = useCallback(
    (status: number) => {
      if (data) {
        confirm('Xác nhận cập nhật trạng thái?', async () => {
          await fetch(
            examinationService.updateExaminationSchedule(data.id, status, note),
          );
          onRefresh();
        });
      }
    },
    [fetch, data, onRefresh, note, confirm],
  );

  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File>();
  const handleUpload = useCallback(() => {
    const fetchData = async () => {
      if (
        selectedFile &&
        data &&
        (data?.status === ExaminationStatus.RESULTED ||
          (data?.status === ExaminationStatus.FINISHED && resultDate && result))
      ) {
        const formData = new FormData();
        if (
          data?.status === ExaminationStatus.FINISHED &&
          resultDate &&
          result
        ) {
          formData.append('ResultDate', resultDate);
          formData.append('Result', result);
        }
        formData.append('ExamId', data.id);
        formData.append('FormData', selectedFile);
        await fetch(
          data?.status === ExaminationStatus.RESULTED
            ? examinationService.updateResultForm(formData)
            : examinationService.createResultForm(formData),
        );
        setSelectedFile(undefined);
        dispatch(selectExaminationSchedule(undefined));
        onRefresh();
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [fetch, selectedFile, resultDate, result]);
  const disabled = useMemo(
    () =>
      Boolean(
        (data?.status === ExaminationStatus.FINISHED &&
          (!result || !resultDate)) ||
          !selectedFile,
      ),
    [data, result, resultDate, selectedFile],
  );

  return (
    <Modal
      open={Boolean(data)}
      onClose={(): void => {
        dispatch(selectExaminationSchedule(undefined));
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
                <InfoRow label="Cán bộ" content={data.doctor.fullname} />
                <InfoRow label="Buồng/Phòng" content={data.room.name} />
                <InfoRow label="Ghi chú" content={data.note} />
              </Grid.Column>
              <Grid.Column>
                <Header content="Thông tin người được xét nghiệm" />
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
                <Header content="Thông tin xuất cảnh" />
                <InfoRow
                  label="Nơi đến"
                  content={data.exitInformation.destination}
                />
                <InfoRow
                  label="Thời gian xuất cảnh"
                  content={moment(data.exitInformation.exitingDate).format(
                    'hh:mm | DD-MM-YYYY',
                  )}
                />
                <InfoRow
                  label="Thời gian nhập cảnh"
                  content={moment(data.exitInformation.entryingDate).format(
                    'hh:mm | DD-MM-YYYY',
                  )}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}
      </Modal.Content>
      {data?.status === ExaminationStatus.UNFINISHED && (
        <Modal.Content>
          {!getExaminationSchedulesLoading && (
            <Form>
              <Form.TextArea
                label="Ghi chú"
                disabled={fetching}
                onChange={(e, { value }) => setNote(value as string)}
              />
            </Form>
          )}
          {!getExaminationSchedulesLoading && (
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
      <Modal.Content>
        <Form>
          {data?.status === ExaminationStatus.FINISHED && (
            <Form.Group widths="equal">
              <Form.Input
                required
                type="datetime-local"
                label="Ngày có kết quả"
                onChange={(_, { value }) => setResultDate(value)}
              />
              <Form.Select
                fluid
                required
                label="Kết quả"
                options={['Dương tính', 'Âm tính'].map((e) => ({
                  text: e,
                  value: e,
                }))}
                onChange={(_, { value: v }) => setResult(v as string)}
              />
            </Form.Group>
          )}
          {(data?.status === ExaminationStatus.FINISHED ||
            data?.status === ExaminationStatus.RESULTED) && (
            <>
              <Form.Group>
                <Form.Button
                  required
                  label="File kết quả"
                  color="blue"
                  content="Chọn File"
                  onClick={(e) => {
                    e.preventDefault();
                    if (fileRef?.current) {
                      fileRef.current.click();
                    }
                  }}
                />
                <Header as="h5">{selectedFile?.name}</Header>
              </Form.Group>
              <input
                hidden
                required
                type="file"
                ref={fileRef}
                accept="application/pdf,application/vnd.ms-excel"
                onChange={(e) => {
                  if (e.target !== null && e.target.files !== null) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />
              <Form.Button
                primary
                loading={fetching}
                disabled={disabled || fetching}
                content="Xác nhận"
                onClick={handleUpload}
              />
            </>
          )}
        </Form>
      </Modal.Content>
      {/* {data?.status === ExaminationStatus.RESULTED && (
        <Modal.Content>
          <ActionButtonsWrapper>
            <Dimmer active={fetching} inverted>
              <Loader inverted />
            </Dimmer>
            <Input
              type="file"
              accept="application/pdf,application/vnd.ms-excel"
              onChange={(e) => {
                if (e.target !== null && e.target.files !== null) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
            />
          </ActionButtonsWrapper>
        </Modal.Content>
      )} */}
    </Modal>
  );
};

export default BookingDetailsModal;
