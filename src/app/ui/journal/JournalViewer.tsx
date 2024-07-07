'use client';

import halfred from 'halfred';
import { useEffect, useState } from 'react';
import { extractActionLinks, fetchData, getLinkFromTemplate } from '../../lib/utils';
import { Button, Container, Stack } from '@mui/material';
import JournalCard from './JournalCard';
import NewJournalDialog from './NewJournalDialog';
import { ActionLinkCollection, Journal, Page } from '../../lib/types';
import RefreshIcon from '@mui/icons-material/Refresh';

type Props = {
    allJournalUrl: string,
    clickOnJournal: (journal: Journal) => void,
}

export default function JournalViewer({ allJournalUrl, clickOnJournal }: Props) {
    const [journals, setJournals] = useState<Journal[]>([]);
    const [journalActionLinks, setJournalActionLinks] = useState<ActionLinkCollection>(new ActionLinkCollection());

    useEffect(() => {
        loadAllJournals();
    }, []);

    async function loadAllJournals() {
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
    };

    async function handleClickForSingleJournal(journal: Journal) {
        clickOnJournal(journal);
    };

    const addJournal = (journal: Journal) => {
        setJournals([...journals, journal]);
    };

    const deleteJournal = (id: string) => {
        const remainingJournals = journals.filter(j => j.id != id);
        setJournals(remainingJournals);
    };

    return (
        <div>
            {
                <Button variant="contained"
                        onClick={ (e) => {
                            e.preventDefault();
                            loadAllJournals();
                        }}>
                            <RefreshIcon />
                </Button>
            }
            {
                journalActionLinks.insert.href !== undefined && 
                <NewJournalDialog url={ journalActionLinks.insert.href }
                            addJournal={ addJournal }/>
            }

            <Container maxWidth="sm">
                {
                    <Stack spacing={{ xs: 1, sm: 2, md: 4 }} direction="row" useFlexGap flexWrap="wrap">
                        {
                            journals.map( (j) => (
                                <JournalCard key={j.id} journal={j} 
                                    openJournal={ handleClickForSingleJournal }
                                    deleteJournal={ deleteJournal } />
                            ))
                        }
                    </Stack>
                }
            </Container>
        </div>
    )
}
