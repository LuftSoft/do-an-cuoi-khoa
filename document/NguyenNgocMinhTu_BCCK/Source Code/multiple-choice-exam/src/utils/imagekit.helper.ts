import { IKCore } from 'imagekitio-react';

import { IKPublicContext } from 'constants/imagekit.constant';

interface HandleUpload {
  folderName: string;
  fileName?: string;
  onUploadStart?: () => void;
  onUploadSuccess?: (results: any, context?: Record<string, any>) => void;
  onUploadError?: (error: any) => void;
  context?: Record<string, any>;
}

export const handleUpload = async (
  {
    fileName,
    onUploadError,
    onUploadStart,
    onUploadSuccess,
    folderName,
    context,
  }: HandleUpload,
  files: File[],
) => {
  onUploadStart?.();
  const imagekit = new IKCore(IKPublicContext);

  const uploadPromises: any[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const uploadPromise = imagekit.upload({
      file,
      fileName: fileName || file.name,
      folder: folderName,
      responseFields: ['url'],
      // useUniqueFileName: false,
    });

    uploadPromises.push(uploadPromise);
  }

  try {
    const results = await Promise.all(uploadPromises);
    onUploadSuccess?.(results, context);
  } catch (error) {
    console.log('file: imagekit.helper.ts:45 - error:', error);
    onUploadError?.(error);
  }
};
