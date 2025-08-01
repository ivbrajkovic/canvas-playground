import { ChevronRight } from 'lucide-react';

import { links } from '@/components/app-shell/components/sidebar/links';
import { SidebarTree } from '@/components/app-shell/components/sidebar/sidebar-tree';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from '@/components/ui/sidebar';

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
                    {item.subcategories.map((subItem) => (
                      <SidebarTree key={subItem.title} subItem={subItem} />
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
