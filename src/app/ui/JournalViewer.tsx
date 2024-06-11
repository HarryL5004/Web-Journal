'use client';

import halfred from 'halfred';
import { Button } from './button';
import { useState } from 'react';
import JournalCard from './JournalCard';
import PageReader from './PageReader';

type Props = {
    allJournalUrl: string,
}

type JsonResp = {
    _links: [],
    content: [],
}

type Journal = {
    id: string,
    name: string,
    links: Links[],
}

type Links = {
    rel: string,
    href: string,
}

type Page = {
    id: string,
    title: string,
    content: string,
    lastUpdatedTime: number[],
    journalId: string,
    links: Links[],
}

export default function JournalViewer({ allJournalUrl }: Props) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [journals, setJournals] = useState<Journal[]>([]);
    const [pages, setPages] = useState<Page[]>([]);

    async function handleClickForAllJournals() {
        setJournals(await fetchData(allJournalUrl));
        setActiveIndex(0);
    }

    async function handleClickForSingleJournal(url: string) {
        setPages(await fetchData(url));
        setActiveIndex(1);
    }
    
    async function fetchData(url: string) {
        const resp = await fetch(url, { cache: 'force-cache'} );
        const data: JsonResp = await resp.json();
    
        let journalListLinks: halfred.Resource = halfred.parse(data);

        return data.content;
    }

    return (
        <div>
            {
                <Button onClick={ (e) => {
                    e.preventDefault();
                    handleClickForAllJournals();
                }} 
                        className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}>
                            Get All Journals
                </Button>
            }
            {
                <Button 
                    className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}>
                        New Journal
                </Button>
            }
            {
                activeIndex == 0 &&
                <div className='flex flex-row justify-stretch'>
                    {
                        journals.map( (j) => (
                            <JournalCard key={j.id} journal={j} onClickJournal={ handleClickForSingleJournal } />
                        ))
                    }
                </div>
            }
            {
                activeIndex == 1 &&
                <div className='flex flex-row justify-start '>
                    {
                        pages.map( (page) => (
                            <PageReader key={page.id} page={page} />
                        ))
                    }
                </div>
            }
        </div>
    )
}