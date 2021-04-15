import React, { useState, useEffect } from 'react';

import { Button, Form, Label } from 'semantic-ui-react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import styled from 'styled-components';

import DataList from '@app/components/data-list';
import { useSelector } from '@app/hooks';

import { Doctor } from '../../../catalog/doctor/doctor.model';
import { Room } from '../../../catalog/room/room.model';

const AddWrapper = styled.div`
  margin-top: 18px;
`;

export interface DoctorRoom {
  Doctor: Doctor;
  Room: Room;
}

interface Props {
  onChange: (data: DoctorRoom[]) => void;
  onClearError: () => void;
}

const DoctorRoomList: React.FC<Props> = (props) => {
  const { onClearError, onChange } = props;

  const { doctorList, getDoctorsLoading } = useSelector(
    (state) => state.csyt.catalog.doctor,
  );
  const { roomList, getRoomsLoading } = useSelector(
    (state) => state.csyt.catalog.room,
  );

  const [adding, setAdding] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>();
  const [selectedRoom, setSelectedRoom] = useState<Room>();
  const [data, setData] = useState<DoctorRoom[]>([]);
  useEffect(() => {
    onChange(data);
  }, [onChange, data]);

  return (
    <>
      <DataList
        title="Cán bộ - Phòng/Buồng"
        data={data}
        loading={getDoctorsLoading || getRoomsLoading}
        getRowKey={(r): string => `${r.Doctor?.id}-${r.Room?.id}`}
        itemHeaderRender={(r): string => r.Doctor?.fullName ?? ''}
        itemContentRender={(r): string => r.Room?.name ?? ''}
        listActions={[
          {
            color: 'green',
            icon: <FiPlus />,
            title: 'Thêm',
            onClick: (): void => {
              setAdding(true);
            },
          },
        ]}
        itemActions={[
          {
            color: 'red',
            icon: <FiTrash2 />,
            title: 'Xoá',
            onClick: (r): void => {
              onClearError();
              setData((d) =>
                d.filter(
                  (e) =>
                    e.Doctor?.id !== r.Doctor?.id && e.Room?.id !== r.Room?.id,
                ),
              );
            },
          },
        ]}
      />

      {data.length === 0 && !adding && (
        <Label basic color="violet" pointing>
          Vui lòng chọn cán bộ và phòng/buồng
        </Label>
      )}

      {adding && (
        <AddWrapper>
          <Form.Select
            search
            label="Cán bộ"
            options={doctorList.map((d) => ({ text: d.fullName, value: d.id }))}
            onChange={(e, { value }): void => {
              const selected = doctorList.find((d) => d.id === value);
              setSelectedDoctor(selected);
            }}
          />
          <Form.Select
            search
            label="Phòng/Buồng"
            options={roomList.map((d) => ({ text: d.name, value: d.id }))}
            onChange={(e, { value }): void => {
              const selected = roomList.find((r) => r.id === value);
              setSelectedRoom(selected);
            }}
          />
          <Button
            primary
            content="Thêm"
            disabled={!selectedDoctor || !selectedRoom}
            onClick={(): void => {
              const existed = data.find(
                (d) =>
                  d.Doctor?.id === selectedDoctor?.id &&
                  d.Room?.id === selectedRoom?.id,
              );
              if (!existed && selectedDoctor && selectedRoom) {
                setData((d) => [
                  ...d,
                  { Doctor: selectedDoctor, Room: selectedRoom },
                ]);
              }
              setAdding(false);
              setSelectedDoctor(undefined);
              setSelectedRoom(undefined);
            }}
          />
          <Button
            content="Huỷ"
            onClick={(): void => {
              setAdding(false);
              setSelectedDoctor(undefined);
              setSelectedRoom(undefined);
            }}
          />
        </AddWrapper>
      )}
    </>
  );
};

export default DoctorRoomList;
