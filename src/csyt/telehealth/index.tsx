import React, { useEffect, useMemo } from 'react';
import { Breadcrumb, BreadcrumbSectionProps } from 'semantic-ui-react';
import { FiChevronRight } from 'react-icons/fi';
import styled from 'styled-components';

import { useSelector, useDispatch } from '@app/hooks';

import { selectHospital } from './telehealth.slice';
import BookingTelehealth from './components/BookingTelehealth';
import TelehealthHospitalTable from './components/TelehealthHospitalTable';

const StyledChevronRight = styled(FiChevronRight)`
  vertical-align: bottom !important;
`;
const BreadcrumbWrapper = styled.div`
  margin-bottom: 8px;
`;
const TelehealthPage: React.FC = () => {
  const { selectedHospital } = useSelector((state) => state.csyt.telehealth);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(selectHospital(undefined));
  }, [dispatch]);

  const sections = useMemo((): BreadcrumbSectionProps[] => {
    const bc: BreadcrumbSectionProps[] = [
      {
        key: 0,
        content: !selectedHospital ? 'Cơ sở' : selectedHospital.name,
        active: !selectedHospital,
        onClick: (): void => {
          dispatch(selectHospital(undefined));
        },
      },
    ];

    if (selectedHospital) {
      bc.push({
        key: 1,
        content: 'Lịch hẹn tư vấn sức khỏe từ xa',
        active: true,
      });
    }

    return bc;
  }, [dispatch, selectedHospital]);

  return (
    <>
      <BreadcrumbWrapper>
        <Breadcrumb sections={sections} icon={<StyledChevronRight />} />
      </BreadcrumbWrapper>
      {!selectedHospital && <TelehealthHospitalTable />}
      {selectedHospital && <BookingTelehealth />}
    </>
  );
};

export default TelehealthPage;
