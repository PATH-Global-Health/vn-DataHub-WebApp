import React, { useState, useEffect } from 'react';
import { Form, DropdownItemProps, Grid } from 'semantic-ui-react';

import moment from 'moment';

import { DatePicker } from '@app/components/date-picker';
import InfoRow from '@app/components/InfoRow';
import { useSelector } from '@app/hooks';

import { Customer } from '../../../../catalog/customer/customer.model';

interface Props {
  value?: Customer;
  onChange: (customer: Customer) => void;
}

const newCustomer: Customer = {
  id: '-1',
  fullname: '',
  phoneNumber: '',
  gender: true,
  dateOfBirth: '',
};

const SelectCustomerStep: React.FC<Props> = (props) => {
  const {
    //
    customerList,
    getCustomersLoading,
  } = useSelector((s) => s.csyt.catalog.customer);
  const [
    //
    customerOptions,
    setCustomerOptions,
  ] = useState<DropdownItemProps[]>([]);

  const { value: propValue } = props;
  const [newCustomerFullName, setNewCustomerFullName] = useState('');
  useEffect(() => {
    setCustomerOptions(() => {
      const tmp = customerList.map((c) => ({ text: c.fullname, value: c.id }));
      if (newCustomerFullName) {
        return [...tmp, { text: newCustomerFullName, value: '-1' }];
      }
      if (propValue && propValue.id === '-1') {
        return [...tmp, { text: propValue.fullname, value: '-1' }];
      }
      return tmp;
    });
  }, [customerList, propValue, newCustomerFullName]);

  const [customer, setCustomer] = useState(propValue);
  const { onChange } = props;
  return (
    <Form>
      <Form.Select
        search
        deburr
        allowAdditions
        label="Họ tên"
        additionLabel="Thêm mới: "
        options={customerOptions}
        value={customer?.id}
        loading={getCustomersLoading}
        onAddItem={(e, { value }) => setNewCustomerFullName(value as string)}
        onChange={(e, { value }) => {
          const tmp = customerList.find((c) => c.id === value);
          const data = tmp ?? { ...newCustomer, FullName: value as string };
          setCustomer(data);
          onChange(data);
        }}
      />
      <Form.Input
        label="SĐT"
        type="number"
        disabled={customer && customer.id !== '-1'}
        value={customer?.phoneNumber ?? ''}
        onChange={(e, { value }) => {
          const tmp = customer ?? newCustomer;
          const data = { ...tmp, Phone: value };
          setCustomer(data);
          onChange(data);
        }}
      />
      <Form.Field
        label="Ngày sinh"
        control={DatePicker}
        disabled={customer && customer.id !== '-1'}
        value={
          customer?.dateOfBirth ? moment(customer?.dateOfBirth).toDate() : ''
        }
        onChange={(value: Date) => {
          const tmp = customer ?? newCustomer;
          const data = {
            ...tmp,
            dateOfBirth: moment(value).format('YYYY-MM-DD'),
          };
          setCustomer(data);
          onChange(data);
        }}
      />
      <Form.Select
        label="Giới tính"
        disabled={customer && customer.id !== '-1'}
        options={[
          { text: 'Nam', value: 'male' },
          { text: 'Nữ', value: 'female' },
        ]}
        value={customer?.gender ? 'male' : 'female'}
        onChange={(e, { value }) => {
          const tmp = customer ?? newCustomer;
          const data = { ...tmp, Gender: value === 'male' };
          setCustomer(data);
          onChange(data);
        }}
      />
    </Form>
  );
};

export const SelectCustomerStepBrief: React.FC<{
  value?: Customer;
}> = React.memo((props) => {
  const { value } = props;
  return value ? (
    <Grid columns={2}>
      <Grid.Row>
        <Grid.Column>
          <InfoRow label="Họ tên" content={value.fullname} />
          <InfoRow label="SĐT" content={value.phoneNumber} />
        </Grid.Column>
        <Grid.Column>
          <InfoRow
            label="Ngày sinh"
            content={moment(value.dateOfBirth).format('DD-MM-YYYY')}
          />
          <InfoRow label="Giới tính" content={value.gender ? 'Nam' : 'Nữ'} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  ) : null;
});

export default React.memo(SelectCustomerStep);
