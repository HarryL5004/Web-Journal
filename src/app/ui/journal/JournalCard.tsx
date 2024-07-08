'use client'

import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import { Button, CardActions } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { deleteData, extractActionLinks, getLinkFromTemplate, putData } from '../../lib/utils';
import React, { useState } from 'react';
import EditJournalDialog from './EditJournalDialog';
import { Journal } from '../../lib/types';
import halfred from 'halfred';

type Prop = {
    journal: Journal,
    openJournal: (journal: Journal) => void,
    updateJournal: (journal: Journal) => void,
    deleteJournal: (id: string) => void,
    styles: {}
}

export default function JournalCard( { journal, openJournal, updateJournal, deleteJournal, styles }: Prop ) {
    const [openEditDialog, setOpenEditDialog] = useState(false);

    const handleClickOnJournal = async(e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        openJournal(journal);
    }

    const handleLockJournal = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        journal.locked = !journal.locked;

        let updateActionLink = journal.actionLinks.update.href !== undefined ? 
        journal.actionLinks.update : journal.actionLinks.self;
        let updateLink = updateActionLink.templated ? getLinkFromTemplate(updateActionLink, '') :
            updateActionLink.href;

        const res = await putData(updateLink, JSON.stringify(journal));
        if (res.ok) {
            const resource = halfred.parse(await res.json());
            const resJournal = resource.original() as Journal;
            journal.id = resJournal.id;
            journal.name = resJournal.name;
            journal.locked = resJournal.locked;
            journal.actionLinks = extractActionLinks(resource);
            updateJournal(journal);
        }
    };

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
            <Card sx={ styles }>
                <CardActionArea onClick={ handleClickOnJournal }>
                    <CardContent>
                        <h4>{journal.name}</h4>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                        <Button onClick={ handleLockJournal }>
                            <LockIcon fontSize='small' color={ journal.locked ? 'primary' : 'action'} />
                        </Button>
                        <Button size='small' disabled={ journal.actionLinks.update.href === undefined } 
                                onClick={ handleEditJournal }>Edit</Button>
                        <Button size='small' disabled={ journal.actionLinks.delete.href === undefined } 
                                onClick={ handleDeleteJournal }>Delete</Button>
                </CardActions>
            </Card>
            <EditJournalDialog journal={ journal} 
                                open={ openEditDialog }
                                onClose={ handleCloseEditDialog } />
        </React.Fragment>
    );
}