import { SidebarData } from '@/components/app-shell/components/sidebar-items';

export const links: SidebarData[] = [
  {
    name: '2D Projects',
    projects: [
      { title: 'Particles', url: '/particles' },
      { title: 'Particles New', url: '/particles-new' },
      { title: 'Family', url: '/family' },
    ],
  },
  {
    name: '3D Projects',
    projects: [
      { title: 'Holidays', url: '/holidays' },
      { title: 'Birthdays', url: '/birthdays' },
    ],
  },
];

const mapUrlToTitle = (links: SidebarData[]): Map<string, string> => {
  const map = new Map<string, string>();
  for (const group of links) {
    for (const project of group.projects) {
      map.set(project.url, project.title);
    }
  }
  return map;
};

export const urlToTitleMap = mapUrlToTitle(links);
