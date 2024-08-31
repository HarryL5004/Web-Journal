'use client';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import React, { useState } from "react";
import halfred from "halfred";
import { extractActionLinks, getLinkFromTemplate, putData } from "../../lib/utils";
import { Journal } from "../../lib/types";

type Props = {
    journal: Journal,
    open: boolean,
    onClose: (submitted: boolean) => void,
}

export default function EditJournalDialog({ journal, open, onClose }: Props) {
    const [journalName, setJournalName] = useState(journal.name);

    const handleClose = (submitted: boolean = false) => {
        onClose(submitted);
        setJournalName(journal.name);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        journal.name = formData.get('name') as string;

        let updateActionLink = journal.actionLinks.update.href !== undefined ? 
            journal.actionLinks.update : journal.actionLinks.self;
        let updateLink = updateActionLink.templated ? getLinkFromTemplate(updateActionLink, '') :
            updateActionLink.href;

        const res = await putData(updateLink, JSON.stringify(journal));
        if (res.ok) {
            const resource = halfred.parse(await res.json());
            let resJournal = resource.original() as Journal;
            journal.id = resJournal.id;
            journal.name = resJournal.name;
            journal.locked = resJournal.locked;
            journal.actionLinks = extractActionLinks(resource);

            handleClose(true);
        }
    };

    return (
        <Dialog open={ open } onClose={ () => handleClose() }
                disableRestoreFocus={ true }
                PaperProps={{
                    component: 'form',
                    onSubmit: handleSubmit,
                }}>
            <DialogTitle>Edit Journal</DialogTitle>
            <DialogContent>
                <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label="Journal Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={ journalName }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setJournalName(e.target.value)
                        }}>
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={ () => handleClose() }>Cancel</Button>
                <Button type="submit">Update</Button>
            </DialogActions>
        </Dialog>
    );
}