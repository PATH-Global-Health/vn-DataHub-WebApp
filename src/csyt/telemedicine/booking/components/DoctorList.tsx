import React, { useState, useEffect } from 'react';
import { Button, Dimmer, Grid, Loader } from 'semantic-ui-react';
import { FiArrowLeft } from 'react-icons/fi';
import styled from 'styled-components';

import SearchBar, { filterArray } from '@app/components/SearchBar';

import { useSelector, useDispatch } from '@app/hooks';
import { getDoctors, selectDoctor, selectHospital } from '../booking.slice';
import DoctorCard from './DoctorCard';

const BackButtonWrapper = styled.div`
  margin-bottom: 18px;
  display: flex;
  & div.title,
  div.input {
    height: 100% !important;
  }
`;

const DoctorList: React.FC = () => {
  const {
    //
    selectedHospital,
    doctorList,
    getDoctorsLoading,
  } = useSelector((s) => s.csyt.telemedicine.booking);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedHospital) {
      dispatch(getDoctors(selectedHospital.id));
    }
  }, [dispatch, selectedHospital]);

  const [searchValue, setSearchValue] = useState('');

  return (
    <>
      <BackButtonWrapper>
        <Button
          basic
          animated="vertical"
          onClick={() => dispatch(selectHospital(undefined))}
        >
          <Button.Content visible content={<FiArrowLeft />} />
          <Button.Content hidden content="Cơ sở" />
        </Button>
        <SearchBar size="small" onChange={setSearchValue} />
      </BackButtonWrapper>
      <Grid columns={4}>
        <Grid.Row>
          <Dimmer inverted active={getDoctorsLoading}>
            <Loader active />
          </Dimmer>
          {filterArray(doctorList, searchValue).map((d) => (
            <Grid.Column key={d.Id}>
              <DoctorCard
                key={d.Id}
                fullName={d.FullName}
                academicDegree={d.AcademicDegree ?? ''}
                email={d.Email ?? ''}
                phone={d.Phone ?? ''}
                onClick={() => dispatch(selectDoctor(d.Id))}
              />
            </Grid.Column>
          ))}
        </Grid.Row>
      </Grid>
    </>
  );
};

export default DoctorList;
