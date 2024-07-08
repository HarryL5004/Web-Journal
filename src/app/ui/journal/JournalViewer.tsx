'use client';

import halfred from 'halfred';
import { useEffect, useState } from 'react';
import { Button, Stack } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

import { extractActionLinks, fetchData, getLinkFromTemplate } from '../../lib/utils';
import JournalCard from './JournalCard';
import NewJournalCard from './NewJournalCard';
import { ActionLinkCollection, Journal } from '../../lib/types';


type Props = {
    allJournalUrl: string,
    clickOnJournal: (journal: Journal) => void,
}

const baseCardStyles = {
    minWidth: 200,
    maxWidth: 345,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
};

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

        if (resource.allEmbeddedResources().journalList !== undefined) {
            for (let journalResource of resource.allEmbeddedResources().journalList) {
                let journal: Journal = journalResource.original() as Journal;
                journal.actionLinks = extractActionLinks(journalResource);
                journalArr.push(journal);
            }
        }
    
        setJournals(journalArr);
        setJournalActionLinks(extractActionLinks(resource));
    };

    const addJournal = (journal: Journal) => {
        setJournals([...journals, journal]);
    };

    const updateJournal = (journal: Journal) => {
        setJournals([journal, ...journals.filter(j => j.id != journal.id)]);
    }

    const deleteJournal = (id: string) => {
        const remainingJournals = journals.filter(j => j.id != id);
        setJournals(remainingJournals);
    };

    return (
        <Grid container maxWidth="lg" rowSpacing={5}>
            <Grid xs={12}>
                <Button variant="contained"
                        onClick={ (e) => {
                            e.preventDefault();
                            loadAllJournals();
                        }}>
                            <RefreshIcon />
                </Button>
            </Grid>
            <Grid xs={12}>
                <Stack spacing={{ xs: 1, sm: 2, md: 4 }} direction="row" useFlexGap flexWrap="wrap">
                    {
                        journalActionLinks.insert.href !== undefined && 
                        <NewJournalCard url={ journalActionLinks.insert.href }
                                    addJournal={ addJournal } styles={ baseCardStyles } />
                    }
                    {
                        journals.map( (j) => (
                            <JournalCard key={j.id} journal={j} 
                                openJournal={ () => clickOnJournal(j) }
                                updateJournal={ updateJournal }
                                deleteJournal={ deleteJournal }
                                styles={ baseCardStyles } />
                        ))
                    }
                </Stack>
            </Grid>
        </Grid>
    )
}
