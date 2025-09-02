import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { cn } from '@/lib/utils/cn';
import { GlobalStoreProvider } from '@/providers/global-store-provider';
import { QueryClientProvider } from '@/providers/query-client-provider';
import { UserContextProvider } from '@/providers/user-context-provider';
import { Sidebar } from '@/components/sidebar/sidebar';

import './globals.css';

import { ChatStoreProvider } from '@/providers/chat-store-provider';

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
      <body className={cn('text-foreground-0 bg-background-0', fontSans.className)}>
        <QueryClientProvider>
          <UserContextProvider>
            <GlobalStoreProvider>
              <ChatStoreProvider>
                <div className="flex h-screen overflow-hidden">
                  <Sidebar className="h-screen w-[260px] shrink-0" />
                  <div className="w-full">{props.children}</div>
                </div>
              </ChatStoreProvider>
            </GlobalStoreProvider>
          </UserContextProvider>

          <ReactQueryDevtools />
        </QueryClientProvider>
      </body>
    </html>
  );
}
