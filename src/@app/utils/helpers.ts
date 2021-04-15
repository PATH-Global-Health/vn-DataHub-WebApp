/* eslint-disable no-useless-escape */
/* eslint-disable import/prefer-default-export */
export const deburr = (s: string): string => {
  let result = s ?? '';
  result = result.toLowerCase();
  result = result.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  result = result.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  result = result.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  result = result.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  result = result.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  result = result.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  result = result.replace(/đ/g, 'd');
  result = result.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ' ',
  );
  result = result.replace(/ + /g, ' ');
  result = result.trim();
  return result;
};

export const filterArray = <T>(arr: T[], searchValue: string): T[] => {
  const result = arr.filter((e) =>
    deburr(JSON.stringify(e))
      .toLowerCase()
      .includes(deburr(searchValue.toLowerCase().trim())),
  );

  return result;
};

export const toVND = (amount: number): string =>
  `${amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')} ₫`;

interface StatusOptions {
  key: string;
  color: string;
  label: string;
  hex: string;
}

const initialStatus: StatusOptions = {
  key: '',
  color: '',
  label: '',
  hex: '',
};
export const getStatusColor = (label: string): StatusOptions => {
  const options = [
    { key: 'UNFINISHED', color: 'blue', label: 'Chưa khám', hex: '#2185d0' },
    { key: 'FINISHED', color: 'green', label: 'Đã thực hiện', hex: '#21ba45' },
    {
      key: 'CANCELED_BY_CUSTOMER',
      color: 'grey',
      label: 'Bên hẹn huỷ',
      hex: '#767676',
    },
    {
      key: 'NOT_DOING',
      color: 'brown',
      label: 'Không thực hiện',
      hex: '#a5673f',
    },
    { key: 'CANCELED', color: 'red', label: 'Huỷ', hex: '#db2828' },
    {
      key: 'TRANSFERRED',
      color: 'violet',
      label: 'Chuyển tiếp',
      hex: '#6435c9',
    },
    {
      key: 'RESULTED',
      color: 'green',
      label: 'Có kết quả',
      hex: '#21ba45',
    },
  ];
  return options.find((o) => o.key === label) || initialStatus;
};
export const toSlug = (content: string): string => {
  let result = deburr(content) ?? '';
  result = result.replace(/[^a-z0-9 -]/g, '');
  result = result.replace(/\s+/g, '-');
  result = result.replace(/-+/g, '-');
  return result;
};

export const getExaminationStatusColor = (label: string): StatusOptions => {
  const options = [
    { key: 'UNFINISHED', color: 'blue', label: 'Chưa khám', hex: '#2185d0' },
    { key: 'FINISHED', color: 'teal', label: 'Đã thực hiện', hex: '#00b5ad' },
    {
      key: 'CANCELED_BY_CUSTOMER',
      color: 'grey',
      label: 'Bên hẹn huỷ',
      hex: '#767676',
    },
    {
      key: 'NOT_DOING',
      color: 'brown',
      label: 'Không thực hiện',
      hex: '#a5673f',
    },
    { key: 'CANCELED', color: 'red', label: 'Huỷ', hex: '#db2828' },
    {
      key: 'RESULTED',
      color: 'green',
      label: 'Có kết quả',
      hex: '#21ba45',
    },
  ];
  return options.find((o) => o.key === label) || initialStatus;
};
