import React from "react";
import { Modal, Box } from "@mui/material";
import { WidthFull } from "@mui/icons-material";

const style = {
    position: 'absolute',
    maxWidth: "50%",
    maxHeight: "50%",
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,

  };

export default function ModalComponent({
    children,
    open,
    handleClose
}:{ // PROPS
    children: React.ReactNode,
    open: boolean;
    handleClose: ()=> void
}) {
    return (
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
            {children}
        </Box>
    </Modal>
    )
}