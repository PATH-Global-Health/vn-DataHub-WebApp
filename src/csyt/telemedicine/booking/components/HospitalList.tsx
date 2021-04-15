import React, { useState, useEffect } from 'react';
import { Card, Dimmer, Image, Loader } from 'semantic-ui-react';
import styled from 'styled-components';

import PopupText from '@app/components/PopupText';
import SearchBar, { filterArray } from '@app/components/SearchBar';

import { useSelector, useDispatch } from '@app/hooks';
import { getHospitals, selectHospital } from '../booking.slice';

const SearchWrapper = styled.div`
  margin-bottom: 18px;
`;

const HospitalList: React.FC = () => {
  const dispatch = useDispatch();

  const { hospitalList, getHospitalsLoading } = useSelector(
    (s) => s.csyt.telemedicine.booking,
  );

  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    dispatch(getHospitals());
  }, [dispatch]);

  return (
    <>
      <SearchWrapper>
        <SearchBar size="small" onChange={setSearchValue} />
      </SearchWrapper>
      <Card.Group stackable itemsPerRow={4}>
        <Dimmer inverted active={getHospitalsLoading}>
          <Loader active />
        </Dimmer>
        {filterArray(hospitalList, searchValue).map((h) => (
          <Card key={h.id} onClick={() => dispatch(selectHospital(h.id))}>
            <Image src={h.image} wrapped ui={false} />
            <Card.Content>
              <Card.Header>
                <PopupText content={h.name} />
              </Card.Header>
              <Card.Meta>
                <PopupText content={h.address} />
                <PopupText content={h.phone} />
              </Card.Meta>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </>
  );
};

export default HospitalList;
