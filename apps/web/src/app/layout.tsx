import type { Metadata } from 'next';
import { Schibsted_Grotesk } from 'next/font/google';

import { cn } from '@/lib/utils';
import { GlobalStoreProvider } from '@/store/global';
import './globals.css';
import { SideNav } from '@/components/layout/SideNav/SideNav';

export const metadata: Metadata = {
  title: 'Filmlist',
};

const fontSans = Schibsted_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout(props: React.PropsWithChildren) {
  return (
    <html lang="en">
      <GlobalStoreProvider>
        <body className={cn('bg-surface-0 text-text-primary', fontSans.className)}>
          <div className="overflow-y-none grid h-screen grid-cols-[240px_1fr]">
            <SideNav className="border-border-0 h-screen border-r-2" />

            <div className="h-screen p-0">
              <main className="h-full">{props.children}</main>
            </div>
          </div>
        </body>
      </GlobalStoreProvider>
    </html>
  );
}
