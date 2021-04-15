import React, { useEffect, useCallback, useMemo } from 'react';

import { GroupKey } from '@app/utils/component-tree';
import DataTable, { Column } from '@app/components/data-table';
import locations from '@app/assets/mock/locations.json';

import { useSelector, useDispatch, useRefreshCallback } from '@app/hooks';
import { getHospitals } from '@admin/manage-account/slices/hospital';
import { getUnitTypes } from '@admin/manage-account/slices/unit-type';

import { Hospital } from '@admin/manage-account/models/hospital';
import { selectHospital } from '../telehealth.slice';

const TelehealthHospitalTable: React.FC = () => {
  const { hospitalList, getHospitalsLoading } = useSelector(
    (state) => state.admin.account.hospital,
  );
  const { unitTypeList, getUnitTypesLoading } = useSelector(
    (state) => state.admin.account.unitType,
  );
  const dispatch = useDispatch();

  const getData = useCallback(() => {
    dispatch(getHospitals());
    dispatch(getUnitTypes());
  }, [dispatch]);
  useEffect(getData, [getData]);

  useRefreshCallback(
    GroupKey.CSYT_TELEHEALTH,
    GroupKey.CSYT_TELEHEALTH,
    (): void => {
      getData();
      dispatch(selectHospital(undefined));
    },
  );

  const columns: Column<Hospital>[] = useMemo(
    (): Column<Hospital>[] => [
      {
        header: 'Tên',
        accessor: 'name',
      },
      {
        header: 'Loại hình',
        accessor: 'unitTypeId',
        render: (d): string =>
          unitTypeList.find((u) => u.id === d.unitTypeId)?.typeName ?? '',
      },
      {
        header: 'Tỉnh/Thành',
        accessor: 'province',
        render: (d): string => {
          const province = locations.find((p) => p.value === d.province);
          return province?.label ?? '';
        },
      },
      {
        header: 'Quận/Huyện',
        accessor: 'district',
        render: (d): string => {
          const province = locations.find((p) => p.value === d.province);
          const district = province?.districts.find(
            (dt) => dt.value === d.district,
          );
          return district?.label ?? '';
        },
      },
      {
        header: 'Phường/Xã',
        accessor: 'ward',
        render: (d): string => {
          const province = locations.find((p) => p.value === d.province);
          const district = province?.districts.find(
            (dt) => dt.value === d.district,
          );
          const ward = district?.wards.find((w) => w.value === d.ward);
          return ward?.label ?? '';
        },
      },
    ],
    [unitTypeList],
  );

  const loading = getHospitalsLoading || getUnitTypesLoading;
  return (
    <>
      <DataTable
        search
        loading={loading}
        columns={columns}
        data={hospitalList}
        onRowClick={(row): void => {
          dispatch(selectHospital(row));
        }}
        tableActions={[]}
        rowActions={[]}
      />
    </>
  );
};

export default TelehealthHospitalTable;
