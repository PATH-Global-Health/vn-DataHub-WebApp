/* eslint-disable @typescript-eslint/unbound-method */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DropdownItemProps, Form, Header } from 'semantic-ui-react';

import moment from 'moment';

import { Controller, useForm } from 'react-hook-form';

import { DatePicker } from '@app/components/date-picker';
import { useSelector, useFetchApi, useAddress } from '@app/hooks';

import customerService from '../../../catalog/customer/customer.service';
import { Customer } from '../../../catalog/customer/customer.model';

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  gender: 'male' | 'female';
  birthday: string;
  address: string;
  province: string;
  district: string;
  ward: string;
}

interface Props {
  onChange: (d: Customer) => void;
  loading?: boolean;
}

const CustomerSection: React.FC<Props> = (props) => {
  const { onChange: onChangeProp, loading } = props;

  const { fetch, fetching } = useFetchApi();

  const { customerList, getCustomersLoading } = useSelector(
    (state) => state.csyt.catalog.customer,
  );
  // prettier-ignore
  const [customerOptions, setCustomerOptions] = useState<DropdownItemProps[]>([]);
  useEffect(() => {
    setCustomerOptions(() =>
      customerList.map((c) => ({
        text: c.fullname,
        value: c.id,
        content: (
          <Header
            content={c.fullname}
            subheader={`Ngày sinh ${moment(c.dateOfBirth).format(
              'DD-MM-YYYY',
            )}`}
          />
        ),
      })),
    );
  }, [customerList]);

  const {
    provinceOptions,
    districtOptions,
    wardOptions,
    setProvince,
    setDistrict,
    setWard,
    province,
    district,
  } = useAddress();

  const {
    //
    control,
    getValues,
    setValue,
    reset,
    register,
  } = useForm<CustomerInfo>();
  useEffect(() => register('name'), [register]);

  const triggerOnChange = useCallback(() => {
    const c = getValues();
    onChangeProp({
      fullname: c.name,
      phoneNumber: c.phone,
      gender: c.gender === 'male',
      address: c.address,
      province: c.province,
      district: c.district,
      ward: c.ward,
      dateOfBirth: c.birthday
        ? moment(c.birthday).format('YYYY-MM-DD')
        : undefined,
      email: c.email,
      id: '-1',
    });
  }, [getValues, onChangeProp]);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>();
  const onSelectCustomer = useCallback(
    (customerId: string, customerName?: string) => {
      if (customerId !== '-1') {
        const getCustomerDetails = async () => {
          if (customerId) {
            const customer = await fetch(
              customerService.getCustomerDetails(customerId),
            );
            if (customer) {
              setValue('phone', customer.phoneNumber);
              setValue('gender', customer.gender ? 'male' : 'female');
              setValue('email', customer.email);
              setValue(
                'birthday',
                moment(customer.dateOfBirth).format('YYYY-MM-DD'),
              );
              setValue('address', customer.address);
              setValue('province', customer.province);
              setValue('district', customer.district);
              setValue('ward', customer.ward);
              setProvince(customer.province ?? '');
              setDistrict(customer.province ?? '', customer.district ?? '');
              setWard(
                customer.province ?? '',
                customer.district ?? '',
                customer.ward ?? '',
              );
            }

            onChangeProp(customer);
          }
        };

        getCustomerDetails();
      } else {
        reset({
          name: customerName,
          birthday: '',
          address: '',
          province: '',
          district: '',
          ward: '',
          email: '',
          gender: 'male',
          phone: '',
        });
      }
    },
    [fetch, setValue, reset, setProvince, setDistrict, setWard, onChangeProp],
  );
  const customerSelectNode = useMemo(
    () => (
      <Form.Select
        fluid
        search
        label="Họ tên"
        allowAdditions
        additionLabel="Thêm mới: "
        loading={getCustomersLoading || fetching}
        options={customerOptions}
        value={selectedCustomerId}
        onAddItem={(e, { value }) => {
          setCustomerOptions((co) => [
            ...co.filter((c) => c.value !== '-1'),
            { text: value as string, value: '-1' },
          ]);
        }}
        onChange={(e, { value }) => {
          if (typeof value === 'string' && value.indexOf('-') > -1) {
            setSelectedCustomerId(value);
            onSelectCustomer(value);
          } else {
            setSelectedCustomerId('-1');
            onSelectCustomer('-1', (value as unknown) as string);
          }
        }}
      />
    ),
    [
      customerOptions,
      fetching,
      getCustomersLoading,
      selectedCustomerId,
      onSelectCustomer,
    ],
  );

  const disabledInfoFields = useMemo(
    () => Boolean(selectedCustomerId && selectedCustomerId !== '-1'),
    [selectedCustomerId],
  );
  return (
    <Form loading={loading}>
      <Header content="Thông tin người được tiêm" />
      <Form.Group widths="equal">
        {customerSelectNode}
        <Controller
          name="phone"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              disabled={disabledInfoFields}
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
      </Form.Group>
      <Form.Group widths="equal">
        <Controller
          name="email"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              label="Email"
              type="email"
              disabled={disabledInfoFields}
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
          name="gender"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Select
              fluid
              label="Giới tính"
              disabled={disabledInfoFields}
              value={value as string}
              onChange={onChange}
              onBlur={() => {
                onBlur();
                triggerOnChange();
              }}
              options={[
                { text: 'Nam', value: 'male' },
                { text: 'Nữ', value: 'female' },
              ]}
            />
          )}
        />
        <Controller
          name="birthday"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Field
              fluid
              label="Ngày sinh"
              value={value ? moment(value as string).toDate() : undefined}
              control={DatePicker}
              disabled={disabledInfoFields}
              onChange={(d: Date) => {
                onChange(moment(d).format('YYYY-MM-DD'));
                onBlur();
                triggerOnChange();
              }}
            />
          )}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Controller
          name="address"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Input
              fluid
              label="Địa chỉ"
              value={value as string}
              onChange={onChange}
              disabled={disabledInfoFields}
              onBlur={() => {
                onBlur();
                triggerOnChange();
              }}
            />
          )}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Controller
          name="province"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Select
              fluid
              search
              label="Tỉnh/Thành"
              options={provinceOptions}
              value={value as string}
              disabled={disabledInfoFields}
              onChange={(e, { value: v }) => {
                setProvince(v as string);
                setValue('district', '');
                setValue('ward', '');
                onChange(v);
                onBlur();
                triggerOnChange();
              }}
            />
          )}
        />
        <Controller
          name="district"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Select
              fluid
              search
              label="Quận/Huyện"
              options={districtOptions}
              value={value as string}
              disabled={disabledInfoFields}
              onChange={(e, { value: v }) => {
                setDistrict((province?.value as string) ?? '', v as string);
                setValue('ward', '');
                onChange(v);
                onBlur();
                triggerOnChange();
              }}
            />
          )}
        />
        <Controller
          name="ward"
          defaultValue=""
          control={control}
          render={({ onChange, onBlur, value }) => (
            <Form.Select
              fluid
              search
              label="Phường/Xã"
              options={wardOptions}
              value={value as string}
              disabled={disabledInfoFields}
              onChange={(e, { value: v }) => {
                setWard(
                  (province?.value as string) ?? '',
                  (district?.value as string) ?? '',
                  v as string,
                );
                onChange(v);
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

export default CustomerSection;