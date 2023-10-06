import { Avatar, Box } from '@mui/material';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useHoverDirty } from 'react-use';

import LayoutDrawer from './LayoutDrawer';
import {
  ListLabel,
  StyledText,
  BulletIcon,
  NavWrapper,
  NavItemButton,
  SidebarWrapper,
  ChevronLeftIcon,
  ListIconWrapper,
} from './LayoutStyledComponents';
import type { SideBarItem } from './SideBarItems';
import { SIDE_BAR_ITEMS } from './SideBarItems';
import UserMenu from './UserMenu';

import ConfirmDialog from 'components/common/dialogs/ConfirmDialog';
import Scrollbar from 'components/common/Scrollbar';
import FlexBetween from 'components/utils-layout/flex-box/FlexBetween';

// import useSignOutDialog from 'hooks/useSignOutDialog';

const TOP_HEADER_AREA = 100;

type SideBarProps = {
  sidebarCompact: boolean;
  showMobileSideBar: boolean;
  setSidebarCompact: () => void;
  setShowMobileSideBar: () => void;
  isMobile: boolean;
};

const SideBar: FC<SideBarProps> = (props) => {
  const {
    sidebarCompact,
    showMobileSideBar,
    setShowMobileSideBar,
    setSidebarCompact,
    isMobile,
  } = props;

  const router = useRouter();
  const [logOutDialogVisible, setLogOutDialogVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const sideBarRef = useRef<Element>(null);
  const isHovered = useHoverDirty(sideBarRef);

  const [menuOpen, setMenuOpen] = useState(false);

  const [minimized, setMinimized] = useState<boolean>(
    sidebarCompact && !isHovered && !menuOpen,
  );

  useEffect(() => {
    setMinimized(sidebarCompact && !isHovered && !menuOpen);
  }, [sidebarCompact, isHovered, menuOpen]);

  const activeRoute = (path = '') =>
    router.pathname.endsWith(`${path}/[id]`) ||
    router.pathname.endsWith(`${path}/create`) ||
    router.pathname.endsWith(path);

  // handle navigate to another route and close sidebar drawer in mobile device
  const handleNavigation = (path = '') => {
    router.push(path);
    setShowMobileSideBar();
  };

  const renderLevels = (items: SideBarItem[]) => {
    return items.map((item, index) => {
      if (item.type === 'header')
        return (
          <ListLabel key={index} compact={minimized}>
            {item.label}
          </ListLabel>
        );
      return (
        <Box key={index}>
          <NavItemButton
            key={item.label}
            className='navItem'
            active={activeRoute(item.path)}
            onClick={() => {
              if (item.type === 'logout') {
                setLogOutDialogVisible(true);
              } else {
                handleNavigation(item.path);
              }
            }}
          >
            {item?.icon ? (
              <ListIconWrapper>
                <item.icon />
              </ListIconWrapper>
            ) : (
              <BulletIcon active={activeRoute(item.path)} />
            )}

            <StyledText compact={minimized}>{item.label}</StyledText>
          </NavItemButton>
          {/* {item.isSignOut && signOutDialog} */}
        </Box>
      );
    });
  };

  const content = (
    <>
      <Scrollbar
        autoHide
        clickOnTrack={false}
        sx={{
          overflowX: 'hidden',
          maxHeight: `calc(100vh - ${TOP_HEADER_AREA}px)`,
        }}
      >
        <NavWrapper compact={sidebarCompact}>
          {renderLevels(SIDE_BAR_ITEMS)}
        </NavWrapper>
      </Scrollbar>
      <ConfirmDialog
        open={logOutDialogVisible}
        handleClose={() => setLogOutDialogVisible(false)}
        isLoading={isLoggingOut}
        handleConfirm={async () => {
          await signOut({ redirect: false });
          setIsLoggingOut(true);
          router.replace('/login');
        }}
        title='Đăng xuất'
        content='Bạn có chắc chắn muốn đăng xuất?'
      />
    </>
  );

  if (isMobile) {
    return (
      <LayoutDrawer
        open={showMobileSideBar ? true : false}
        onClose={setShowMobileSideBar}
      >
        <Box pt={2} px={2} maxHeight={TOP_HEADER_AREA}>
          <img
            alt='Logo'
            height={45}
            width='auto'
            src='/assets/logos/white-fav-full.svg'
            style={{ marginLeft: 8 }}
          />
        </Box>
        <UserMenu
          minimized={minimized}
          setMenuOpen={setMenuOpen}
          setLogOutDialogVisible={setLogOutDialogVisible}
        />

        {content}
      </LayoutDrawer>
    );
  }

  return (
    <SidebarWrapper compact={minimized} ref={sideBarRef}>
      <FlexBetween
        pt={2}
        px={2}
        maxHeight={TOP_HEADER_AREA}
        justifyContent={minimized ? 'center' : 'space-between'}
      >
        <Avatar
          src={
            minimized
              ? '/assets/logos/white-fav.svg'
              : '/assets/logos/white-fav-full.svg'
          }
          sx={{
            borderRadius: 0,
            width: 'auto',
            height: 45,
            marginLeft: minimized ? 0 : 1,
          }}
        />

        <ChevronLeftIcon
          color='disabled'
          compact={minimized}
          onClick={setSidebarCompact}
          sideBarCompact={sidebarCompact}
        />
      </FlexBetween>

      <UserMenu
        minimized={minimized}
        setMenuOpen={setMenuOpen}
        setLogOutDialogVisible={setLogOutDialogVisible}
      />

      {content}
    </SidebarWrapper>
  );
};

export default SideBar;
