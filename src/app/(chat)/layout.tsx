import { QueryClientTRPCProvider } from '@/providers/query-client-trpc-provider';
import { UserProvider } from '@/providers/user-provider';

export default function Layout(props: React.PropsWithChildren) {
  return (
    <QueryClientTRPCProvider>
      <UserProvider userId="d0d0d495-3e20-42cc-b59a-1c9a15c18ff1" anon={true}>
        <div className="fixed top-0 left-0 grid h-screen w-screen">
          <main className="overflow-y-auto">{props.children}</main>
        </div>
      </UserProvider>
    </QueryClientTRPCProvider>
  );
}
