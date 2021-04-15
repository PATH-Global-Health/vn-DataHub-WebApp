/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import styled from 'styled-components';

import { FiUpload } from 'react-icons/fi';
import { Grid, Modal, Button } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';

import { useFetchApi } from '@app/hooks';
import testingService from '@pqm/patient/testing/testing.service';

interface Props {
    open: boolean;
    onClose: () => void;
    onRefresh: () => void;
}

const StyledRow = styled(Grid.Row)`
    margin-bottom: .5rem;
`;

const WrapperDropzone = styled.div`
    width: 100%;
    & .dropzone {
        width: 100%;
        & .dz-message {
            width: 100%;
            border: 2px dotted LightGray;
            background-color:#F4F7F0;
            padding: 30px 20px;
            border-radius:5px;
            margin-bottom:10px;
            cursor:pointer;
            & .message {
                text-align: center;
                & svg {
                    padding-top: .5rem;
                    font-size: 50px;
                }
                & .label {
                    display: block;
                    font-weight: bold;
                }
            }
        }
    }
`;


const UploadModal: React.FC<Props> = (props) => {
    const { open, onClose, onRefresh } = props;
    const { fetch, fetching } = useFetchApi();
    const [fileSelected, setFileSelected] = React.useState<File>();
    const handleUploadFile = function (e: React.ChangeEvent<HTMLInputElement>) {
        const fileList = e.target.files;
        console.log(fileList);
        if (!fileList) return;
        setFileSelected(fileList[0]);
    };
    const formatBytes = (bytes: any, decimals: any = 2) => {
        if (bytes === 0)
            return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    const handleUploadFileImport = (files: File[]) => {
        console.log((typeof (files)));
        const fileList = files;
        console.log(fileList);
        if (!fileList) return;
        setFileSelected(fileList[0]);
    };
    const onUpload = async (): Promise<void> => {
        if (fileSelected) {
            const formData = new FormData();
            formData.append('file', fileSelected);
            await fetch(testingService.uploadTestingPatient(formData));
            setFileSelected(undefined);
            onRefresh();
            onClose();
        }
    };

    /*   useEffect(() => {
          if (fileSelected) {
              const formData = new FormData();
              formData.append('file', fileSelected);
              onUpload(formData);
          }
      }, [fileSelected]) */
    return (
        <>
            <Modal open={(open)} onClose={onClose}>
                <Modal.Header>Tải file excel</Modal.Header>
                <Modal.Content>
                    <Grid.Column>
                        <StyledRow>
                            <WrapperDropzone>
                                <Dropzone onDrop={files => { handleUploadFileImport(files) }}>
                                    {({ getRootProps, getInputProps }) => (
                                        <div className="dropzone">
                                            <div className="dz-message needsclick mt-2" {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <div className="message">
                                                    <FiUpload />
                                                    <span className="label">Drop files here or click to upload</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Dropzone>
                            </WrapperDropzone>
                        </StyledRow>
                        {
                            !fileSelected ? null :
                                (
                                    <div className="row">
                                        <div style={{ padding: '.2rem' }}>
                                            <span className="text-mute">{fileSelected?.name ?? '...'}</span> - <strong>{formatBytes(fileSelected?.size ?? 0)}</strong>
                                        </div>
                                    </div>
                                )
                        }
                        <Grid.Row>
                            <button className="ui primary button" onClick={() => { onUpload() }}>
                                Tải lên
                            </button>
                            <button className="ui button" onClick={() => { onClose(); setFileSelected(undefined); }}>
                                Hủy
                            </button>
                        </Grid.Row>
                    </Grid.Column>

                </Modal.Content>
            </Modal>
        </>
    );
};

export default UploadModal;
