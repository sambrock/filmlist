import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { GlobalStoreProvider } from '@/store/global';
import './globals.css';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Filmlist',
};

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout(props: React.PropsWithChildren) {
  return (
    <html lang="en">
      <GlobalStoreProvider>
        <body className={cn('', fontSans.className)}>{props.children}</body>
      </GlobalStoreProvider>
    </html>
  );
}
