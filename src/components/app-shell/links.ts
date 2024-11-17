export type Links = typeof links;

export const links = [
  {
    category: '2D Projects',
    subcategories: [
      { title: 'Games', projects: [{ title: 'Pac Man', url: '/pacman' }] },
      {
        title: 'Particles',
        projects: [
          { title: 'Constellation', url: '/particles/constellation' },
          { title: 'Text', url: '/particles/text' },
          { title: 'Tunnel', url: '/particles/tunnel' },
          { title: 'Rotating', url: '/particles/rotating' },
        ],
      },
      {
        title: 'Circles',
        projects: [
          { title: 'Trail', url: '/circles/trail' },
          { title: 'Outline', url: '/circles/outline' },
          { title: 'Physics', url: '/circles/physics' },
          { title: 'Collision', url: '/circles/collision' },
        ],
      },
      {
        title: 'Other',
        projects: [
          { title: 'Matrix', url: '/matrix' },
          { title: 'Waves', url: '/waves' },
          { title: 'Fireworks', url: '/fireworks' },
        ],
      },
    ],
  },
] as const;

const mapUrlToTitle = (links: Links): Map<string, string> => {
  const map = new Map<string, string>();
  for (const category of links) {
    for (const subdirectory of category.subcategories) {
      for (const project of subdirectory.projects) {
        map.set(project.url, project.title);
      }
    }
  }
  return map;
};

export const urlToTitleMap = mapUrlToTitle(links);
