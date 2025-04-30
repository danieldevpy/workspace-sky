import React from "react"
import { Box, TextField, Typography, Button} from "@mui/material"
import ModalComponent from "./Modal"
import { ApiRegisterWorkSpace, ApiEditWorkSpace, ApiDeleteWorkSpace } from "../controllers/apiWorkSpace";
import { useGlobalComponents } from "../context/globalContext";
import { WorkSpace } from "../schema/WorkSpace";

export interface CrudWorkSpaceRef {
    RegisterWorkSpace: ()=> void;
    EditWorkSpace: (workspace: WorkSpace)=> void;
}

interface CrudWorkSpaceProps {
    reload: (params?: any)=> void;
}

const CrudWorkSpace = React.forwardRef<CrudWorkSpaceRef, CrudWorkSpaceProps>((props, ref)=>{
    const [open, setOpen] = React.useState(false);
    const [formWorkSpace, setFormWorkSpace] = React.useState({name: '',description: ''});
    const { showAlert, showBackdrop } = useGlobalComponents();
    const [editabledWorkSpace, setEditabledWorkSpace] = React.useState<WorkSpace>();

    const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormWorkSpace({
            ...formWorkSpace,
            [name]: value
        });
    }

    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault();
        showBackdrop(true);
        var request;
        if (editabledWorkSpace) {
            editabledWorkSpace.name = formWorkSpace.name;
            editabledWorkSpace.description = formWorkSpace.description;
            request = ApiEditWorkSpace(editabledWorkSpace)

        } else {
            request = ApiRegisterWorkSpace({
                name: formWorkSpace.name,
                description: formWorkSpace.description
            })
        }
        request.then(()=>{
            handleCloseModal();
            props.reload();
        })
        request.finally(()=>showBackdrop(false));
    }

    const handleCloseModal =()=> {
        setOpen(false);
        setEditabledWorkSpace(undefined);
    }

    const RegisterWorkSpace =()=>{
        setOpen(true);
    }

    const DeleteWorkSpace =()=> {
        if(editabledWorkSpace) {
            showBackdrop(true);
            ApiDeleteWorkSpace(editabledWorkSpace)
            .then(()=>{
                window.location.href = '/';
            })
            .catch(()=>{
                showBackdrop(false);
            })
        }
    }

    React.useEffect(()=>{
        if(editabledWorkSpace) {
            setFormWorkSpace({
                ...formWorkSpace,
                ["name"]: editabledWorkSpace.name,
                ["description"]: editabledWorkSpace.description||"",
            });
            setOpen(true);
        } else {

        }
    }, [editabledWorkSpace])

    React.useImperativeHandle(ref, ()=>({
        RegisterWorkSpace,
        EditWorkSpace(workspace) {
          setEditabledWorkSpace(workspace);
        },
    }))
    

    return(
        <ModalComponent
            open={open}
            handleClose={handleCloseModal}>
            <Box
              aria-label="container"
              sx={{
                padding: 3
                }}>
                <Typography variant="h6">Registrar Novo WorkSpace</Typography>
                <Box
                    aria-label="formulario"
                    component='form'
                    onSubmit={handleSubmitForm}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        marginTop: 2
                    }}>
                    <TextField
                        name="name"
                        value={formWorkSpace.name}
                        onChange={handleChangeForm}
                        label='Nome'
                        required
                        />
                    <TextField
                        name="description"
                        value={formWorkSpace.description}
                        onChange={handleChangeForm}
                        label='Descrição'
                        multiline
                        required
                        rows={2}
                        />
                    <Box sx={{
                        display: "flex",
                        gap: 1
                    }}>
                        <Button fullWidth type="submit" variant="contained">Salvar</Button>
                        {editabledWorkSpace &&
                        <Box>
                            <Button variant="contained" color="error" onClick={DeleteWorkSpace}>Deletar</Button>
                        </Box>}
                    </Box>
                </Box>
            </Box>
        </ModalComponent>
    )
})
CrudWorkSpace.displayName = "CrudWorkSpace";
export {CrudWorkSpace};