'use client'

import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import { Button, CardActions } from '@mui/material';
import { deleteData, getLinkFromTemplate } from '../../lib/utils';
import React, { useState } from 'react';
import EditJournalDialog from './EditJournalDialog';
import { Journal } from '../../lib/types';

type Prop = {
    journal: Journal,
    openJournal: (url: string) => void,
    deleteJournal: (id: string) => void,
}

export default function JournalCard( { journal, openJournal, deleteJournal }: Prop ) {
    const [openEditDialog, setOpenEditDialog] = useState(false);

    const handleClickOnJournal = async(e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        let pagesLink: string = journal.actionLinks.pages.href;
        openJournal(pagesLink);
    }

    const handleEditJournal = (e: React.MouseEvent<HTMLElement>) => {
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
    }

    const handleDeleteJournal = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        let deleteUrl = journal.actionLinks.self.templated ? getLinkFromTemplate(journal.actionLinks.self, '') : 
            journal.actionLinks.self.href;

        let res = await deleteData(deleteUrl);
        if (res.ok)
            deleteJournal(journal.id);
    }

    return (
        <React.Fragment>
            <Card sx={{maxWidth: 345}}>
                <CardActionArea onClick={ handleClickOnJournal }>
                    <CardContent>
                        <h4>{journal.name}</h4>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                        <Button size='small' onClick={ handleEditJournal }>Edit</Button>
                        <Button size='small' onClick={ handleDeleteJournal }>Delete</Button>
                </CardActions>
            </Card>
            <EditJournalDialog journal={ journal} 
                                open={ openEditDialog }
                                onClose={ handleCloseEditDialog } />
        </React.Fragment>
    );
}