'use client';

import halfred from 'halfred';
import { useState } from 'react';
import { extractActionLinks, fetchData, getLinkFromTemplate } from '../../lib/utils';
import { Button, Container, Stack } from '@mui/material';
import JournalCard from './JournalCard';
import PageViewer from '../page/PageViewer';
import NewJournalDialog from './NewJournalDialog';
import { ActionLinkCollection, Journal, Page } from '../../lib/types';

type Props = {
    allJournalUrl: string,
}

export default function JournalViewer({ allJournalUrl }: Props) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [journals, setJournals] = useState<Journal[]>([]);
    const [journalActionLinks, setJournalActionLinks] = useState<ActionLinkCollection>(new ActionLinkCollection());
    const [pageActionLinks, setPageActionLinks] = useState<ActionLinkCollection>(new ActionLinkCollection());
    const [pages, setPages] = useState<Page[]>([]);

    async function handleClickForAllJournals() {
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
    }

    async function handleClickForSingleJournal(url: string) {
        const resp = await fetchData(url);
        if (!resp.ok)
            return;

        const jsonData = await resp.json();
        const resource: halfred.Resource = halfred.parse(jsonData);

        setPageActionLinks(extractActionLinks(resource));
        let pageArr: Page[] = [];

        if (resource.allEmbeddedResources().pageList !== undefined) {
            for (let pageResource of resource.allEmbeddedResources().pageList) {
                let page: Page = pageResource.original() as Page;
                page.links = extractActionLinks(pageResource);
                pageArr.push(page);
            }
        }

        setPages(pageArr);
        setActiveIndex(1);
    }

    const addJournal = (journal: Journal) => {
        setJournals([...journals, journal]);
    }

    const deleteJournal = (id: string) => {
        const remainingJournals = journals.filter(j => j.id != id);
        setJournals(remainingJournals);
    }

    return (
        <div>
            {
                <Button variant="contained"
                        onClick={ (e) => {
                            e.preventDefault();
                            handleClickForAllJournals();
                        }}>
                            Get All Journals
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
                    activeIndex == 1 &&
                    <div className='flex flex-row justify-start '>
                        {
                            pages.map( (page) => (
                                <PageViewer key={page.id} page={page} pageActionLinks={ pageActionLinks }/>
                            ))
                        }
                    </div>
                }
            </Container>
        </div>
    )
}
