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
        <body className={cn('bg-[#1A1A1A] text-neutral-200', fontSans.className)}>
          <div className="overflow-y-none grid h-screen grid-cols-[240px_1fr]">
            <SideNav className="min-h-[700px] w-[240px]" />
            <main className="shadow-md bg-[#1E1E1E]">{props.children}</main>
          </div>
        </body>
      </GlobalStoreProvider>
    </html>
  );
}
