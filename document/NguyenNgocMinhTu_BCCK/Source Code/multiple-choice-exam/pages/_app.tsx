import type { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { QueryClient } from '@tanstack/react-query';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import nProgress from 'nprogress';
import { useState, type ReactElement, type ReactNode } from 'react';

import SnackbarProvider from 'components/SnackbarProvider';
import QueryClientSsrProvider from 'contexts/QueryClientSsrProvider';
import createEmotionCache from 'createEmotionCache';
import MuiTheme from 'theme/MuiTheme';

// import '../public/assets/fonts/SVN-Rubik/index.css';
import 'nprogress/nprogress.css';
import 'simplebar-react/dist/simplebar.min.css';
import 'react-quill/dist/quill.snow.css';
import 'theme/styles.css';

// Binding events.
Router.events.on('routeChangeStart', () => nProgress.start());
Router.events.on('routeChangeComplete', () => nProgress.done());
Router.events.on('routeChangeError', () => nProgress.done());
// small change
nProgress.configure({ showSpinner: false });

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextPage & { getLayout?: (page: ReactElement) => ReactNode };
}

const App = (props: MyAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const { session, dehydratedState } = pageProps;
  const [queryClient] = useState(() => new QueryClient());

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta charSet='utf-8' />
        <meta
          name='description'
          content='Website quản lý ra đề thi trắc nghiệm'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
        <title>Hệ thống quản lý đề thi trắc nghiệm</title>
      </Head>

      <SessionProvider session={session}>
        <MuiTheme>
          <SnackbarProvider>
            <QueryClientSsrProvider
              queryClient={queryClient}
              dehydratedState={dehydratedState}
            >
              {getLayout(<Component {...pageProps} />)}
            </QueryClientSsrProvider>
          </SnackbarProvider>
        </MuiTheme>
      </SessionProvider>
    </CacheProvider>
  );
};

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// App.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps };
// };

export default appWithTranslation(App);
