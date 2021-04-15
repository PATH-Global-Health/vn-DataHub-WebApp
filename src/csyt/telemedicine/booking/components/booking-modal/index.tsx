import React, { useState, useMemo } from 'react';
import { Button, Dimmer, Grid, Loader, Modal, Step } from 'semantic-ui-react';
import {
  FiCalendar,
  FiInfo,
  FiFolderPlus,
  FiPaperclip,
  FiCreditCard,
} from 'react-icons/fi';
import styled from 'styled-components';

import { useSelector, useDispatch, useFetchApi, useConfirm } from '@app/hooks';
import { selectSlot } from '../../booking.slice';

import BookingInfoStep from './BookingInfoStep';
import SelectCustomerStep, {
  SelectCustomerStepBrief,
} from './SelectCustomerStep';
import AdditionalInfoStep, {
  AdditionalInfoStepBrief,
  AdditionalInformation,
} from './AdditionalInfoStep';
import FilePicker from '../../../shared/FilePicker';
import DiscountStep, { Discount, DiscountStepBrief } from './DiscountStep';

import bookingService from '../../booking.service';
import customerService from '../../../../catalog/customer/customer.service';
import telemedicineService from '../../../shared/telemedicine.service';
import { Customer } from '../../../../catalog/customer/customer.model';

const StepIconWrapper = styled.div`
  margin-right: 36px;
  font-size: 26px;
`;
const FluidStepContent = styled(Step.Content)`
  width: calc(100% - 62px);
`;
const NavigateButtonsWrapper = styled.div`
  margin-top: 12px;
`;

interface StepInfo {
  index: number;
  icon: React.ReactNode;
  title: string;
  description?: React.ReactNode;
}

const BookingModal: React.FC<{ onRefresh: () => void }> = (props) => {
  const {
    selectedHospital,
    selectedDoctor,
    selectedService,
    selectedSlotTimeId,
  } = useSelector((s) => s.csyt.telemedicine.booking);

  const [activeStep, setActiveStep] = useState(0);

  const [customerInfo, setCustomerInfo] = useState<Customer>();
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInformation>();
  const [fileList, setFileList] = useState<File[]>([]);
  const [discount, setDiscount] = useState<Discount>();

  const stepList = useMemo((): StepInfo[] => {
    return [
      {
        index: 0,
        icon: <FiCalendar />,
        title: 'Thông tin lịch hẹn',
        description: <BookingInfoStep />,
      },
      {
        index: 1,
        icon: <FiInfo />,
        title: 'Thông tin bệnh nhân',
        description: <SelectCustomerStepBrief value={customerInfo} />,
      },
      {
        index: 2,
        icon: <FiFolderPlus />,
        title: 'Thông tin thêm',
        description: <AdditionalInfoStepBrief value={additionalInfo} />,
      },
      {
        index: 3,
        icon: <FiPaperclip />,
        title: 'Đính kèm',
        description: <span>{`${fileList.length} files`}</span>,
      },
      {
        index: 4,
        icon: <FiCreditCard />,
        title: 'Thành tiền',
        description: <DiscountStepBrief value={discount} />,
      },
    ];
  }, [customerInfo, additionalInfo, fileList, discount]);

  const stepListNode = useMemo(
    () => (
      <Step.Group vertical fluid>
        {stepList.map((s) => (
          <Step
            key={s.index}
            active={activeStep === s.index}
            onClick={() => setActiveStep(s.index)}
          >
            <StepIconWrapper>{s.icon}</StepIconWrapper>
            <FluidStepContent>
              <Step.Title content={s.title} />
              <Step.Description content={s.description} />
            </FluidStepContent>
          </Step>
        ))}
      </Step.Group>
    ),
    [activeStep, stepList],
  );

  const dispatch = useDispatch();
  const { fetch, fetching } = useFetchApi();

  const { onRefresh } = props;
  const handleConfirm = async () => {
    if (
      customerInfo &&
      discount &&
      selectedHospital &&
      selectedDoctor &&
      selectedService &&
      selectedSlotTimeId
    ) {
      let customerId = customerInfo.id;
      if (customerId === '-1') {
        customerId = await fetch(customerService.createCustomer(customerInfo));
      }

      const ticketId = (
        await fetch(
          bookingService.register(
            selectedHospital.id,
            selectedDoctor.Id,
            selectedService.Id,
            selectedSlotTimeId,
            customerId,
            additionalInfo,
          ),
        )
      ).Id;

      await Promise.all([
        fetch(
          bookingService.payment(
            ticketId,
            discount.discountType,
            discount.discount,
            discount.paymentAmount,
          ),
        ),
        fetch(
          telemedicineService.uploadAttachments(
            ticketId,
            fileList,
            1,
            //
          ),
        ),
      ]);

      dispatch(selectSlot(undefined));
      onRefresh();
    }
  };

  const confirm = useConfirm();
  const navigateButtons = (
    <NavigateButtonsWrapper>
      {activeStep !== 0 && (
        <Button content="Trở lại" onClick={() => setActiveStep((s) => s - 1)} />
      )}
      {activeStep !== 4 && (
        <Button
          primary
          content="Tiếp theo"
          onClick={() => setActiveStep((s) => s + 1)}
        />
      )}
      {activeStep === 4 && (
        <Button
          primary
          disabled={!customerInfo}
          content="Xác nhận"
          onClick={() => confirm('Đặt lịch telemedicine?', handleConfirm)}
        />
      )}
    </NavigateButtonsWrapper>
  );

  return (
    <>
      <Modal
        size="large"
        open={Boolean(selectedSlotTimeId)}
        onClose={() => dispatch(selectSlot(undefined))}
      >
        <Modal.Content>
          <Grid>
            <Grid.Row>
              <Dimmer active={fetching} inverted>
                <Loader active={fetching} />
              </Dimmer>
              <Grid.Column width={fetching ? 16 : 10}>
                {stepListNode}
              </Grid.Column>
              {!fetching && (
                <Grid.Column width={6}>
                  {activeStep === 0 && <BookingInfoStep />}
                  {activeStep === 1 && (
                    <SelectCustomerStep
                      value={customerInfo}
                      onChange={setCustomerInfo}
                    />
                  )}
                  {activeStep === 2 && (
                    <AdditionalInfoStep
                      value={additionalInfo}
                      onChange={setAdditionalInfo}
                    />
                  )}
                  {activeStep === 3 && (
                    <FilePicker value={fileList} onChange={setFileList} />
                  )}
                  {activeStep === 4 && (
                    <DiscountStep value={discount} onChange={setDiscount} />
                  )}
                  {navigateButtons}
                </Grid.Column>
              )}
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default BookingModal;
