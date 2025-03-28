import * as React from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { SessionProvider, signIn, signOut } from 'next-auth/react';
import { auth } from '../auth';
import theme from '../theme';
import { MakeNavigationRoute } from '@/controllers/navigationRoute';
import type { Navigation } from '@toolpad/core/AppProvider';
import DashboardIcon from '@mui/icons-material/Dashboard';


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
  // {
  //   segment: '',
  //   title: 'Dashboard',
  //   icon: <DashboardIcon />,
  // },
  
  {
    segment: '',
    title: 'WorkSpaces',
    icon: <DashboardIcon />,
  },
 
];



export default async function RootLayout(props: { children: React.ReactNode }) {
  const session = await auth();
  
  return (
    <html lang="en" data-toolpad-color-scheme="light" suppressHydrationWarning>
      <body>
        <SessionProvider session={session}>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          
            <NextAppProvider
              navigation={NAVIGATION}
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
