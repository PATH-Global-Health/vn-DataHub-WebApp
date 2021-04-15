import React, { useState } from 'react';
import { Form, Grid } from 'semantic-ui-react';

import InfoRow from '@app/components/InfoRow';

export interface AdditionalInformation {
  symptom?: string;
  diagnosis?: string;
  description?: string;
}

const initialData: AdditionalInformation = {};

interface Props {
  value?: AdditionalInformation;
  onChange: (data: AdditionalInformation) => void;
}

const AdditionalInfoStep: React.FC<Props> = (props) => {
  const { value: propValue, onChange } = props;
  const [data, setData] = useState<AdditionalInformation>(
    propValue ?? initialData,
  );

  return (
    <Form>
      <Form.Input
        label="Triệu chứng"
        value={data?.symptom ?? ''}
        onChange={(e, { value }) => {
          const tmp = { ...data, symptom: value };
          setData(tmp);
          onChange(tmp);
        }}
      />
      <Form.Input
        label="Chẩn đoán"
        value={data?.diagnosis ?? ''}
        onChange={(e, { value }) => {
          const tmp = { ...data, diagnosis: value };
          setData(tmp);
          onChange(tmp);
        }}
      />
      <Form.Input
        label="Ghi chú"
        value={data?.description ?? ''}
        onChange={(e, { value }) => {
          const tmp = { ...data, description: value };
          setData(tmp);
          onChange(tmp);
        }}
      />
    </Form>
  );
};

export const AdditionalInfoStepBrief: React.FC<{
  value?: AdditionalInformation;
}> = React.memo((props) => {
  const { value } = props;
  return value ? (
    <Grid columns={3}>
      <Grid.Row>
        <Grid.Column>
          <InfoRow label="Triệu chứng" content={value.symptom ?? ''} />
        </Grid.Column>
        <Grid.Column>
          <InfoRow label="Chẩn đoán" content={value.diagnosis ?? ''} />
        </Grid.Column>
        <Grid.Column>
          <InfoRow label="Ghi chú" content={value.description ?? ''} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  ) : null;
});

export default React.memo(AdditionalInfoStep);
