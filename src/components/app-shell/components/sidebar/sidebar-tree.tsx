'use client';

import { ChevronRight, Folder, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Links } from '@/components/app-shell/components/sidebar/links';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	useSidebar,
} from '@/components/ui/sidebar';

export const SidebarTree = ({
	subItem,
}: {
	subItem: Links[number]['subcategories'][number];
}) => {
	const pathname = usePathname();
	const { setOpenMobile } = useSidebar();
	const closeMobile = () => setOpenMobile(false);
	const isOpen = subItem.projects.some((project) => project.url === pathname);

	return (
		<SidebarMenuItem key={subItem.title}>
			<Collapsible
				className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
				defaultOpen={isOpen}
			>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton>
						<ChevronRight className="transition-transform" />
						<Folder />
						{subItem.title}
					</SidebarMenuButton>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarMenuSub className="mr-0 pr-0">
						{subItem.projects.map((project) => (
							<Link key={project.title} href={project.url}>
								<SidebarMenuButton
									isActive={project.url === pathname}
									onClick={closeMobile}
								>
									<LinkIcon />
									{project.title}
								</SidebarMenuButton>
							</Link>
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</Collapsible>
		</SidebarMenuItem>
	);
};
