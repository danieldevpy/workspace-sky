// components/NavigationWithIcons.tsx
'use client';

import React from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import type { Navigation } from '@toolpad/core/AppProvider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';


const ICONS: Record<string, React.ReactNode> = {
  dashboard: <DashboardIcon />,
  folder: <FolderSpecialIcon />,
};

export default function NavigationWithIcons({
  navigationData,
  session,
  children,
}: {
  navigationData: any[]; // or more precise type
  session: any;
  children: React.ReactNode;
}) {
  const navigation: Navigation = navigationData.map((item) =>
    'icon' in item
      ? {
          ...item,
          icon: ICONS[item.icon] || undefined,
        }
      : item
  );

  return (
    <NextAppProvider
      navigation={navigation}
      branding={{ title: 'Cisbaf WorkSpace' }}
      session={session}
      authentication={{
        signIn: () => import('next-auth/react').then((mod) => mod.signIn()),
        signOut: () => import('next-auth/react').then((mod) => mod.signOut()),
      }}
    >
      {children}
    </NextAppProvider>
  );
}
