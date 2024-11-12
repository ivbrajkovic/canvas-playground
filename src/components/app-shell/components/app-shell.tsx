import { PropsWithChildren } from 'react';

import { HeaderTitle } from '@/components/app-shell/components/header-title';
import { Sidebar } from '@/components/app-shell/components/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

type AppShellProps = PropsWithChildren;

export const AppShell = (props: AppShellProps) => {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <HeaderTitle />
        </header>
        <div className="flex-1 flex relative">{props.children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};
