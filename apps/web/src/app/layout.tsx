import type { Metadata } from 'next';
import { Albert_Sans } from 'next/font/google';

import { cn } from '@/lib/utils/cn';
import { GlobalStoreProvider } from '@/providers/GlobalStoreProvider';
import { GlobalQueryClientProvider } from '@/providers/QueryClientProvider';
import { Header } from '@/components/layout/header/Header';
import { SideNav } from '@/components/sidenav/SideNav';
import './globals.css';

export const metadata: Metadata = {
  title: 'filmlist',
};

const fontSans = Albert_Sans({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={cn('bg-bg-default text-neutral-100', fontSans.className)}>
        <GlobalQueryClientProvider>
          <GlobalStoreProvider>
            <Header className="h-16 px-6" />

            <div className="flex h-[calc(100vh-64px)] gap-2 px-2 pb-2">
              <SideNav className="w-90" />

              <div className="@container/main w-full overflow-y-scroll rounded-lg bg-bg-subtle px-8">
                <main>{children}</main>
              </div>
            </div>
          </GlobalStoreProvider>
        </GlobalQueryClientProvider>
      </body>
    </html>
  );
}
