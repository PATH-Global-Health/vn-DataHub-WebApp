import React from 'react';
import { Dimmer, List, Loader } from 'semantic-ui-react';
import { FiDownload, FiImage } from 'react-icons/fi';
import styled from 'styled-components';

import PopupText from '@app/components/PopupText';
import { useFetchApi } from '@app/hooks';

import telemedicineService from './telemedicine.service';
import { TicketFile } from './telemedicine.model';

const StyledList = styled(List)`
  position: relative;
`;
const StyledItem = styled(List.Item)`
  display: flex !important;
  position: relative;
  & svg {
    font-size: 20px;
    min-width: 20px;
    margin-right: 10px;
  }
  & .content {
    overflow: hidden;
  }
`;

interface Props {
  value: TicketFile[];
}

const AttachmentList: React.FC<Props> = (props) => {
  const { value } = props;

  const { fetch, fetching } = useFetchApi();

  return value.length > 0 ? (
    <StyledList>
      <Dimmer active={fetching} inverted>
        <Loader active size="mini" />
      </Dimmer>
      {value.map((f) => (
        <StyledItem key={f.Id}>
          <FiDownload
            onClick={() => {
              fetch(telemedicineService.downloadAttachment(f.Id, f.Name));
            }}
          />
          <FiImage />
          <List.Content content={<PopupText content={f.Name} />} />
        </StyledItem>
      ))}
    </StyledList>
  ) : (
    <p>Không có đính kèm</p>
  );
};

export default React.memo(AttachmentList);
