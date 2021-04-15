import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import { FiUser } from 'react-icons/fi';
import styled from 'styled-components';

import PopupText from '@app/components/PopupText';

const StyledCard = styled(Card)`
  & .image {
    text-align: center;
    font-size: 140px;
    color: #000;
  }
`;

interface Props {
  fullName: string;
  academicDegree: string;
  email: string;
  phone: string;
  onClick?: () => void;
}

const DoctorCard: React.FC<Props> = (props) => {
  const { fullName, academicDegree, email, phone, onClick } = props;
  return (
    <StyledCard onClick={onClick}>
      <Image wrapped ui={false} content={<FiUser />} />
      <Card.Content>
        <Card.Header>
          <PopupText content={fullName} />
        </Card.Header>
        <Card.Meta>
          <PopupText content={`Học vị: ${academicDegree}`} />
          <PopupText content={`Email: ${email}`} />
          <PopupText content={`SĐT: ${phone}`} />
        </Card.Meta>
      </Card.Content>
    </StyledCard>
  );
};

export default React.memo(DoctorCard);
