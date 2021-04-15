import React, { useEffect, useMemo } from 'react';
import { Breadcrumb, BreadcrumbSectionProps } from 'semantic-ui-react';
import { FiChevronRight } from 'react-icons/fi';
import styled from 'styled-components';

import { useSelector, useDispatch } from '@app/hooks';
import { selectHospital } from '@csyt/vaccination/vaccination.slice';

import VaccinationHospitalTable from '../VaccinationHospitalTable';
import VaccinationStatisticSection from './VaccinationStatisticSection';

const StyledChevronRight = styled(FiChevronRight)`
  vertical-align: bottom !important;
`;
const BreadcrumbWrapper = styled.div`
  margin-bottom: 8px;
`;
const VaccinationStatisticPage: React.FC = () => {
  const { selectedHospital } = useSelector((state) => state.csyt.vaccination);

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
        content: 'Thống kê tiêm chủng',
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
      {!selectedHospital && <VaccinationHospitalTable />}
      {selectedHospital && <VaccinationStatisticSection />}
    </>
  );
};

export default VaccinationStatisticPage;
