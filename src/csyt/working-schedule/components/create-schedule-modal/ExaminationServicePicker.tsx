import React, { useEffect } from 'react';

interface Props {
  onChange: (serviceIds: string[]) => void;
}

const ExaminationServicePicker: React.FC<Props> = (props) => {
  const { onChange } = props;

  useEffect(() => {
    onChange(['f2490f62-1d28-4edd-362a-08d8a7232229']);
  }, [onChange]);

  return <></>;
};

export default React.memo(ExaminationServicePicker);
