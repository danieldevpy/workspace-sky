// components/FloatingActionButton.tsx
import React from 'react';
import { SpeedDial, SpeedDialAction } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';



export interface ActionProps {
    icon: any;
    name: string;
    onClick: ()=> void;
    onRefresh?: () => void;
}

interface ActionsProps {
    actions: ActionProps[];
}

const FloatingActionButton: React.FC<ActionsProps> = ({actions}) => {
  const [open, setOpen] = React.useState(false);

  return (
      <SpeedDial
        ariaLabel="Ações"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<AddIcon />}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => {
              action.onClick? action.onClick():undefined
              setOpen(false);
            }}
          />
        ))}
      </SpeedDial>
  );
};

export default FloatingActionButton;
