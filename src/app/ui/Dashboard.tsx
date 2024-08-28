'use client';

import Container from '@mui/material/Container';
import { useEffect, useState } from 'react';
import JournalViewer from './journal/JournalViewer';
import PageViewer from './page/PageViewer';
import { ActionLinkCollection, Journal } from '../lib/types';
import MySnackbar from './MySnackbar';

type Props = {
    links: string,
};

export default function Dashboard({ links }: Props) {
    const actionLinks = JSON.parse(links) as ActionLinkCollection;
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeJournal, setActiveJournal] = useState<Journal>();

    const [isOpenSnackbar, setIsOpenSnackbar] =  useState(false);

    useEffect(() => {
        if (actionLinks['all-journals'] === undefined)
            setIsOpenSnackbar(true);
    }, [links]);

    const handleClickOnJournal = (journal: Journal) => {
        setActiveJournal(journal);
        setActiveIndex(1);
    };

    const handleBackToJournal = () => {
        setActiveIndex(0);
    };

    const handleOnCloseSnackbar = () => {
        setIsOpenSnackbar(false);
    };

    const connErrSnackbar = (
        <MySnackbar open={isOpenSnackbar} message={"Failed to connect to server."} 
                    onClose={ handleOnCloseSnackbar } />
    );

    return (
        <Container maxWidth="lg">
            { 
                activeIndex === 0 && actionLinks['all-journals'] !== undefined &&
                <JournalViewer allJournalLink={ actionLinks['all-journals'] }
                    clickOnJournal={ handleClickOnJournal }
                 />
            }
            {
                activeIndex === 1 && activeJournal !== undefined &&
                <PageViewer journal={ activeJournal } backToJournal={ handleBackToJournal }/>
            }
            { connErrSnackbar }
        </Container>
    );
}