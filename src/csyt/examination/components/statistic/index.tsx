import React, { useEffect, useMemo } from 'react';
import { Breadcrumb, BreadcrumbSectionProps } from 'semantic-ui-react';
import { FiChevronRight } from 'react-icons/fi';
import styled from 'styled-components';

import { useSelector, useDispatch } from '@app/hooks';
import { selectHospital } from '@csyt/examination/examination.slice';

import ExaminationHospitalTable from '../ExaminationHospitalTable';
import ExaminationStatisticSection from './ExaminationStatisticSection';

const StyledChevronRight = styled(FiChevronRight)`
  vertical-align: bottom !important;
`;
const BreadcrumbWrapper = styled.div`
  margin-bottom: 8px;
`;
const ExaminationStatisticPage: React.FC = () => {
  const { selectedHospital } = useSelector((state) => state.csyt.examination);

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
        content: 'Thống kê xét nghiệm',
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
      {!selectedHospital && <ExaminationHospitalTable />}
      {selectedHospital && <ExaminationStatisticSection />}
    </>
  );
};

export default ExaminationStatisticPage;
