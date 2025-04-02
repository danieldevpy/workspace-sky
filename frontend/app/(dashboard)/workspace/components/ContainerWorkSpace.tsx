import React from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { WorkSpace } from "@/app/(dashboard)/workspace/schema/WorkSpace";
import { EmbedWorkPage } from "./EmbedWorkPage";

export default function ContainerWorkSpace({ workspace }: { workspace: WorkSpace }) {
    const [embedVisible, setEmbedVisible] = React.useState(false);
    const [activePageId, setActivePageId] = React.useState<string | null>(null);
    const [updatedUrls, setUpdatedUrls] = React.useState<Record<number, string>>({});

    React.useEffect(() => {
        if (workspace.workpages.length > 0 && !activePageId) {
            setActivePageId(String(workspace.workpages[0].id));
        }
    }, [workspace]);

    const handleUpdateUrl = (pageId: number, newUrl: string) => {
        setUpdatedUrls(prev => ({ ...prev, [pageId]: newUrl }));
    };

    const handleClose = () => setEmbedVisible(false);
    const handleOpen = () => setEmbedVisible(true);

    return(
        <><Card sx={{ maxWidth: 345, width: '100%' }}>
        <CardMedia
          component="img"
          sx={{ 
            height: 140,
            width: '100%',
            objectFit: 'cover',
            objectPosition: 'center' // Opcional: ajusta o enquadramento
          }}
          image={workspace.image}
          alt={workspace.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {workspace.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {workspace.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Compartilhar</Button>
          <Button size="small" onClick={handleOpen}>Visualizar</Button>
        </CardActions>
      </Card>
        <EmbedWorkPage 
            open={embedVisible}
            workpages={workspace.workpages}
            handleClose={handleClose}
            activePageId={activePageId}
            setActivePageId={setActivePageId}
            updatedUrls={updatedUrls}
            handleUpdateUrl={handleUpdateUrl}
        />
        </>
    )
}