/* eslint-disable @typescript-eslint/unbound-method */
import React, { useCallback } from 'react';
import { Form, Header } from 'semantic-ui-react';

import { useForm, Controller } from 'react-hook-form';
import { ContactInfo } from '../../vaccination.model';

interface Contact {
  name: string;
  phone: string;
  relationship: string;
}

interface Props {
  onChange: (d: ContactInfo) => void;
  loading?: boolean;
}

const ContactSection: React.FC<Props> = (props) => {
  const { onChange: onChangeProp, loading } = props;

  const { control, getValues } = useForm<Contact>();

  const triggerOnChange = useCallback(() => {
    const d = getValues();
    onChangeProp({
      fullname: d.name,
      phone: d.phone,
      relationship: d.relationship,
    });
  }, [getValues, onChangeProp]);

  return (
    <Form loading={loading}>
      <Header content="Thông tin người đi cùng" />
      <Form.Group widths="equal">
        <Controller
          name="name"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              label="Họ tên"
              value={value as string}
              onChange={onChange}
              onBlur={() => {
                onBlur();
                triggerOnChange();
              }}
            />
          )}
        />
        <Controller
          name="phone"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              label="SĐT"
              type="number"
              value={value as string}
              onChange={onChange}
              onBlur={() => {
                onBlur();
                triggerOnChange();
              }}
            />
          )}
        />
        <Controller
          name="relationship"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              label="Mối quan hệ"
              value={value as string}
              onChange={onChange}
              onBlur={() => {
                onBlur();
                triggerOnChange();
              }}
            />
          )}
        />
      </Form.Group>
    </Form>
  );
};

export default ContactSection;
