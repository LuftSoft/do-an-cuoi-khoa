import { Box, Card } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useState, type ReactElement, useMemo } from 'react';

import SEO from 'components/abstract/SEO';
import { H2, H3 } from 'components/abstract/Typography';
import SearchSkeleton from 'components/common/search/SearchSkeleton';
import PageLayout from 'components/layout';
import PasswordForm from 'components/pages/profile/PasswordForm';
import ProfileForm from 'components/pages/profile/ProfileForm';
import { useLeavePageConfirmation } from 'hooks/useLeavePageConfirmation ';
import type { ProfileActionMode } from 'types/common';
import { type NextPageWithLayout } from 'types/common';

const ProfilePage: NextPageWithLayout = () => {
  const { data, status } = useSession();

  const [profileMode, setProfileMode] = useState<ProfileActionMode>('view');
  const [passwordMode, setPasswordMode] = useState<ProfileActionMode>('view');

  const user = data?.user;

  const message = useMemo((): string => {
    const messageArray: string[] = [];
    if (profileMode === 'edit') {
      messageArray.push('thông tin cá nhân');
    }
    if (passwordMode === 'edit') {
      messageArray.push('mật khẩu');
    }
    return messageArray.join(' và ');
  }, [profileMode, passwordMode]);

  useLeavePageConfirmation(
    profileMode === 'edit' || passwordMode === 'edit',
    `Bạn đang trong chế độ chỉnh sửa ${message}, xác nhận huỷ bỏ chỉnh sửa và rời đi?`,
  );
  return (
    <>
      <SEO title='Cập nhật tài khoản' />
      <Box py={4}>
        <H2 mb={2}>Cập nhật tài khoản</H2>
        <Card
          sx={{
            mb: 3,
          }}
        >
          {status !== 'authenticated' ? (
            <SearchSkeleton />
          ) : (
            <Box p={4}>
              <H3 mb={3}>Thông tin cá nhân</H3>
              {/* Cant null, since it will return the Skeleton in that case */}
              <ProfileForm
                user={user!}
                mode={profileMode}
                setMode={setProfileMode}
              />
            </Box>
          )}
        </Card>

        <Card>
          {status !== 'authenticated' ? (
            <SearchSkeleton />
          ) : (
            <Box p={4}>
              <H3 mb={3}>Mật khẩu</H3>
              {/* Cant null, since it will return the Skeleton in that case */}
              <PasswordForm
                userId={user!.id}
                mode={passwordMode}
                setMode={setPasswordMode}
              />
            </Box>
          )}
        </Card>
      </Box>
    </>
  );
};

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};

export default ProfilePage;
