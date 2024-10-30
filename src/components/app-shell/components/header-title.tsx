'use client';

import { urlToTitleMap } from '@/components/app-shell/links';
import { usePathname } from 'next/navigation';

export const HeaderTitle = () => {
  const pathName = usePathname();
  return <div>{urlToTitleMap.get(pathName)}</div>;
};
