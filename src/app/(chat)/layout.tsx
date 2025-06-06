import { QueryClientProvider } from '@/providers/query-client-provider';
import { UserProvider } from '@/providers/user-provider';
import { NavView } from '@/components/nav/nav-view';

export default function Layout(props: React.PropsWithChildren) {
  return (
    <QueryClientProvider>
      <UserProvider userId="37d387ec-32fd-45f7-af31-0df25936b241" anon={true}>
        <div className="fixed top-0 left-0 grid h-screen w-screen grid-cols-[260px_1fr]">
          <div>
            <NavView />
          </div>

          <main className="overflow-y-auto">{props.children}</main>
        </div>
      </UserProvider>
    </QueryClientProvider>
  );
}
