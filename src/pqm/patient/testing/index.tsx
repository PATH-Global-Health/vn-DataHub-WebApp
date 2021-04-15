/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Modal } from 'semantic-ui-react';
import { FiUploadCloud, FiPlus, FiEdit3, FiTrash2 } from 'react-icons/fi';
import DataTable, { Column } from '@app/components/data-table';
import CreateModal from '@pqm/patient/testing/components/CreateModal';
import UpdateModal from '@pqm/patient/testing/components/UpdateModal';
import moment from 'moment';
import {
    useFetchApi,
    useRefreshCallback,
    useConfirm,
    useSelector,
    useDispatch,
} from '@app/hooks';
import { GroupKey, ComponentKey } from '@app/utils/component-tree';
import {
    Testing,
    TestingDM,
} from './testing.model';
import { getTestingPatient } from './testing.slice';
import testingService from './testing.service';
import UploadModal from './components/UploadModal';

const columns: Column<Testing>[] = [
    {
        accessor: 'patientCode',
        header: 'Patient Code',
    },
    {
        accessor: 'gender',
        header: 'Gender',
    },
    {
        accessor: 'site',
        header: 'Site',
    },
    {
        accessor: 'keyPopulation',
        header: 'Key Population',
    },
    {
        accessor: 'verifiedResult',
        header: 'Verified Result',
        render: (d): string => (d.verifiedResult === '1' ? 'Âm tính' : d.verifiedResult === '2' ? 'Dương tính' : "N/a"),
    },
    {
        accessor: 'verifiedTestDate',
        header: 'Verified Test Date',
        render: (d): string => moment(d.verifiedTestDate).format('DD-MM-YYYY'),
    },


];

const TestingPatientPage: React.FC = () => {
    const { fetch, fetching } = useFetchApi();
    const confirm = useConfirm();
    const { testingList, getTestingLoading } = useSelector(
        (state) => state.pqm.patient.testing,
    );
    const [fileSelected, setFileSelected] = React.useState<File>()
    const fileInputRef = useRef();
    const dispatch = useDispatch();
    const [openCreate, setOpenCreate] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [updateDetails, setUpdateDetails] = useState<Testing>();


    const handleUploadFile = function (e: React.ChangeEvent<HTMLInputElement>) {
        const fileList = e.target.files;
        console.log(fileList);
        if (!fileList) return;
        setFileSelected(fileList[0]);

    };
    /*     const uploadFile = function (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
          const formData = new FormData();
          formData.append("image", fileSelected, fileSelected.name);
      
           // line above ^ gives me the error below
        }; */
    const getData = useCallback(() => {
        dispatch(getTestingPatient({}));
    }, [dispatch]);

    /*  useRefreshCallback(
         GroupKey.PQM_PATIENT,
         ComponentKey.PQM_PATIENT,
         getData,
     ); */
    useEffect(getData, [getData]);
    /*     useEffect(async() => {
            if (fileSelected) {
              const formData = new FormData();
              formData.append('file', fileSelected);
              await testingService.uploadTestingPatient(formData))
            }
            // eslint-disable-next-line
          }, [dispatch, fileSelected]); */

    return (
        <>
            <DataTable
                search
                sortBy
                title="Testing Patients"
                loading={getTestingLoading || fetching}
                columns={columns}
                data={testingList}
                tableActions={[
                    {
                        icon: <FiUploadCloud />,
                        color: 'green',
                        title: 'Tải lên',
                        onClick: (): void => setOpenUpload(true),
                    },
                    {
                        icon: <FiPlus />,
                        color: 'blue',
                        title: 'Thêm',
                        onClick: (): void => setOpenCreate(true),
                    },
                ]}
                rowActions={[
                    {
                        icon: <FiEdit3 />,
                        color: 'violet',
                        title: 'Sửa',
                        onClick: (d): void => setUpdateDetails(d),
                    },
                    {
                        icon: <FiTrash2 />,
                        color: 'red',
                        title: 'Xoá',
                        onClick: (d): void => {
                            confirm('Xác nhận xoá', async () => {
                                await fetch(testingService.deleteTestingPatient(d.id));
                                getData();
                            });
                        },
                    },
                ]}
            />
            <UploadModal
                open={openUpload}
                onClose={(): void => setOpenUpload(false)}
                onRefresh={getData}
            />
            <CreateModal
                open={openCreate}
                onClose={(): void => setOpenCreate(false)}
                onRefresh={getData}
            />

            <UpdateModal
                data={updateDetails}
                onClose={(): void => setUpdateDetails(undefined)}
                onRefresh={getData}
            />
        </>
    );
};

export default TestingPatientPage;
