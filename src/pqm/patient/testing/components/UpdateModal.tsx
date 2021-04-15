/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable import/no-unresolved */
import React from 'react';

import { Modal } from 'semantic-ui-react';
import SimpleForm from '@app/components/simple-form';
import { FormField } from '@app/models/form-field';

import { useFetchApi } from '@app/hooks';
import {
    Testing,
    TestingUM,
} from '@pqm/patient/testing/testing.model';
import provinceService from '@pqm/patient/testing/testing.service';
import testingService from '@pqm/patient/testing/testing.service';

interface Props {
    data?: Testing;
    onClose: () => void;
    onRefresh: () => void;
}

const formFields: FormField<TestingUM>[] = [
    {
        name: 'id',
        hidden: true,
    },
    {
        name: 'gender',
        label: 'Gender',
        type: 'select',
        options: [
            { text: 'Nam', value: 'Male' },
            { text: 'Nữ', value: 'Female' },
        ],
    },
    {
        name: 'site',
        label: 'Site',
    },
    {
        name: 'keyPopulation',
        label: 'Key Population',
        type: 'select',
        options: [
            { text: 'Nghiện chích ma túy', value: 'nghien_ma_tuy' },
            { text: 'Người bán dâm', value: 'nu_ban_dam' },
            { text: 'Phụ nữ mang thai', value: 'nu_mang_thai' },
            { text: 'Người hiến máu', value: 'nguoi_hien_mau' },
            { text: 'Bệnh nhân lao', value: 'benh_lao' },
            { text: 'Người mắc nhiễm trùng lây truyền qua đường TD', value: 'nhiem_trung_lay_td' },
            { text: 'Thanh niên khám tuyển nghĩa vụ quân sự', value: 'nghia_vu_quan_su' },
            { text: 'Nam quan hệ tình dục với nam', value: 'msm' },
            { text: 'Người chuyển giới', value: 'tg' },
            { text: 'Vợ/chồng/ban tình của người nhiễm HIV', value: 'ban_tinh_HIV' },
            { text: 'Vợ/chồng/ban tình của người NCC', value: 'ban_tinh_ncc' },
            { text: 'NCH xét nghiệm điều trị ARV', value: 'nghi_ngo_aids' },
            { text: 'Khách hàng PrEP', value: 'doi_tuong_khac' },
        ],
    },
    {
        name: 'yearOrBirth',
        label: 'Year of birth',
    },
    {
        name: 'patientCode',
        label: 'Patient Code',
    },
    {
        type: 'select',
        name: 'verifiedResult',
        label: 'Verified Result',
        options: [
            { text: 'Âm tính', value: '1' },
            { text: 'Dương tính', value: '2' },
        ],
    },
    {
        name: 'verifiedTestDate',
        label: 'Verified Test Date',
    },
    {
        type: 'select',
        name: 'quickResult',
        label: 'Quick Result',
        options: [
            { text: 'Mới nhiễm', value: '1' },
            { text: 'Nhiễm lâu', value: '2' },
        ],
    },
    {
        name: 'hivTreatmentCode',
        label: 'Hiv Treatment Code',
    },
    {
        name: 'arvRegisterTreatmentDate',
        label: 'Arc Register Treatment Date',
    },
    {
        name: 'registeredTreatmentUnit',
        label: 'Registered Treatment Unit',
    },
    {
        name: 'arvTransferTreatmentDate',
        label: 'Arv Transfer Treatment Date',
    },
];

const UpdateModal: React.FC<Props> = (props) => {
    const { data, onClose, onRefresh } = props;
    const { fetch, fetching } = useFetchApi();

    return (
        <>
            <Modal open={Boolean(data)} onClose={onClose}>
                <Modal.Header>Cập nhật</Modal.Header>
                <Modal.Content>
                    <SimpleForm
                        defaultValues={data}
                        formFields={formFields}
                        loading={fetching}
                        onSubmit={async (d): Promise<void> => {
                            console.log(d);
                            await fetch(testingService.updateTestingPatient(d));
                            onRefresh();
                            onClose();
                        }}
                    />
                </Modal.Content>
            </Modal>
        </>
    );
};

export default UpdateModal;
