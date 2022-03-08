import { AppProps } from 'next/app';
import Router from 'next/router';
import { SessionProvider } from 'next-auth/react';
import nProgress from 'nprogress';
import { SWRConfig } from 'swr';

import '@/styles/globals.css';
import '@/styles/nprogress.css';

import axiosClient from '@/lib/axios';

import DismissableToast from '@/components/DismissableToast';

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeError', nProgress.done);
Router.events.on('routeChangeComplete', nProgress.done);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <DismissableToast />

      <SWRConfig
        value={{
          fetcher: (url) => axiosClient.get(url).then((res) => res.data),
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </SessionProvider>
  );
}

export default MyApp;
