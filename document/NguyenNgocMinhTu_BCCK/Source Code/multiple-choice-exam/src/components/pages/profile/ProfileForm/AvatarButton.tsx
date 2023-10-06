import { CameraEnhance } from '@mui/icons-material';
import { Avatar, Button, CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { IKUpload } from 'imagekitio-react';
import { useSnackbar } from 'notistack';
import { useRef, type FC, useState } from 'react';

import { updateAccount } from 'apiCallers/profile';
import type { UpdateAccountWithIdDto } from 'backend/dtos/profile.dto';
import FlexBox from 'components/utils-layout/flex-box/FlexBox';
import { IKPublicContext } from 'constants/imagekit.constant';
import type { ApiReturnData, Id } from 'types/common';
import type { BaseAccount } from 'utils/account.helper';
import { getAvatarUrl, reloadSession } from 'utils/account.helper';
import { getDefaultOnApiError } from 'utils/error.helper';

interface UploadSuccessResponse {
  url: string;
}

type AvatarButtonProps = {
  user: BaseAccount & Id;
};

const AvatarButton: FC<AvatarButtonProps> = ({ user }) => {
  const { enqueueSnackbar } = useSnackbar();
  const uploadRef = useRef<HTMLInputElement>();
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: invokeUpdateAccount } = useMutation<
    ApiReturnData<typeof updateAccount>,
    unknown,
    UpdateAccountWithIdDto
  >({
    mutationFn: (data) => updateAccount(data),
    onSuccess: () => {
      enqueueSnackbar(`Đổi ảnh đại diện thành công`, {
        variant: 'success',
      });
      setIsUploadingImage(false);

      reloadSession();

      queryClient.refetchQueries({
        queryKey: ['accounts', user.id],
      });
    },
    onError: (error: AxiosError) => {
      getDefaultOnApiError({
        operationName: `đổi ảnh đại diện`,
        onDone: () => setIsUploadingImage(false),
      })(error);
    },
  });

  const updateAvatar = (input: { avatarUrl: string }) => {
    invokeUpdateAccount({
      id: user.id,
      avatarUrl: input.avatarUrl,
    });
  };

  return (
    <FlexBox alignItems='flex-end' mb={3}>
      {isUploadingImage ? (
        <CircularProgress size={40} />
      ) : (
        <Avatar
          src={getAvatarUrl(user)}
          sx={{
            height: 50,
            width: 50,
            '& .MuiAvatar-img': {
              objectFit: 'fill',
            },
          }}
        />
      )}

      <Box ml={-2.5}>
        <label htmlFor='profile-image'>
          <Button
            onClick={() => {
              if (uploadRef && uploadRef.current) {
                uploadRef.current.click();
              }
            }}
            component='span'
            color='marron'
            sx={{
              ml: 1,
              p: '3px',
              height: 'auto',
              bgcolor: 'grey.300',
              borderRadius: '50%',
            }}
          >
            <CameraEnhance fontSize='small' />
          </Button>
        </label>
      </Box>

      <Box display='none'>
        {/* @ts-ignore */}
        <IKUpload
          {...IKPublicContext}
          accept='image/*'
          inputRef={uploadRef as any}
          fileName={user.id}
          useUniqueFileName={false}
          responseFields={['url']}
          folder='/user-avatars'
          validateFile={(file: File) => {
            const isValidAvatar = file.type.startsWith('image/');
            if (!isValidAvatar) {
              enqueueSnackbar('Ảnh đại diện phải là ảnh', {
                variant: 'error',
              });
              return false;
            }
            return true;
          }}
          onUploadStart={() => {
            setIsUploadingImage(true);
          }}
          onError={(err: any) => {
            console.log(err);
            // setIsUploadingImage(false);
            enqueueSnackbar('Đã có lỗi xảy ra khi thay đổi ảnh đại diện', {
              variant: 'error',
            });
          }}
          onSuccess={(response: UploadSuccessResponse) => {
            setIsUploadingImage(false);
            const newAvatarUrl = `${response.url}?updatedAt=${Date.now()}`;
            updateAvatar({ avatarUrl: newAvatarUrl });
          }}
        />
      </Box>
    </FlexBox>
  );
};

export default AvatarButton;
