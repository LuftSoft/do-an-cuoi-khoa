import type { Theme } from '@mui/material';
import { Box, styled, useMediaQuery } from '@mui/material';
import type { FC, ReactNode } from 'react';
import { Fragment, useState } from 'react';

import { ToggleWrapper } from './LayoutStyledComponents';
import SideBar from './SideBar';

import Toggle from 'components/icons/Toggle';
import { exclude } from 'theme/styledConfigs';

const bannedProps = ['compact'];

const BodyWrapper = styled(Box, { shouldForwardProp: exclude(bannedProps) })<{
  compact: boolean;
}>(({ theme, compact }) => ({
  transition: 'margin-left 0.3s',
  marginLeft: compact ? '86px' : '280px',
  [theme.breakpoints.down('lg')]: { marginLeft: 0 },
}));

const InnerWrapper = styled(Box)(({ theme }) => ({
  transition: 'all 0.3s',
  [theme.breakpoints.up('lg')]: { maxWidth: 1200, margin: 'auto' },
  [theme.breakpoints.down(1550)]: { paddingLeft: '2rem', paddingRight: '2rem' },
}));

type Props = { children: ReactNode };

const PageLayout: FC<Props> = ({ children }) => {
  const [sidebarCompact, setSidebarCompact] = useState(false);
  const [showMobileSideBar, setShowMobileSideBar] = useState(false);
  const downLg = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  // handle sidebar toggle for desktop device
  const handleCompactToggle = () => setSidebarCompact((state) => !state);
  // handle sidebar toggle in mobile device
  const handleMobileDrawerToggle = () =>
    setShowMobileSideBar((state) => !state);

  return (
    <Fragment>
      {downLg && (
        <ToggleWrapper onClick={handleMobileDrawerToggle}>
          <Toggle />
        </ToggleWrapper>
      )}
      <SideBar
        sidebarCompact={sidebarCompact}
        showMobileSideBar={showMobileSideBar}
        setSidebarCompact={handleCompactToggle}
        setShowMobileSideBar={handleMobileDrawerToggle}
        isMobile={downLg}
      />

      <BodyWrapper compact={sidebarCompact}>
        <InnerWrapper>{children}</InnerWrapper>
      </BodyWrapper>
    </Fragment>
  );
};

export default PageLayout;
