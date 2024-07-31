'use client';

import Container from '@mui/material/Container';
import { useState } from 'react';
import JournalViewer from './journal/JournalViewer';
import PageViewer from './page/PageViewer';
import { ActionLinkCollection, Journal } from '../lib/types';
import { getLinkFromTemplate } from '../lib/utils';

type Props = {
    links: string,
};

export default function Dashboard({ links }: Props) {
    const actionLinks = JSON.parse(links) as ActionLinkCollection;
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeJournal, setActiveJournal] = useState<Journal>();

    const handleClickOnJournal = (journal: Journal) => {
        setActiveJournal(journal);
        setActiveIndex(1);
    };

    const handleBackToJournal = () => {
        setActiveIndex(0);
    };


    return (
        <Container maxWidth="lg">
            {
                actionLinks['all-journals'] === undefined &&
                <div>Failed to connect to server.</div>
            }
            { 
                activeIndex === 0 &&
                <JournalViewer allJournalLink={ actionLinks['all-journals'] }
                    clickOnJournal={ handleClickOnJournal }
                 />
            }
            {
                activeIndex === 1 && activeJournal !== undefined &&
                <PageViewer journal={ activeJournal } backToJournal={ handleBackToJournal }/>
            }

        </Container>
    );
}