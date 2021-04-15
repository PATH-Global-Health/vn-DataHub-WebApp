import React, { useEffect, useMemo } from 'react';
import { Dropdown, Popup } from 'semantic-ui-react';
import { FiLogOut, FiUser, FiInfo } from 'react-icons/fi';
import styled from 'styled-components';

import { useHistory } from 'react-router-dom';

import { useAuth, useSelector, useDispatch } from '@app/hooks';
import { getUserInfo } from '@app/slices/auth';

import packageJson from '../../../../package.json';

const IconWrapper = styled.span`
  margin-right: 8px;
  vertical-align: middle;
`;
const icon = (i: React.ReactNode): React.ReactNode => (
  <IconWrapper>{i}</IconWrapper>
);

const UserProfileButton: React.FC = () => {
  const { userInfo, getUserInfoLoading } = useSelector((state) => state.auth);
  const { logout } = useAuth();
  const history = useHistory();

  const dispatch = useDispatch();
  useEffect(() => {
    if (!userInfo) {
      dispatch(getUserInfo());
    }
  }, [dispatch, userInfo]);

  const fullName = useMemo(
    (): string => userInfo?.name ?? userInfo?.email ?? 'Loading...',
    [userInfo],
  );

  return (
    <Popup
      pinned
      inverted
      size="mini"
      position="bottom right"
      content={fullName}
      trigger={
        <Dropdown
          className="link item"
          icon={<FiUser style={{ marginLeft: 8 }} />}
          text={`${fullName.substring(0, 10)}...`}
          loading={getUserInfoLoading}
        >
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={(): void => {
                logout();
                setTimeout(() => {
                  history.push('/');
                  window.location.reload();
                }, 0);
              }}
              content="Đăng xuất"
              icon={icon(<FiLogOut />)}
            />
            <Dropdown.Divider />
            <Dropdown.Item
              disabled
              content={packageJson.version}
              icon={icon(<FiInfo />)}
            />
          </Dropdown.Menu>
        </Dropdown>
      }
    />
  );
};

export default React.memo(UserProfileButton);
