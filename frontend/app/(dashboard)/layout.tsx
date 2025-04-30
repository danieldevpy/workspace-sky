import * as React from 'react';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { GlobalComponentsProvider } from './workspace/context/globalContext';

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <GlobalComponentsProvider>
        <PageContainer>{props.children}</PageContainer>
      </GlobalComponentsProvider>
    </DashboardLayout>
  );
}  
