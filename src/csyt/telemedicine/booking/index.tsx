import React, { useEffect } from 'react';
// import { Menu, Tab } from 'semantic-ui-react';
// import {
//   FiHome,
//   // FiUsers
// } from 'react-icons/fi';
import styled from 'styled-components';

import { useDispatch, useSelector } from '@app/hooks';
import { getCustomers } from '../../catalog/customer/customer.slice';

import HospitalList from './components/HospitalList';
import DoctorList from './components/DoctorList';
import DoctorDetails from './components/DoctorDetails';
// import { selectHospital } from './booking.slice';

const Wrapper = styled.div`
  padding: 10px;
`;
// const TabLabel = styled.span`
//   margin-left: 6px;
// `;
const TabContentWrapper = styled.div`
  /* padding-top: 18px; */
  position: relative;
`;

// const panes = [
//   {
//     menuItem: (
//       <Menu.Item key={0}>
//         <FiHome />
//         <TabLabel>Cơ sở</TabLabel>
//       </Menu.Item>
//     ),
//   },
//   // {
//   //   menuItem: (
//   //     <Menu.Item key={2}>
//   //       <FiUsers />
//   //       <TabLabel>Chuyên gia</TabLabel>
//   //     </Menu.Item>
//   //   ),
//   // },
// ];

const TelemedicineBookingPage: React.FC = () => {
  const { selectedHospital, selectedDoctor } = useSelector(
    (s) => s.csyt.telemedicine.booking,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  return (
    <Wrapper>
      {/* <Tab
        menu={{ secondary: true, pointing: true }}
        panes={panes}
        onTabChange={(e, { activeIndex }) => {
          if (activeIndex === 0) {
            dispatch(selectHospital(undefined));
          }
        }}
      /> */}
      <TabContentWrapper>
        {!selectedHospital && <HospitalList />}
        {selectedHospital && !selectedDoctor && <DoctorList />}
        {selectedDoctor && <DoctorDetails />}
      </TabContentWrapper>
    </Wrapper>
  );
};

export default TelemedicineBookingPage;
