import React, { useCallback, useEffect, useMemo, useState } from 'react';

import moment from 'moment';
import styled from 'styled-components';

import { Dimmer, Grid, Header, Loader } from 'semantic-ui-react';

import { useDispatch } from 'react-redux';

import { useRefreshCallback, useSelector } from '@app/hooks';
import { GroupKey } from '@app/utils/component-tree';
import { getVaccinationStatistic } from '@csyt/vaccination/vaccination.slice';

import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { getStatusColor } from '@app/utils/helpers';

import StatusFilter from '@app/components/schedule-calendar/StatusFilter';
import VaccinationBarChart from './VaccinationBarChart';
import VaccinationPieChart from './VaccinationPieChart';

const StyledGrid = styled(Grid)`
  height: 100%;
`;

const VaccinationStatisticSection: React.FC = () => {
  const dispatch = useDispatch();

  const selectedHospital = useSelector(
    (s) => s.csyt.vaccination.selectedHospital,
  );
  const statisticData = useSelector((s) => s.csyt.vaccination.statisticData);
  const getStatisticLoading = useSelector(
    (s) => s.csyt.vaccination.getStatisticLoading,
  );
  const statusMap = useSelector((s) => s.csyt.vaccination.statusMap);

  const [from, setFrom] = useState<Date>(
    moment().startOf('isoWeek').subtract(7, 'days').toDate(),
  );
  const [to, setTo] = useState<Date>(moment().startOf('isoWeek').toDate());

  const getData = useCallback(() => {
    if (selectedHospital && from && to) {
      dispatch(
        getVaccinationStatistic({ from, to, unitId: selectedHospital.id }),
      );
    }
  }, [dispatch, selectedHospital, from, to]);
  useRefreshCallback(
    GroupKey.CSYT_VACCINATION,
    GroupKey.CSYT_VACCINATION,
    getData,
  );
  useEffect(getData, [getData]);

  const data = useMemo(() => {
    return Object.entries(statisticData || {})
      .filter(([key]) => key !== 'total')
      .filter(([key]) => key !== 'resulted')
      .map(([key, value]) => ({
        key: key.toUpperCase(),
        label: getStatusColor(key.toUpperCase()).label,
        value: value as string,
      }));
  }, [statisticData]);

  const modifiers = { start: from, end: to };
  const handleDayClick = (day: Date) => {
    const { from: fromRange, to: toRange } = DateUtils.addDayToRange(day, {
      from,
      to,
    });
    setFrom(fromRange);
    setTo(toRange);
  };

  const filterList = useMemo(() => <StatusFilter statusMap={statusMap} />, [
    statusMap,
  ]);

  return (
    <StyledGrid>
      <Grid.Row centered>
        <DayPicker
          className="range-picker"
          month={
            new Date(
              parseInt(moment().format('YYYY'), 10),
              parseInt(moment().format('MM'), 10) - 3,
            )
          }
          numberOfMonths={3}
          selectedDays={[from, { from, to }]}
          modifiers={modifiers}
          onDayClick={handleDayClick}
        />
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={6} textAlign="right">
          <Header>
            Tổng:
            {statisticData?.total}
          </Header>
        </Grid.Column>
        <Grid.Column width={10}>{filterList}</Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={12}>
          <Dimmer active={getStatisticLoading} inverted>
            <Loader />
          </Dimmer>
          <VaccinationBarChart data={data} />
        </Grid.Column>
        <Grid.Column width={4}>
          <Dimmer active={getStatisticLoading} inverted>
            <Loader />
          </Dimmer>
          <VaccinationPieChart data={data} />
        </Grid.Column>
      </Grid.Row>
    </StyledGrid>
  );
};

export default VaccinationStatisticSection;
