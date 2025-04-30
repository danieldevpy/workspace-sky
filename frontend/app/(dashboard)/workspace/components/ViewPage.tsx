import React from "react"
import { Box } from "@mui/material";

interface ViewPageProps {
    url: string;
}

const ViewPage: React.FC<ViewPageProps> = ({url}) => {

    return (
        <Box
        // key={workpage.id}
        sx={{
            width: '100%',
            height: '100%',
            // display: String(workpage.id) === activePageId ? 'block' : 'none',
        }}
        >
        <iframe
            src={url}
            style={{
                width: '100%',
                height: '100%',
                border: 'none'
              }}
            title="Iframe Example"></iframe>
        </Box>
    );
}

export default ViewPage;