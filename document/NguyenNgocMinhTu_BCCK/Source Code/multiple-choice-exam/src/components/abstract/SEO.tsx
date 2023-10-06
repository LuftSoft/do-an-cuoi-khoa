import Head from 'next/head';
import type { FC } from 'react';

// ====================================================================
type SEOProps = {
  title: string;
  siteName?: string;
  description?: string;
};
// ====================================================================

const SEO: FC<SEOProps> = ({
  title,
  description,
  siteName = 'Hệ thống quản lý đề thi trắc nghiệm',
}) => {
  return (
    <Head>
      <title>{`${title} | ${siteName}`}</title>
      <meta name='description' content={description} />
    </Head>
  );
};

export default SEO;
