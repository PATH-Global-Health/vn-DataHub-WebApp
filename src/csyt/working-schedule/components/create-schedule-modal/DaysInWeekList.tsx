import React, { useState, useEffect } from 'react';
import { Checkbox, Grid, Button, Form, Label } from 'semantic-ui-react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import styled from 'styled-components';

import { v4 as uuidv4 } from 'uuid';

import DataList from '@app/components/data-list';

const AddWeekDayWrapper = styled.div`
  padding-right: 18px;
`;

const weekDayMap = {
  Mon: 'T2',
  Tue: 'T3',
  Wed: 'T4',
  Thu: 'T5',
  Fri: 'T6',
  Sat: 'T7',
  Sun: 'CN',
};
type WeekDayMap = typeof weekDayMap;

export interface ScheduleWeekDays {
  Id: string;
  Mon: boolean;
  Tue: boolean;
  Wed: boolean;
  Thu: boolean;
  Fri: boolean;
  Sat: boolean;
  Sun: boolean;
  FromHour: string;
  ToHour: string;
}

const getHeader = (data: ScheduleWeekDays): string => {
  const days: string[] = [];

  Object.keys(data).forEach((field) => {
    if (data[field as keyof ScheduleWeekDays] === true) {
      const dayLabel = weekDayMap[field as keyof WeekDayMap]; // lmao boi
      days.push(dayLabel);
    }
  });

  return days.join(' | ');
};

interface Props {
  onChange: (data: ScheduleWeekDays[]) => void;
}

const DaysInWeekList: React.FC<Props> = (props) => {
  const { onChange } = props;

  const [adding, setAdding] = useState<ScheduleWeekDays>();
  const [data, setData] = useState<ScheduleWeekDays[]>([]);
  useEffect(() => {
    onChange(
      data.map((d) => {
        const tmp = { ...d };
        delete tmp.Id;
        return tmp;
      }),
    );
  }, [onChange, data]);

  return (
    <>
      <DataList
        title="Lịch trong tuần"
        data={data}
        getRowKey={(r): string => r.Id}
        itemHeaderRender={(r): string => getHeader(r)}
        itemContentRender={(r): string => `${r.FromHour} -> ${r.ToHour}`}
        listActions={[
          {
            color: 'green',
            icon: <FiPlus />,
            title: 'Thêm',
            onClick: (): void => {
              setAdding({
                Id: uuidv4(),
                FromHour: '',
                ToHour: '',
                Mon: false,
                Tue: false,
                Wed: false,
                Thu: false,
                Fri: false,
                Sat: false,
                Sun: false,
              });
            },
          },
        ]}
        itemActions={[
          {
            color: 'red',
            icon: <FiTrash2 />,
            title: 'Xoá',
            onClick: (r): void => {
              setData((d) => d.filter((e) => e.Id !== r.Id));
            },
          },
        ]}
      />

      {data.length === 0 && !adding && (
        <Label basic color="violet" pointing>
          Vui lòng chọn ngày trong tuần
        </Label>
      )}

      {adding && (
        <AddWeekDayWrapper>
          <Grid padded>
            <Grid.Row>
              <Grid.Column textAlign="left" width={4}>
                {Object.keys(weekDayMap).map((d) => (
                  <Checkbox
                    key={d}
                    label={weekDayMap[d as keyof WeekDayMap]}
                    checked={adding[d as keyof ScheduleWeekDays] as boolean}
                    onChange={(e, { checked }): void => {
                      setAdding({
                        ...adding,
                        [d as keyof ScheduleWeekDays]: checked,
                      });
                    }}
                  />
                ))}
              </Grid.Column>
              <Grid.Column width={12}>
                <Form.Input
                  label="Thời gian bắt đầu"
                  type="time"
                  onChange={(e, { value }): void => {
                    setAdding({ ...adding, FromHour: value });
                  }}
                />
                <Form.Input
                  label="Thời gian kết thúc"
                  type="time"
                  onChange={(e, { value }): void => {
                    setAdding({ ...adding, ToHour: value });
                  }}
                />
              </Grid.Column>
            </Grid.Row>
            <Button
              primary
              content="Thêm"
              onClick={(): void => {
                setData((d) => [...d, adding]);
                setAdding(undefined);
              }}
              disabled={
                !Object.values(adding).some((day) => day === true) ||
                adding.FromHour === '' ||
                adding.ToHour === ''
              }
            />
            <Button content="Huỷ" onClick={(): void => setAdding(undefined)} />
          </Grid>
        </AddWeekDayWrapper>
      )}
    </>
  );
};

export default DaysInWeekList;
