import React from 'react';

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { getStatusColor } from '@app/utils/helpers';

interface Props {
  data: { key: string; value: string; label: string }[];
}
const VaccinationBarChart: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data.map((d) => ({ ...d, Lần: d.value }))}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="Lần" fill="#000000">
          {data.map((d) => (
            <Cell key={d.key} fill={getStatusColor(d.key).hex} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default VaccinationBarChart;
