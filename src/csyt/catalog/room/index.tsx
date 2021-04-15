import React, { useEffect, useMemo } from 'react';
import { Breadcrumb, BreadcrumbSectionProps } from 'semantic-ui-react';
import { FiChevronRight } from 'react-icons/fi';
import styled from 'styled-components';

import { useSelector, useDispatch } from '@app/hooks';
import { getUnitTypes } from '@admin/manage-account/slices/unit-type';
import { selectHospital } from './room.slice';

import RoomTable from './RoomTable';
import HospitalTable from './HospitalTable';

const StyledChevronRight = styled(FiChevronRight)`
  vertical-align: bottom !important;
`;
const BreadcrumbWrapper = styled.div`
  margin-bottom: 8px;
`;

const RoomPage: React.FC = () => {
  const { selectedHospital } = useSelector((state) => state.csyt.catalog.room);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(selectHospital(undefined));
    dispatch(getUnitTypes());
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
        content: 'Phòng/Buồng',
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
      {!selectedHospital && <HospitalTable />}
      {selectedHospital && <RoomTable />}
    </>
  );
};

export default RoomPage;
