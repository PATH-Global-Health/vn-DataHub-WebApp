import React, { useState, useEffect, useMemo } from 'react';
import { Form, Grid } from 'semantic-ui-react';

import { useSelector } from '@app/hooks';
import InfoRow from '@app/components/InfoRow';
import { toVND } from '@app/utils/helpers';

enum DiscountType {
  PERCENTAGE = 1,
  CASH = 2,
}

export interface Discount {
  discountType: DiscountType;
  discount: number;
  paymentAmount: number;
}

interface Props {
  value?: Discount;
  onChange: (d: Discount) => void;
}

const calculateAmount = (
  price: number,
  discountType: number,
  discount: number,
) => {
  if (discountType === DiscountType.PERCENTAGE) {
    return discount <= 100 ? price - price * (discount / 100) : 0;
  }
  return price > discount ? price - discount : 0;
};

const DiscountStep: React.FC<Props> = (props) => {
  const { selectedService } = useSelector((s) => s.csyt.telemedicine.booking);
  const { value: propValue } = props;

  const initialDiscount = useMemo(
    (): Discount =>
      propValue ?? {
        discountType: DiscountType.PERCENTAGE,
        discount: 0,
        paymentAmount: calculateAmount(
          selectedService?.Price ?? 0,
          DiscountType.PERCENTAGE,
          0,
        ),
      },
    [propValue, selectedService],
  );

  const [data, setData] = useState<Discount>(() => initialDiscount);
  const { onChange } = props;
  useEffect(() => {
    onChange(initialDiscount);
  }, [onChange, initialDiscount]);

  return (
    <Form>
      <Form.Select
        label="Loại"
        options={[
          { text: 'Giảm trực tiếp', value: DiscountType.CASH },
          { text: 'Giảm theo %', value: DiscountType.PERCENTAGE },
        ]}
        value={data.discountType}
        onChange={(e, { value }) => {
          const tmp = {
            ...data,
            discountType: value as number,
            paymentAmount: calculateAmount(
              selectedService?.Price ?? 0,
              value as number,
              data.discount,
            ),
          };
          setData(tmp);
          onChange(tmp);
        }}
      />
      <Form.Input
        label="Mức giảm"
        type="number"
        value={data.discount}
        onChange={(e, { value }) => {
          const tmp = {
            ...data,
            discount: parseInt(value, 10),
            paymentAmount: calculateAmount(
              selectedService?.Price ?? 0,
              data.discountType,
              parseInt(value, 10),
            ),
          };
          setData(tmp);
          onChange(tmp);
        }}
      />
      <Form.Input
        label="Thành tiền"
        type="number"
        value={data.paymentAmount}
        onChange={(e, { value }) => {
          const tmp = { ...data, paymentAmount: parseInt(value, 10) };
          setData(tmp);
          onChange(tmp);
        }}
      />
    </Form>
  );
};

export const DiscountStepBrief: React.FC<{
  value?: Discount;
}> = React.memo((props) => {
  const { value } = props;
  return value ? (
    <Grid columns={3}>
      <Grid.Row>
        <Grid.Column>
          <InfoRow
            label="Loại"
            content={
              value.discountType === DiscountType.PERCENTAGE
                ? 'Giảm trực tiếp'
                : 'Giảm theo %'
            }
          />
        </Grid.Column>
        <Grid.Column>
          <InfoRow
            label="Mức giảm"
            content={
              value.discountType === DiscountType.PERCENTAGE
                ? `${value.discount}%`
                : toVND(value.discount)
            }
          />
        </Grid.Column>
        <Grid.Column>
          <InfoRow label="Thành tiền" content={toVND(value.paymentAmount)} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  ) : null;
});

export default React.memo(DiscountStep);
