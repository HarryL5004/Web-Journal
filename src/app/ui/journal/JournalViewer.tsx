'use client';

import halfred from 'halfred';
import { useState } from 'react';
import { extractActionLinks, fetchData, getLinkFromTemplate } from '../../lib/utils';
import { Button, Container, Stack } from '@mui/material';
import JournalCard from './JournalCard';
import PageViewer from '../page/PageViewer';
import NewJournalDialog from './NewJournalDialog';
import { ActionLinkCollection, Journal, Page } from '../../lib/types';
import RefreshIcon from '@mui/icons-material/Refresh';

type Props = {
    allJournalUrl: string,
}

export default function JournalViewer({ allJournalUrl }: Props) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeJournal, setActiveJournal] = useState<Journal>();
    const [journals, setJournals] = useState<Journal[]>([]);
    const [journalActionLinks, setJournalActionLinks] = useState<ActionLinkCollection>(new ActionLinkCollection());

    async function refreshAllJournals() {
        const resp = await fetchData(allJournalUrl);
        if (!resp.ok)
            return;

        const data = await resp.json();
        const resource: halfred.Resource = halfred.parse(data);

        let journalArr: Journal[] = [];

        setJournalActionLinks(extractActionLinks(resource));

        if (resource.allEmbeddedResources().journalList !== undefined) {
            for (let journalResource of resource.allEmbeddedResources().journalList) {
                let journal: Journal = journalResource.original() as Journal;
                journal.actionLinks = extractActionLinks(journalResource);
                journalArr.push(journal);
            }
        }
    
        setJournals(journalArr);
        setActiveIndex(0);
    };

    async function handleClickForSingleJournal(journal: Journal) {
        setActiveJournal(journal);
        setActiveIndex(1);
    };

    const addJournal = (journal: Journal) => {
        setJournals([...journals, journal]);
    };

    const deleteJournal = (id: string) => {
        const remainingJournals = journals.filter(j => j.id != id);
        setJournals(remainingJournals);
    };

    const backToJournal = () => {
        setActiveIndex(0);
    };

    return (
        <div>
            {
                <Button variant="contained"
                        onClick={ (e) => {
                            e.preventDefault();
                            refreshAllJournals();
                        }}>
                            <RefreshIcon />
                </Button>
            }

            {
                activeIndex == 0 && 
                journalActionLinks.insert.href !== undefined && 
                <NewJournalDialog url={ journalActionLinks.insert.href }
                            addJournal={ addJournal }/>
            }

            <Container maxWidth="sm">
                {
                    activeIndex == 0 &&
                    <Stack spacing={2}>
                        {
                            journals.map( (j) => (
                                <JournalCard key={j.id} journal={j} 
                                    openJournal={ handleClickForSingleJournal }
                                    deleteJournal={ deleteJournal } />
                            ))
                        }
                    </Stack>
                }
                {
                    (activeIndex == 1) && (activeJournal !== undefined) &&
                    <PageViewer journal={ activeJournal } backToJournal={ backToJournal }/>
                }
            </Container>
        </div>
    )
}
