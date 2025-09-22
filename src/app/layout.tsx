import type { Metadata } from 'next';
import { Schibsted_Grotesk } from 'next/font/google';

import { cn } from '@/lib/utils';
import { ConvexClientProvider } from '@/providers/convex-client-provider';
import { GlobalStoreProvider } from '@/providers/global-store-provider';
import { QueryClientProvider } from '@/providers/query-client-provider';
import { UserContextProvider } from '@/providers/use-context-provider';
import { Sidebar } from '@/components/sidebar/sidebar';
import { SidebarMobile } from '@/components/sidebar/sidebar-mobile';

import './globals.css';

const fontSans = Schibsted_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Film Chat - AI Movie Recommendations',
  description:
    'Get personalized movie recommendations powered by AI. Chat and discover your next favorite film!',
};

export default async function RootLayout(props: { children: React.ReactNode; modal?: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Film Chat" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>
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
