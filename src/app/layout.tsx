import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { cn } from '@/lib/utils/cn';
import { GlobalStoreProvider } from '@/providers/global-store-provider';
import { QueryClientProvider } from '@/providers/query-client-provider';
import { Sidebar } from '@/components/sidebar/sidebar';

import './globals.css';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Filmlist',
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn(
          'bg-background-0 fixed top-0 left-0 h-screen w-screen overflow-y-hidden',
          fontSans.className
        )}
      >
        <QueryClientProvider>
          <GlobalStoreProvider>
            <div className="fixed top-0 left-0 grid h-full w-full grid-cols-[260px_1fr]">
              <Sidebar className="w-full" />
              {props.children}
            </div>

            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          </GlobalStoreProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
