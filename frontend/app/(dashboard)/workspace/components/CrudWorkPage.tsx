import React from "react"
import ModalComponent from "./Modal";
import {
    TextField,
    InputAdornment,
    Box,
    Typography,
    Button
  } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import ViewPage from "./ViewPage";
import { WorkPage } from "../schema/WorkSpace";
import { useGlobalComponents } from "../context/globalContext";

interface CrudWorkPageProps {
    workpageID: number;
    reload: (params?: any)=> void;
}

export interface CrudWorkPageRef {
    NewPage: ()=> void;
    EditPage: (workpage: WorkPage)=> void;
}

const CrudWorkPage = React.forwardRef<CrudWorkPageRef, CrudWorkPageProps>((props, ref)=>{
    const [open, setOpen] = React.useState(false);
    const [textUrl, setTextUrl] = React.useState("");
    const [titlePage, setTitlePage] = React.useState("");
    const [url, setUrl] = React.useState("");
    const [workPageEdit, setWorkPageEdit] = React.useState<WorkPage>()
    const { showAlert, showBackdrop } = useGlobalComponents()

    const handleChangeUrl = (value: string)=> {
        var url = value.trim();
        url = url.replace(/^https?:\/\//, '');
        url = url.replace(/^www\./, '');
        setTextUrl(url);
        url = `https://${url}`
        setUrl(url)
    }

    const NewPage =()=>{
        setOpen(true);
        setWorkPageEdit(undefined);
    }

    const EditPage =(workpage: WorkPage)=>{
        setOpen(true);
        handleChangeUrl(workpage.url);
        setTitlePage(workpage.name);
        setWorkPageEdit(workpage);
    }

    const DeletePage =()=>{
        if (workPageEdit){
            showBackdrop(true);
            fetch(`/api/backend/workpagesroute/${workPageEdit.id}`, {
                method: "DELETE",
            })
            .then(()=>{
                handleCloseModal();
                props.reload();
            })
            .finally(()=>{
                showBackdrop(false);
            })
        }
    }

    const registerPage = async ()=> {
        var error;

        if (titlePage.length < 3) {
            error = "O titulo da pagina não pode ser menor que 3 caracteres!";
        }

        if (!url.length) {
            error = "A url do site não pode ser vazia!"
        }

        if (error) {
            showAlert({
                message: error,
                severity: 'error'
            });
            return;
        }
        showBackdrop(true);
        var request;
        if (workPageEdit) {
            workPageEdit.name = titlePage;
            workPageEdit.url = url;
            request = fetch(`/api/backend/workpagesroute/${workPageEdit.id}`, {
                method: "PUT",
                body: JSON.stringify(workPageEdit)
            })
        } else {
            request = fetch('/api/backend/workpagesroute', {
                method: "POST",
                body: JSON.stringify({
                   name: titlePage,
                   url: url,
                   type: "external",
                   workspaces_add: [props.workpageID], 
                })
            })
        }
        request.then(()=>{
            handleCloseModal();
            props.reload();
        })
        request.finally(()=>{
            showBackdrop(false);
        })

        
    }

    const handleCloseModal =()=> {
        setOpen(false);
        // setModelTitle(false);
        setUrl('');
        setTextUrl('');
        setTitlePage('');
        setWorkPageEdit(undefined);
    }

    React.useImperativeHandle(ref, ()=>({
        NewPage,
        EditPage
    }))

    return (
        <ModalComponent
            open={open}
            handleClose={handleCloseModal}>
            
            <Box 
                sx={{
                    padding: 5,
                    display: "flex",
                    gap: 5
                }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1
                        }}>
                        {workPageEdit?
                            <h3>Editar Pagina</h3>:
                            <h3>Registrar Pagina</h3>
                        }
                        <TextField
                            autoComplete="off"
                            variant="outlined"
                            placeholder="exemplo"
                            value={titlePage}
                            onChange={(e)=>setTitlePage(e.target.value)}
                            slotProps={{
                                input: {
                                  startAdornment: <InputAdornment position="start">Titulo:</InputAdornment>,
                                },
                              }}/>
                        <TextField
                            autoComplete="off"
                            variant="outlined"
                            placeholder="exemplo.com"
                            value={textUrl}
                            onChange={(e)=>handleChangeUrl(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <PublicIcon sx={{ color: '#888' }} />
                                    <Typography variant="body2" sx={{ ml: 1 }}>
                                    https://
                                    </Typography>
                                </InputAdornment>
                                ),
                                sx: {
                                '& input': {
                                    paddingLeft: '4px',
                                },
                                },
                            }}
                            />
   
                        <Box
                            sx={{
                                display: "flex",
                                gap: 1
                            }}>
                            <Button onClick={registerPage} variant="contained">Salvar</Button>
                            {workPageEdit?(
                                <>
                                <Button onClick={DeletePage} color="error" variant="contained">DELETAR</Button>
                                </>
                            ): undefined}
                        </Box>
                    </Box>

                    {url?<Box><ViewPage url={url}/></Box>: undefined}
            </Box>
        </ModalComponent>
    )

});
CrudWorkPage.displayName = "CrudWorkPage";
export default CrudWorkPage;
  