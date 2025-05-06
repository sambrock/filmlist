import type { Metadata } from 'next';

import './globals.css';
import { GlobalStoreProvider } from '@/store/global';

export const metadata: Metadata = {
  title: 'Filmlist',
};

export default function RootLayout(props: React.PropsWithChildren) {
  return (
    <html lang="en">
      <GlobalStoreProvider>
        <body>{props.children}</body>
      </GlobalStoreProvider>
    </html>
  );
}
