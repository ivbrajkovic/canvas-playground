'use client';

import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';

export type SidebarData = {
  name: string;
  projects: {
    title: string;
    url: string;
  }[];
};

type SidebarItemsProps = {
  data: SidebarData[];
};

export function SideBarItems(props: SidebarItemsProps) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <>
      {props.data.map((item) => (
        <React.Fragment key={item.name}>
          <SidebarGroup key={item.name} className="py-0">
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroupLabel
                asChild
                className="group/label w-full text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <CollapsibleTrigger>
                  {item.name}{' '}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.projects.map((item) => (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton asChild isActive={pathname === item.url}>
                          <Link
                            href={item.url}
                            className="pl-4"
                            onClick={() => setOpenMobile(false)}
                          >
                            {item.title}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
          <SidebarSeparator className="mx-0" />
        </React.Fragment>
      ))}
    </>
  );
}
