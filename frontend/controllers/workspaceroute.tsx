import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';

type NavigationItem = {
  kind?: 'header';
  segment?: string;
  title: string;
  icon?: React.ReactNode;
  children?: NavigationItem[];
};

type Navigation = NavigationItem[];

// Array dinâmico que pode ser modificado ou recebido via props
const dynamicWorkspaceItems: Navigation = [
  {
    segment: 'workspace/vpsmagma',
    title: 'Vps Magma',
    icon: <DashboardIcon />,
  },
 
];

export {dynamicWorkspaceItems};

