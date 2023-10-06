import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import PersonOutline from '@mui/icons-material/PersonOutline';
import {
  Avatar,
  CircularProgress,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import type { Dispatch, MouseEventHandler, SetStateAction } from 'react';
import { useState, type FC } from 'react';

import { StyledUserName } from './LayoutStyledComponents';

import { H4, H6, Paragraph, Small } from 'components/abstract/Typography';
import FlexRowCenter from 'components/utils-layout/flex-box/FlexRowCenter';
import { getAvatarUrl, getFullName } from 'utils/account.helper';

type UserMenuProps = {
  minimized: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  setLogOutDialogVisible: Dispatch<SetStateAction<boolean>>;
};

const UserMenu: FC<UserMenuProps> = ({
  minimized,
  setMenuOpen,
  setLogOutDialogVisible,
}) => {
  const { data: session, status } = useSession();
  const account = session?.user;

  const isAuthenticated = status === 'authenticated';
  const isLoadingSession = status === 'loading';

  const [anchorEl, setAnchorEl] = useState<EventTarget | null>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (isAuthenticated) {
      setMenuOpen(true);
      setAnchorEl(event.currentTarget);
      return;
    }
  };

  const theme = useTheme();
  const avatarSize = 50;

  return (
    <>
      <FlexRowCenter flexDirection='column' my={5} gap={1.5}>
        <IconButton
          disabled={isLoadingSession}
          id='account-menu-button'
          sx={{ padding: isAuthenticated || isLoadingSession ? 0 : 1.25 }}
          onClick={handleClick}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          aria-controls={open ? 'account-menu' : undefined}
        >
          {isLoadingSession && <CircularProgress />}
          {isAuthenticated && (
            <Avatar
              alt={getFullName(account)}
              src={getAvatarUrl(account)}
              sx={{
                '& .MuiAvatar-img': {
                  objectFit: 'fill',
                },
                width: avatarSize,
                height: avatarSize,
              }}
            />
          )}

          {!isAuthenticated && !isLoadingSession && <PersonOutline />}
        </IconButton>

        <StyledUserName compact={minimized}>
          <H4>{getFullName(account)}</H4>
          <Paragraph fontSize={13} color={theme.palette.grey[400]}>
            {account?.lecturer.degree}
          </Paragraph>
        </StyledUserName>
      </FlexRowCenter>

      <Menu
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        id='account-menu'
        anchorEl={anchorEl as Element}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <FlexRowCenter flexDirection='column' pb={1}>
          <H6>{getFullName(account)}</H6>
          <Small color='grey.500'>{account?.lecturer?.degree}</Small>
        </FlexRowCenter>
        <Divider />

        <Link href='/profile'>
          <MenuItem>
            <ListItemIcon>
              <PermIdentityIcon />
            </ListItemIcon>
            Tài khoản của tôi
          </MenuItem>
        </Link>
        <Divider />

        <MenuItem onClick={() => setLogOutDialogVisible(true)}>
          <ListItemIcon>
            <LogoutOutlinedIcon />
          </ListItemIcon>
          Đăng xuất
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
