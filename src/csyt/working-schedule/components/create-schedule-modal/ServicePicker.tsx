import React from 'react';
import { Select } from 'semantic-ui-react';
import styled from 'styled-components';

import { useSelector } from '@app/hooks';

const Wrapper = styled.div`
  margin-bottom: 32px;
`;

interface Props {
  onChange: (serviceIds: string[]) => void;
}

const ServicePicker: React.FC<Props> = (props) => {
  const { onChange } = props;
  const { serviceList, getServicesLoading } = useSelector(
    (state) => state.csyt.catalog.service,
  );

  return (
    <Wrapper>
      <Select
        fluid
        search
        deburr
        multiple
        loading={getServicesLoading}
        options={serviceList.map((s) => ({ text: s.name, value: s.id }))}
        onChange={(e, { value }): void => onChange(value as string[])}
      />
    </Wrapper>
  );
};

export default ServicePicker;
