import type { Metadata } from 'next';
import { Schibsted_Grotesk } from 'next/font/google';

import { cn } from '@/lib/utils';
import { ConvexClientProvider } from '@/providers/convex-client-provider';
import { GlobalStoreProvider } from '@/providers/global-store-provider';
import { QueryClientProvider } from '@/providers/query-client-provider';
import { Sidebar } from '@/components/sidebar/sidebar';

import './globals.css';

import { UserContextProvider } from '@/providers/use-context-provider';
import { SidebarMobile } from '@/components/sidebar/sidebar-mobile';

const fontSans = Schibsted_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Film Chat',
};

export default async function RootLayout(props: { children: React.ReactNode; modal?: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn('text-foreground-0 bg-background-0', fontSans.className)}>
        <QueryClientProvider>
          <ConvexClientProvider>
            <UserContextProvider>
              <GlobalStoreProvider>
                <div className="flex h-screen overflow-hidden">
                  <Sidebar className="hidden h-screen shrink-0 lg:block lg:w-[260px]" />
                  <SidebarMobile className="lg:hidden" sidebarComponent={<Sidebar />} />
                  <div className="bg-background-1 w-full">{props.children}</div>
                  {props?.modal}
                </div>
              </GlobalStoreProvider>
            </UserContextProvider>
          </ConvexClientProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
