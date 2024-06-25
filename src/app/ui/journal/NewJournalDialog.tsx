import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, TextField } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import React from "react";
import { extractActionLinks, postData } from "../../lib/utils";
import halfred from "halfred";
import { Journal } from "../../lib/types";

interface Props {
    url: string
    addJournal: (j: Journal) => void
}


export default function NewJournalDialog({ url, addJournal }: Props) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const formJsonData = Object.fromEntries((formData as any).entries());

        const res = await postData(url, JSON.stringify(formJsonData));
        if (res.ok) {
            const resource = halfred.parse(await res.json());
            const journal = resource.original() as Journal;
            journal.actionLinks = extractActionLinks(resource);
            
            addJournal(journal);
            handleClose();
        }
    }

    return (
        <React.Fragment>
            <Fab color='primary' onClick={ handleClickOpen }>
                <AddIcon />
            </Fab>

            <Dialog open={ open } onClose={ handleClose }
                    disableRestoreFocus={ true }
                    PaperProps={{
                        component: 'form',
                        onSubmit: handleOnSubmit
                    }}>

                <DialogTitle>New Journal</DialogTitle>

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
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Add</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}