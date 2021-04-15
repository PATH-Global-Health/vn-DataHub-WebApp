import React, { useEffect, useCallback, useMemo } from 'react';

import { ComponentKey, GroupKey } from '@app/utils/component-tree';
import DataTable, { Column } from '@app/components/data-table';
import locations from '@app/assets/mock/locations.json';

import { useSelector, useDispatch, useRefreshCallback } from '@app/hooks';

import { Hospital } from '../hospital/hospital.model';
import { getHospitals, selectHospital } from './room.slice';

const HospitalTable: React.FC = () => {
  const { hospitalList, getHospitalLoading } = useSelector(
    (state) => state.csyt.catalog.room,
  );
  const { unitTypeList, getUnitTypesLoading } = useSelector(
    (state) => state.admin.account.unitType,
  );
  const dispatch = useDispatch();

  const getData = useCallback(() => {
    dispatch(getHospitals());
  }, [dispatch]);
  useEffect(getData, [getData]);

  useRefreshCallback(
    GroupKey.CSYT_CATALOG,
    ComponentKey.CSYT_ROOM,
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

  const loading = getHospitalLoading || getUnitTypesLoading;
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
      />
    </>
  );
};

export default HospitalTable;
