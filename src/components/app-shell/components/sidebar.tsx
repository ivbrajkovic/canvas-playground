import * as React from 'react';

import { SidebarTree2 } from '@/components/app-shell/components/sidebar-tree';
import { links } from '@/components/app-shell/links';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
  Sidebar as SidebarUI,
} from '@/components/ui/sidebar';
import { ChevronRight } from 'lucide-react';

export function Sidebar({ ...props }: React.ComponentProps<typeof SidebarUI>) {
  return (
    <SidebarUI
      // collapsible='icon'
      {...props}
    >
      <SidebarHeader className="h-16 items-center justify-center border-b border-sidebar-border">
        Canvas Playground
      </SidebarHeader>
      <SidebarContent>
        {links.map((item) => (
          <SidebarGroup key={item.category}>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroupLabel
                asChild
                className="group/label w-full text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <CollapsibleTrigger>
                  {item.category}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.subcategories.map((subItem, index) => (
                      <SidebarTree2 key={index} subItem={subItem} />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </SidebarUI>
  );
}
