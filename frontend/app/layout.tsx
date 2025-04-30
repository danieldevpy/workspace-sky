import * as React from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { SessionProvider, signIn, signOut } from 'next-auth/react';
import { auth } from '../auth';
import theme from '../theme';
import type { Navigation } from '@toolpad/core/AppProvider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { WorkSpace } from './(dashboard)/workspace/schema/WorkSpace';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';

const BRANDING = {
  title: 'Cisbaf WorkSpace',
};

const AUTHENTICATION = {
  signIn,
  signOut,
};

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Menu',
  },
  {
    segment: '',
    title: 'DashBoard',
    icon: <DashboardIcon />,
  },
  {
    kind: 'header',
    title: 'WorkSpaces',
  },
];

export default async function RootLayout(props: { children: React.ReactNode }) {
  const session = await auth();

  const url = `${process.env.BACKEND_URL}/api/workspaces/`;

  const response = await fetch(url, {
      headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
      },
  });


  if (response.status === 401 || response.status === 403) {
     
  }
  
  const workspaces: WorkSpace[] = await response.json();
  var navigation;

  if (workspaces.length > 0) {
    navigation = NAVIGATION.map(nvg=>{return nvg});

    workspaces.forEach((workspace, i)=>{
      navigation.push(
        {
          segment: `workspace/${workspace.slug}`,
          title: workspace.name,
          icon: <FolderSpecialIcon />,
        },
      )
    })
  } else {
    navigation = NAVIGATION;
  }

  return (
    <html lang="pt-br"  data-toolpad-color-scheme="light" suppressHydrationWarning>
      <head>
        <title>WorkSpace</title>
      </head>
      <body>
        <SessionProvider session={session}>
          <AppRouterCacheProvider  options={{ enableCssLayer: true }}>
            <NextAppProvider
              navigation={navigation}
              branding={BRANDING}
              session={session}
              authentication={AUTHENTICATION}
              theme={theme}
            >
              {props.children}
            </NextAppProvider>
          </AppRouterCacheProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
