import type { Metadata } from 'next';
import { Schibsted_Grotesk } from 'next/font/google';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import './globals.css';

import { getCurrentUser } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { ClientStoreProvider } from '@/providers/client-store-provider';
import { QueryClientTRPCProvider } from '@/providers/query-client-trpc-provider';
import { UserContextProvider } from '@/providers/user-context-provider';
import { Sidebar } from '@/components/sidebar/sidebar';

const fontSans = Schibsted_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Filmlist',
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body
        className={cn(
          'bg-background-0 text-foreground-0 fixed top-0 left-0 h-screen w-screen overflow-y-auto',
          fontSans.className
        )}
      >
        <QueryClientTRPCProvider>
          <ClientStoreProvider>
            <UserContextProvider user={user}>
              <div className="fixed top-0 left-0 grid h-full w-full grid-cols-[260px_1fr]">
                <Sidebar className="w-full" />
                {props.children}
              </div>

              <ReactQueryDevtools initialIsOpen={false} />
            </UserContextProvider>
          </ClientStoreProvider>
        </QueryClientTRPCProvider>
      </body>
    </html>
  );
}
