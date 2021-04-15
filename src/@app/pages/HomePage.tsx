import React, { useState, useEffect, useMemo, ReactNode } from 'react';
import { Button, Tab, Container } from 'semantic-ui-react';
import { FiRefreshCw, FiUnlock, FiLock, FiX } from 'react-icons/fi';
import styled from 'styled-components';

import { useSelector, useDispatch } from '../hooks';
import {
  closeComponentTab,
  toggleLockComponentTab,
  openComponentTab,
} from '../slices/global';
import { getComponent } from '../utils/component-tree';

// #region styled
const HomePageContainer = styled.div`
  padding: 8px;
  padding-top: 0;
`;
const MenuButtonWrapper = styled.span`
  padding: 4px !important;
`;
const ButtonBase = styled(Button)`
  padding: 4px !important;
  padding-right: 80px !important;
  background: rgba(0, 0, 0, 0) !important;
  font-weight: 400 !important;
`;
const StyledButtonGroup = styled(Button.Group)`
  position: absolute !important;
  right: 4px !important;
`;
const StyledIconButton = styled(Button)`
  border-radius: 50% !important;
  padding: 5px !important;
  height: 22px !important;
  background: rgba(0, 0, 0, 0) !important;
  font-size: 12px !important;
  :hover {
    background: #cacbcd !important;
  }
`;
const ComponentWrapper = styled(Container)`
  display: ${(props): string => (props.hidden ? 'none' : 'block')} !important;
  padding: 8px;
  height: calc(100vh - 142px);
  overflow-y: auto;
  overflow-x: auto;
  background: white;
  border: 1px solid #d4d4d5;
  border-top: none;
`;
// #endregion

interface Component {
  groupKey: string;
  key: string;
  component: ReactNode;
}

const HomePage: React.FC = () => {
  const { tabList } = useSelector((state) => state.global);
  const dispatch = useDispatch();

  // #region tab list
  const panes = useMemo(
    () =>
      tabList.map((t) => {
        const component = getComponent(t.groupKey, t.key);
        return {
          menuItem: (): JSX.Element => (
            <MenuButtonWrapper
              key={`${t.groupKey}-${t.key}`}
              className={t.selected ? 'item active' : 'item'}
            >
              <ButtonBase
                size="mini"
                content={component?.title}
                disabled={tabList.some((e) => e.locked)}
                onClick={(): void => {
                  dispatch(
                    openComponentTab({ groupKey: t.groupKey, key: t.key }),
                  );
                }}
              />
              <StyledButtonGroup>
                <StyledIconButton
                  circular
                  size="mini"
                  icon={<FiRefreshCw />}
                  onClick={t.refreshCallback}
                />
                <StyledIconButton
                  circular
                  size="mini"
                  icon={t.locked ? <FiUnlock /> : <FiLock />}
                  disabled={tabList.some((e) => e.locked) && !t.locked}
                  onClick={(): void => {
                    dispatch(
                      toggleLockComponentTab({
                        groupKey: t.groupKey,
                        key: t.key,
                      }),
                    );
                  }}
                />
                <StyledIconButton
                  circular
                  size="mini"
                  icon={<FiX />}
                  disabled={t.locked}
                  onClick={(): void => {
                    dispatch(
                      closeComponentTab({ groupKey: t.groupKey, key: t.key }),
                    );
                  }}
                />
              </StyledButtonGroup>
            </MenuButtonWrapper>
          ),
        };
      }),
    [dispatch, tabList],
  );

  const hasSelected = tabList.some((c) => c.selected);
  const tabListNode = useMemo(
    () => (hasSelected ? <Tab panes={panes} renderActiveOnly={false} /> : null),
    [hasSelected, panes],
  );
  // #endregion

  // #region content list
  const [contentList, setContentList] = useState<Component[]>([]);
  useEffect(() => {
    // new component
    const newComp = tabList.find((t) =>
      contentList.every((c) => !(c.groupKey === t.groupKey && c.key === t.key)),
    );
    const comp = getComponent(newComp?.groupKey ?? '', newComp?.key ?? '');
    if (newComp && comp) {
      setContentList((cl) => [
        ...cl,
        {
          groupKey: newComp.groupKey,
          key: comp.key,
          component: comp.component,
        },
      ]);
    }

    // close component
    const closedComponent = contentList.find((e) =>
      tabList.every((t) => !(t.groupKey === e.groupKey && t.key === e.key)),
    );
    if (closedComponent) {
      setContentList((cl) =>
        cl.filter(
          (e) =>
            !(
              e.groupKey === closedComponent.groupKey &&
              e.key === closedComponent.key
            ),
        ),
      );
    }
  }, [tabList, contentList]);

  const selectedTab = tabList.find((e) => e.selected) ?? {
    groupKey: '',
    key: '',
  };
  const { groupKey: selectedGroupKey, key: selectedKey } = selectedTab;
  const contentListNode = useMemo(
    () => (
      <div>
        {contentList.map((c) => (
          <ComponentWrapper
            fluid
            key={`${c.groupKey}-${c.key}`}
            hidden={!(c.groupKey === selectedGroupKey && c.key === selectedKey)}
          >
            {c.component}
          </ComponentWrapper>
        ))}
      </div>
    ),
    [contentList, selectedGroupKey, selectedKey],
  );
  // #endregion

  return (
    <HomePageContainer>
      {tabListNode}
      {contentListNode}
    </HomePageContainer>
  );
};

export default HomePage;
