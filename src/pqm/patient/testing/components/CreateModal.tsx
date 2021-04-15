import React from 'react';

import { Modal } from 'semantic-ui-react';
import SimpleForm from '@app/components/simple-form';
import { FormField } from '@app/models/form-field';

import { useFetchApi } from '@app/hooks';
import { keyPopulation, Testing } from '@pqm/patient/testing/testing.model';
import testingService from '../testing.service';

interface Props {
    open: boolean;
    onClose: () => void;
    onRefresh: () => void;
}

const formFields: FormField<Testing>[] = [
    {
        name: 'id',
        hidden: true,
    },
    {
        type: 'input',
        name: 'patientCode',
        label: 'Patient Code',
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
        type: 'input',
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
        type: 'input',
        name: 'yearOrBirth',
        label: 'Year of birth',
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
        type: 'input',
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
        type: 'input',
        name: 'hivTreatmentCode',
        label: 'Hiv Treatment Code',
    },
    {
        type: 'input',
        name: 'arvRegisterTreatmentDate',
        label: 'Arc Register Treatment Date',
    },
    {
        type: 'input',
        name: 'registeredTreatmentUnit',
        label: 'Registered Treatment Unit',
    },
    {
        type: 'input',
        name: 'arvTransferTreatmentDate',
        label: 'Arv Transfer Treatment Date',
    },
];

const CreateModal: React.FC<Props> = (props) => {
    const { open, onClose, onRefresh } = props;
    const { fetch, fetching } = useFetchApi();

    const onSubmit = async (d: Testing): Promise<void> => {
        await fetch(testingService.createTestingPatient(d));
        onRefresh();
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Modal.Header>Tạo mới</Modal.Header>
            <Modal.Content>
                <SimpleForm
                    loading={fetching}
                    formFields={formFields}
                    onSubmit={onSubmit}
                />
            </Modal.Content>
        </Modal>
    );
};

export default CreateModal;


/* import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

import { Controller, useForm } from 'react-hook-form';

import { Modal, Form } from 'semantic-ui-react';

import { useFetchApi } from '@app/hooks';
import { toSlug } from '@app/utils/helpers';
import {
    TestingCM,
} from '@pqm/patient/testing/testing.model';
import testingService from '../testing.service';

interface Props {
    open: boolean;
    onClose: () => void;
    onRefresh: () => void;
}

const SelectStyled = styled(Form.Select)`
  min-width: 180px;
`;

const CreateModal: React.FC<Props> = ({
    open,
    onClose,
    onRefresh,
}) => {
    const {
        control,
        getValues,
        setValue,
        watch,
    } = useForm<TestingCM>();
    const { fetch, fetching } = useFetchApi();

    const [code, setCode] = useState('');
    const [name, setName] = useState('');

    const handleConfirm = useCallback(async () => {
        if (code !== '' && name !== '') {
            await fetch(testingService.createTestingPatient(getValues()));
            onRefresh();
            onClose();
        }
    }, [fetch, code, name, getValues, onClose, onRefresh]);

    return (
        <Modal open={open} onClose={onClose}>
            <Modal.Header>Tạo mới</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Group>
                        <Controller
                            name="patientCode"
                            defaultValue=""
                            control={control}
                            render={({ onChange, onBlur, value }) => (
                                <Form.Input
                                    fluid
                                    className="four wide"
                                    label="Patient Code"
                                    type="text"
                                    value={value as string}
                                    onChange={onChange}
                                    onBlur={() => {
                                        setCode(value);
                                        onBlur();
                                    }}
                                />
                            )}
                        />
                        <Controller
                            name="gender"
                            defaultValue=""
                            control={control}
                            render={({ onChange, onBlur, value }) => (
                                <Form.Input
                                    fluid
                                    className="four wide"
                                    label="Code"
                                    type="text"
                                    value={value as string}
                                    onChange={onChange}
                                    onBlur={() => {
                                        setCode(value);
                                        onBlur();
                                    }}
                                />
                            )}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Controller
                            name="site"
                            defaultValue=""
                            control={control}
                            render={({ onChange, onBlur, value }) => (
                                <Form.Input
                                    fluid
                                    className="four wide"
                                    label="Code"
                                    type="text"
                                    value={value as string}
                                    onChange={onChange}
                                    onBlur={() => {
                                        setCode(value);
                                        onBlur();
                                    }}
                                />
                            )}
                        />
                        <Controller
                            name="keyPopulation"
                            defaultValue=""
                            control={control}
                            render={({ onChange, onBlur, value }) => (
                                <Form.Input
                                    fluid
                                    className="twelve wide"
                                    label="Name with type"
                                    type="text"
                                    value={value as string}
                                    onChange={onChange}
                                    onBlur={() => {
                                        onBlur();
                                    }}
                                />
                            )}
                        />
                    </Form.Group>
                    <Form.Group widths="equal">
                        <Form.Field>
                            <Controller
                                name="yearOrBirth"
                                defaultValue=""
                                control={control}
                                render={({ onChange, onBlur, value }) => (
                                    <Form.Input
                                        fluid
                                        label="Slug"
                                        type="text"
                                        value={value as string}
                                        onChange={onChange}
                                        onBlur={() => {
                                            onBlur();
                                        }}
                                    />
                                )}
                            />
                        </Form.Field>
                    </Form.Group>
                    <Form.Group widths="equal">
                        <Form.Field>
                            <Controller
                                name="patient"
                                defaultValue=""
                                control={control}
                                render={({ onChange, onBlur, value }) => (
                                    <Form.Input
                                        fluid
                                        label="patient"
                                        type="text"
                                        value={value as string}
                                        onChange={onChange}
                                        onBlur={() => {
                                            onBlur();
                                        }}
                                    />
                                )}
                            />
                        </Form.Field>
                    </Form.Group>
                    <Form.Button
                        primary
                        content="Confirm"
                        loading={fetching}
                        onClick={!fetching ? handleConfirm : () => { }}
                        disabled={code === '' || name === ''}
                    />
                </Form>
            </Modal.Content>
        </Modal>
    );
};

export default CreateModal; */


