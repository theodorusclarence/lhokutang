import { AppProps } from 'next/app';
import Router from 'next/router';
import { SessionProvider } from 'next-auth/react';
import nProgress from 'nprogress';
import { SWRConfig } from 'swr';

import '@/styles/globals.css';
import '@/styles/nprogress.css';

import axiosClient from '@/lib/axios';

import DismissableToast from '@/components/DismissableToast';
import FullScreenLoading from '@/container/FullScreenLoading';

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeError', nProgress.done);
Router.events.on('routeChangeComplete', nProgress.done);

type AppAuthProps = AppProps & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: Pick<AppProps, 'Component'> & Partial<{ auth: boolean }>;
};

function MyApp({ Component, pageProps }: AppAuthProps) {
  return (
    <SessionProvider>
      <DismissableToast />

      <SWRConfig
        value={{
          fetcher: (url) => axiosClient.get(url).then((res) => res.data),
        }}
      >
        {Component.auth ? (
          <FullScreenLoading>
            <Component {...pageProps} />
          </FullScreenLoading>
        ) : (
          <Component {...pageProps} />
        )}
      </SWRConfig>
    </SessionProvider>
  );
}

export default MyApp;
