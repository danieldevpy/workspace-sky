import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CardHeader,
  IconButton,
  Tooltip
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ShareIcon from "@mui/icons-material/Share";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Link from "next/link";
import { WorkSpace } from "@/app/(dashboard)/workspace/schema/WorkSpace";
import { EmbedWorkPage } from "./EmbedWorkPage";
import banner from "../assets/banner.jpg";

export default function ContainerWorkSpace({ workspace }: { workspace: WorkSpace }) {
  const [embedVisible, setEmbedVisible] = useState(false);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [updatedUrls, setUpdatedUrls] = useState<Record<number, string>>({});
  const [img, setImg] = useState(workspace.image || banner.src);

  useEffect(() => {
    if (workspace.workpages.length > 0 && !activePageId) {
      setActivePageId(String(workspace.workpages[0].id));
    }
  }, [workspace, activePageId]);

  useEffect(() => {
    if (!workspace.image) setImg(banner.src);
  }, [workspace.image]);

  const handleUpdateUrl = (pageId: number, newUrl: string) => {
    setUpdatedUrls((prev) => ({ ...prev, [pageId]: newUrl }));
  };

  return (
    <>
      <Card sx={{ maxWidth: 345, width: "100%", boxShadow: 3 }}>
        <CardHeader
          action={
            <Tooltip title="Configurações">
              <IconButton component={Link} href={`/workspace/${workspace.slug}`}>
                <SettingsIcon />
                <Typography>Configurações</Typography>
              </IconButton>
            </Tooltip>
          }
          title={
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {workspace.name}
            </Typography>
          }
        />
        <CardMedia
          component="img"
          sx={{
            height: 140,
            width: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
          image={img}
          alt={`Imagem do workspace ${workspace.name}`}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {workspace.description || "Sem descrição disponível."}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" startIcon={<ShareIcon />} disabled>
            Compartilhar
          </Button>
          <Button size="small" startIcon={<VisibilityIcon />} onClick={() => setEmbedVisible(true)}>
            Visualizar
          </Button>
        </CardActions>
      </Card>

      <EmbedWorkPage
        open={embedVisible}
        workpages={workspace.workpages}
        handleClose={() => setEmbedVisible(false)}
        activePageId={activePageId}
        setActivePageId={setActivePageId}
        updatedUrls={updatedUrls}
        handleUpdateUrl={handleUpdateUrl}
      />
    </>
  );
}
