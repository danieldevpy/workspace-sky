import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";

export interface PageProps {
  name: string;
  component: React.ReactNode;
}

function GetAba(name?: string){
  if (!name) return 0;
  switch(name){
    case 'context':
      return 1
  }
  return 0;
}


export default function TabPages(props: { pages: PageProps[], aba?: string }) {
  const { pages } = props;
  const [selectedTab, setSelectedTab] = useState(GetAba(props.aba));

  return (
    <Box>
      {/* Aba de navegação */}
      <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)}>
        {pages.map((page, index) => (
          <Tab key={index} label={page.name} />
        ))}
      </Tabs>

      {/* Conteúdo da aba selecionada */}
      <Box sx={{ mt: 2 }}>{pages[selectedTab].component}</Box>
    </Box>
  );
}
