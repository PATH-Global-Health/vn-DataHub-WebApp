import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Accordion,
  AccordionTitleProps,
  Button,
  Checkbox,
  Modal,
} from 'semantic-ui-react';
import styled from 'styled-components';

import { useSelector } from '@app/hooks';
import { InjectionObject } from '../../../vaccination/vaccination.model';
import { Service } from '../../../catalog/service/service.model';

const Wrapper = styled.div`
  margin-bottom: 18px;
`;

interface Props {
  selectedIdList: string[];
  onChange: (idList: string[]) => void;
}

const VaccinationServicePicker: React.FC<Props> = (props) => {
  const injectionObjectList = useSelector(
    (state) => state.csyt.vaccination.injectionObjectList,
  );
  const serviceList = useSelector(
    (state) => state.csyt.catalog.service.serviceList,
  );
  const getInjectionObjectsLoading = useSelector(
    (state) => state.csyt.vaccination.getInjectionObjectsLoading,
  );
  const getServicesLoading = useSelector(
    (state) => state.csyt.catalog.service.getServicesLoading,
  );

  const getServicesOfInjectionObject = useCallback(
    (ioId: InjectionObject['id']): Service[] =>
      serviceList.filter((s) => s.injectionObjectId === ioId),
    [serviceList],
  );

  const loading = useMemo(
    () => getInjectionObjectsLoading || getServicesLoading,
    [getInjectionObjectsLoading, getServicesLoading],
  );

  const [open, setOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState('');
  const onAccordionClick = useCallback(
    (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      data: AccordionTitleProps,
    ): void => {
      setActiveAccordion((prev) =>
        prev === data.index ? '' : (data.index as string),
      );
    },
    [],
  );

  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const { onChange } = props;
  useEffect(() => {
    onChange(selectedServiceIds);
  }, [onChange, selectedServiceIds]);

  const { selectedIdList } = props;

  return (
    <Wrapper>
      <Button
        basic
        primary
        loading={loading}
        content={`Đã chọn ${selectedServiceIds.length} mũi tiêm`}
        onClick={(): void => setOpen(true)}
      />

      <Modal open={open} size="fullscreen">
        <Modal.Content>
          <Accordion styled fluid>
            {injectionObjectList.map((io) => (
              <React.Fragment key={io.id}>
                <Accordion.Title
                  content={io.name}
                  active={activeAccordion === io.id}
                  index={io.id}
                  onClick={onAccordionClick}
                />
                <Accordion.Content active={activeAccordion === io.id}>
                  {getServicesOfInjectionObject(io.id).map((s) => (
                    <React.Fragment key={s.id}>
                      <Checkbox
                        label={`${
                          s.serviceTypeId ===
                          '4c090002-2a07-4064-2d6f-08d88ab71c2b'
                            ? 'Không thu phí'
                            : 'Thu phí'
                        } - ${s.name}`}
                        checked={selectedIdList.includes(s.id)}
                        onChange={(e, { checked }): void => {
                          setSelectedServiceIds((l) =>
                            checked
                              ? [...l, s.id]
                              : l.filter((i) => i !== s.id),
                          );
                        }}
                      />
                      <br />
                    </React.Fragment>
                  ))}
                </Accordion.Content>
              </React.Fragment>
            ))}
          </Accordion>
        </Modal.Content>
        <Modal.Actions>
          <Button
            primary
            content={`Xác nhận chọn ${selectedServiceIds.length} mũi tiêm`}
            onClick={(): void => setOpen(false)}
          />
        </Modal.Actions>
      </Modal>
    </Wrapper>
  );
};

export default VaccinationServicePicker;
