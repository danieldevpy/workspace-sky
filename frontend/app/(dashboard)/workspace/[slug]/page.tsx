"use client"

import React from "react";
import { use } from "react";
import { WorkSpace } from "../schema/WorkSpace";
import { Box, Skeleton, Button, Typography } from "@mui/material";
import CapaControl from "../components/CapaControl";
import { ListWorkPage } from "../components/ListWorkPage";
import FloatingActionButton, {ActionProps} from "../components/FloatingButton";
import AddIcon from '@mui/icons-material/Add';
import CrudWorkPage, {CrudWorkPageRef} from "../components/CrudWorkPage";
import { EmbedWorkPage } from "../components/EmbedWorkPage";
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { CrudWorkSpace, CrudWorkSpaceRef } from "../components/CrudWorkSpace";

async function GetWorkSpace(slug: String) {
    const url = `/api/backend/workspaceroute/${slug}`;
    const response = await fetch(url);
    if (response.status == 401 || response.status == 403) {
        window.location.href = '/api/auth/signin?callbackUrl=/'
        return undefined;
    }
    const workspace: WorkSpace = await response.json();
    workspace.image = workspace.image ? `/api/image-proxy?url=${encodeURIComponent(workspace.image)}`: undefined;
    return workspace;
}

export default function DetailPage({ params }: {params: Promise<{slug: string}>}) {
    const { slug } = use(params)
    const crudWorkPageRef = React.useRef<CrudWorkPageRef>(null);
    const crudWorkSpaceRef = React.useRef<CrudWorkSpaceRef>(null);
    const [workspace, setWorkspace] = React.useState<WorkSpace>();
    const [embedVisible, setEmbedVisible] = React.useState(false);
    const [activePageId, setActivePageId] = React.useState<string | null>(null);
    const [updatedUrls, setUpdatedUrls] = React.useState<Record<number, string>>({});

    const updateWorkSpace =(slug: string)=> {
        GetWorkSpace(slug)
        .then(workspace=>{
            setWorkspace(workspace);
        })
    }

    React.useEffect(()=>{
        updateWorkSpace(slug);
    }, [])

    React.useEffect(() => {
        if (workspace && workspace.workpages.length > 0) {
            setActivePageId(String(workspace.workpages[0].id));
        }
    }, [workspace]);

    const actions: ActionProps[] = [
        {icon: <AddIcon/>, name: "teste", onClick:()=>crudWorkPageRef.current?.NewPage()},
    ]

    const handleUpdateUrl = (pageId: number, newUrl: string) => {
        setUpdatedUrls(prev => ({ ...prev, [pageId]: newUrl }));
    };

    const handleClose = () => setEmbedVisible(false);
    const handleOpen = () => setEmbedVisible(true);

    const reloadWindow =()=> {
        window.location.reload();
    }

    return (
        <Box>
            {workspace? (
                <Box >
                    <CapaControl workspace={workspace}>
                        <Box sx={{
                            padding: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}>
                            <Box>
                                <Typography variant="h5" color="white">{workspace.name}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Button variant="contained" startIcon={<VisibilityIcon />} onClick={handleOpen}>
                                    Visualizar
                                </Button>
                                <Button variant="contained" startIcon={<NoteAddIcon />} onClick={()=>crudWorkPageRef.current?.NewPage()}>
                                    Registrar Página
                                </Button>
                                <Button variant="contained" onClick={()=>crudWorkSpaceRef.current?.EditWorkSpace(workspace)} startIcon={<SettingsIcon />}>
                                    Configurações
                                </Button>
                                </Box>
                            </Box>
                    </CapaControl>
                    <br></br>
                    <ListWorkPage workpages={workspace.workpages||[]} editWorkPage={(workpage)=>crudWorkPageRef.current?.EditPage(workpage)}/>
                    <FloatingActionButton actions={actions}/>
                    <CrudWorkPage ref={crudWorkPageRef} workpageID={workspace.id} reload={()=>updateWorkSpace(slug)}/>
                    <CrudWorkSpace ref={crudWorkSpaceRef} reload={reloadWindow} />
                    <EmbedWorkPage 
                        open={embedVisible}
                        workpages={workspace.workpages}
                        handleClose={handleClose}
                        activePageId={activePageId}
                        setActivePageId={setActivePageId}
                        updatedUrls={updatedUrls}
                        handleUpdateUrl={handleUpdateUrl}
                    />
                </Box>
            ): (
                <Box>
                    <Skeleton variant="rectangular" width="100%" height={300} />
                    <br></br>
                    <Skeleton variant="rectangular" width="100%" height={100} />
                    <br></br>
                    <Skeleton variant="rectangular" width="100%" height={50} />
                    <br></br>
                    <Skeleton variant="rectangular" width="100%" height={50} />
                    <br></br>
                    <Skeleton variant="rectangular" width="100%" height={50} />
                </Box>
            )}
        </Box>
    )

}