'use client';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, TextField } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import React, { useState } from "react";
import { extractActionLinks, getLinkFromTemplate, postData } from "@/app/lib/utils";
import { ActionLink, Page } from "@/app/lib/types";
import halfred from 'halfred'

type Props = {
    journalId: string,
    actionLink: ActionLink,
    addPage: (page: Page) => void
}

export default function NewPageDialog({ journalId, actionLink, addPage }: Props) {
    const [open, setOpen] = useState(false);

    let url = actionLink.templated ? 
        getLinkFromTemplate(actionLink, journalId) : actionLink.href;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const formDataJson = Object.fromEntries((formData as any).entries());
        formDataJson.journalId = journalId;

        const res = await postData(url, JSON.stringify(formDataJson));
        if (res.ok) {
            const resource = halfred.parse(await res.json());
            const page = (resource.original() as Page);
            page.actionLinks = extractActionLinks(resource);
            addPage(page);

            handleClose();
        }

    }

    return (
        <React.Fragment>
            <Fab color="primary" onClick={ handleClickOpen }>
                <AddIcon />
            </Fab>

            <Dialog open={ open } onClose={ handleClose }
                    disableRestoreFocus={ true }
                    PaperProps={{
                        component: 'form',
                        onSubmit: handleOnSubmit
                    }}>
                <DialogTitle>New Page</DialogTitle>

                <DialogContent>
                    <TextField 
                        autoFocus
                        required
                        margin="dense"
                        id="title"
                        name="title"
                        label="Page Title"
                        type="text"
                        fullWidth
                        variant="standard"
                        />
                    <TextField 
                        required
                        margin="dense"
                        id="content"
                        name="content"
                        placeholder="Your notes here..."
                        type="text"
                        fullWidth
                        multiline
                        rows={8}
                        variant="standard"
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={ handleClose }>Cancel</Button>
                    <Button type="submit">Add</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}