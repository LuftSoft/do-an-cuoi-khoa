import type { ReactElement } from 'react';

import PageLayout from 'components/layout';
import type { NextPageWithLayout } from 'types/common';

const MockTestPage: NextPageWithLayout = () => {
  return <div>Mock Test Page</div>;
};

MockTestPage.getLayout = function getLayout(page: ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};

export default MockTestPage;
