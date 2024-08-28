'use client';

import halfred from 'halfred';
import { useEffect, useState } from 'react';
import { Button, Pagination, SnackbarCloseReason, Stack, TablePagination } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

import { extractActionLinks } from '../../lib/utils';
import JournalCard from './JournalCard';
import NewJournalCard from './NewJournalCard';
import { ActionLink, ActionLinkCollection, Journal } from '../../lib/types';
import UrlTemplate from '@/app/lib/UrlTemplate';
import MySnackbar from '../MySnackbar';


type Props = {
    allJournalLink: ActionLink,
    clickOnJournal: (journal: Journal) => void,
}

const baseCardStyles = {
    minWidth: 200,
    minHeight: 200,
    maxWidth: 345,
    maxHeight: 345
};

export default function JournalViewer({ allJournalLink, clickOnJournal }: Props) {
    const [journals, setJournals] = useState<Journal[]>([]);
    const [journalActionLinks, setJournalActionLinks] = useState<ActionLinkCollection>(new ActionLinkCollection());

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [count, setCount] = useState(0);

    const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, value: number) => {
        setPage(value);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        loadJournals();
    }, [page, rowsPerPage]);

    async function loadJournals() {
        let url: string = allJournalLink.href;

        if (allJournalLink.templated) {
            let urlTemplate = new UrlTemplate(allJournalLink);

            urlTemplate.setValues("page", page.toString());
            urlTemplate.setValues("size", rowsPerPage.toString());
            url = urlTemplate.buildUrl();
        }

        const resp = await fetch(url);
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

        if (data.page && data.page.totalElements)
            setCount(data.page.totalElements);
    };

    const addJournal = (journal: Journal) => {
        setJournals([...journals, journal]);
        openSnackbar("Created journal");
    };

    const updateJournal = (journal: Journal) => {
        setJournals([journal, ...journals.filter(j => j.id != journal.id)]);
        openSnackbar("Updated journal");
    }

    const deleteJournal = (id: string) => {
        const remainingJournals = journals.filter(j => j.id != id);
        setJournals(remainingJournals);
        openSnackbar("Deleted journal");
    };

    const openSnackbar = (msg: string) => {
        setSnackbarMsg(msg);
        setIsOpenSnackbar(true);
    };

    const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway')
            return;

        setIsOpenSnackbar(false);
    };

    return (
        <>
            <Grid container maxWidth="inherit" rowSpacing={5}>
                <Grid xs={2} sx={{ alignContent: "center" }} >
                    <Button variant="contained"
                                onClick={ (e) => {
                                    e.preventDefault();
                                    loadJournals();
                                }}>
                        <RefreshIcon />
                    </Button>
                </Grid>
                <Grid xs={1}/>
                <Grid xs={9}>
                    <TablePagination component="div" count={ count } 
                                    page={ page } onPageChange={ handlePageChange }
                                    rowsPerPage={ rowsPerPage } onRowsPerPageChange={ handleRowsPerPageChange } />
                </Grid>
                <Grid xs={12}>
                    <Stack spacing={{ xs: 1, sm: 2, md: 4 }} direction="row" useFlexGap flexWrap="wrap">
                        {
                            journalActionLinks.insert !== undefined && 
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
            <MySnackbar open={ isOpenSnackbar } autoHideDuration={ 4000 } message={ snackbarMsg } onClose={ handleCloseSnackbar } />
        </>
    )
}
