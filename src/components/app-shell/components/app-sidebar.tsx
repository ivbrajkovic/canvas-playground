import * as React from 'react';

import { SideBarItems } from '@/components/app-shell/components/sidebar-items';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { links } from '@/components/app-shell/links';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      // collapsible='icon'
      {...props}
    >
      <SidebarHeader className='h-16 border-b border-sidebar-border justify-center items-center'>
        Canvas Playground
      </SidebarHeader>
      <SidebarContent>
        <SideBarItems data={links} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
