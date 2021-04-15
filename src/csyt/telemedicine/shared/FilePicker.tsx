import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, List } from 'semantic-ui-react';
import { FiImage, FiX } from 'react-icons/fi';
import styled from 'styled-components';
import PopupText from '@app/components/PopupText';

const FileInput = styled.input`
  display: none;
`;
const StyledItem = styled(List.Item)`
  display: flex !important;
  & svg {
    font-size: 20px;
    min-width: 20px;
    margin-right: 10px;
  }
  & .content {
    overflow: hidden;
  }
`;

interface Props {
  value?: File[];
  onChange: (files: File[]) => void;
}

const FilePicker: React.FC<Props> = (props) => {
  const { value, onChange } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const [fileList, setFileList] = useState<File[]>(value ?? []);
  useEffect(() => setFileList(value ?? []), [value]);

  const handleOnChange = useCallback(() => {
    const result: File[] = [];
    const files = inputRef.current?.files;
    if (files?.length) {
      for (let i = 0; i < files.length; i += 1) {
        result.push(files.item(i) as File);
      }
    }
    setFileList(result);
    onChange(result);
  }, [onChange]);

  return (
    <>
      <FileInput
        multiple
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleOnChange}
      />
      <Button
        basic
        primary
        content="Thêm đính kèm"
        onClick={() => inputRef.current?.click()}
      />
      <List>
        {fileList.map((f) => (
          <StyledItem key={f.name}>
            <FiX
              onClick={() => {
                const newList = fileList.filter((e) => e.name !== f.name);
                setFileList(newList);
                onChange(newList);
              }}
            />
            <FiImage />
            <List.Content content={<PopupText content={f.name} />} />
          </StyledItem>
        ))}
      </List>
    </>
  );
};

export default React.memo(FilePicker);
