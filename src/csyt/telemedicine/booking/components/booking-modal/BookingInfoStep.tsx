import React, { useMemo } from 'react';
import { Grid } from 'semantic-ui-react';

import moment from 'moment';

import { useSelector } from '@app/hooks';
import InfoRow from '@app/components/InfoRow';

const BookingInfoStep: React.FC = () => {
  const {
    selectedHospital,
    selectedDoctor,
    selectedService,
    selectedDoctorDay,
    doctorFreeSlotList,
    selectedSlotTimeId,
  } = useSelector((s) => s.csyt.telemedicine.booking);

  const ticketTime = useMemo(() => {
    if (doctorFreeSlotList && selectedDoctorDay) {
      const slot = [
        ...doctorFreeSlotList.Morning,
        ...doctorFreeSlotList.Afternoon,
      ].find((s) => s.TimeId === selectedSlotTimeId);
      const time = slot?.From ?? '';
      const date = moment(selectedDoctorDay).format('DD-MM-YYYY');
      return `${time.substring(0, 5)} | ${date}`;
    }
    return '';
  }, [doctorFreeSlotList, selectedDoctorDay, selectedSlotTimeId]);

  return (
    <Grid columns={2}>
      <Grid.Row>
        <Grid.Column>
          <InfoRow label="Thời gian" content={ticketTime} />
          <InfoRow label="Cơ sở" content={selectedHospital?.name ?? ''} />
        </Grid.Column>
        <Grid.Column>
          <InfoRow
            label="Chuyên gia"
            content={selectedDoctor?.FullName ?? ''}
          />
          <InfoRow label="Dịch vụ" content={selectedService?.Name ?? ''} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default React.memo(BookingInfoStep);
