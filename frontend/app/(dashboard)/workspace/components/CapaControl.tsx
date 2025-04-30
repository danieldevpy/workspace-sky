import React from "react";
import { Card, CardMedia, Box } from "@mui/material";
import { WorkSpace } from "../schema/WorkSpace";
import banner from "../assets/banner.jpg"

type WorkSpaceSummary = Omit<WorkSpace, 'description' | 'id' | 'workpages'>;

interface Props {
    workspace: WorkSpaceSummary;
    children?: React.ReactNode;
}

export default function CapaControl(props: Props) {
    const [img, setImg] = React.useState(props.workspace.image);
    const {workspace } = props;

    React.useEffect(()=>{
        if (!props.workspace.image) setImg(banner.src);
    }, [])

    return(
        <Card sx={{ width: '100%', position: "relative"}}>
            <Box
                sx={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    backgroundColor: "#000000ad"
            }}>
                {props.children}
            </Box>
            <CardMedia
                component="img"
                sx={{
                    width: '100%',
                    height: "300px",
                    objectFit: 'cover', // cobre o espaço mantendo proporção
                }}
                image={img}
                alt={workspace.name}
                />
        </Card>
    )
}