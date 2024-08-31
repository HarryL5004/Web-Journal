'use client'

import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import { Button, CardActions, IconButton, Stack, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { deleteData, extractActionLinks, getLinkFromTemplate, putData } from '../../lib/utils';
import React, { useEffect, useState } from 'react';
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
    const [isLocked, setIsLocked] = useState(true);

    useEffect(() => {
        setIsLocked(journal.locked);
    }, []);

    const handleClickOnJournal = async(e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        openJournal(journal);
    }

    const handleLockJournal = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        journal.locked = !journal.locked;

        let updateActionLink = journal.actionLinks.update.href !== undefined ? journal.actionLinks.update : 
            journal.actionLinks.self;
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
            setIsLocked(journal.locked);
            updateJournal(journal);
        }
    };

    const handleEditJournal = (e: React.MouseEvent<HTMLElement>) => {
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = (submitted: boolean) => {
        setOpenEditDialog(false);
        if (submitted)
            updateJournal(journal);
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
                <Stack sx={{ width: '100%', height: '100%' }} display="flex">
                    <CardActionArea sx={{ height: '80%' }} onClick={ handleClickOnJournal }>
                        <CardContent sx={{ height: '100%' }}>
                            <Typography variant='h6' 
                                        style={{ height: '100%', textAlign: 'center', overflowWrap: 'break-word', textOverflow: 'ellipsis' }}>
                                {journal.name}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions sx={{ height: '20%' }}>
                            <IconButton onClick={ handleLockJournal } size='small'>
                                {
                                    isLocked &&
                                        <LockOpenIcon fontSize='small' />
                                }
                                {
                                    !isLocked &&
                                        <LockIcon fontSize='small' />
                                }
                            </IconButton>
                            <Button size='small'
                                    disabled={ journal.actionLinks.update === undefined } 
                                    onClick={ handleEditJournal }>Edit</Button>
                            <Button size='small'
                                    disabled={ journal.actionLinks.delete === undefined } 
                                    onClick={ handleDeleteJournal }>Delete</Button>
                    </CardActions>
                </Stack>
            </Card>
            <EditJournalDialog journal={ journal} 
                                open={ openEditDialog }
                                onClose={ handleCloseEditDialog } />
        </React.Fragment>
    );
}