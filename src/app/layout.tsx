import type { Metadata } from 'next';
import { Schibsted_Grotesk } from 'next/font/google';

import './globals.css';

import { cn } from '@/lib/utils';
import { QueryClientTRPCProvider } from '@/providers/query-client-trpc-provider';
import { Sidebar } from '@/components/sidebar/sidebar';
import { InitializeClient } from './initialize-client';

const fontSans = Schibsted_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Filmlist',
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn(
          'bg-background-0 text-foreground-0 fixed top-0 left-0 h-screen w-screen overflow-y-auto',
          fontSans.className
        )}
      >
        <QueryClientTRPCProvider>
          <div className="fixed top-0 left-0 flex h-full w-full">
            <Sidebar />
            {props.children}
          </div>
          <InitializeClient />
        </QueryClientTRPCProvider>
      </body>
    </html>
  );
}
