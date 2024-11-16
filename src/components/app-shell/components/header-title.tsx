'use client';

import { Fragment } from 'react';

import { urlToTitleMap } from '@/components/app-shell/links';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const HeaderTitle = () => {
  const pathName = usePathname();
  const pathNames = pathName.split('/').filter((path) => path !== '');

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {pathNames.map((path, index) => {
          const href = `/${pathNames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathNames.length - 1;

          if (isLast) {
            const linkName = urlToTitleMap.get(href);
            return <BreadcrumbPage key={href}>{linkName}</BreadcrumbPage>;
          }

          const linkName = path[0].toUpperCase() + path.slice(1);

          return (
            <Fragment key={href}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={href}>{linkName}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

// return <div>{urlToTitleMap.get(pathName)}</div>;
