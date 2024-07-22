'use client';

import { ActionLink, ActionLinkCollection, Journal, Page } from "@/app/lib/types";
import { Button, Card, CardActions, CardContent, Container, Divider, List, ListItemButton, ListItemText, Stack, TextField } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from "react";
import PageEditor from "./PageEditor";
import { extractActionLinks, fetchData } from "@/app/lib/utils";
import halfred from "halfred";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

type Prop = {
    journal: Journal
    backToJournal: () => void
}

export default function PageViewer({ journal, backToJournal }: Prop) {
    const [currPage, setCurrPage] = useState<Page>({} as Page);
    const [pages, setPages] = useState<Page[]>([]);
    const [pageColActionLinks, setPageColActionLinks] = useState<ActionLinkCollection>(new ActionLinkCollection());

    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        loadPages(journal.actionLinks.pages.href)
    }, []);

    async function loadPages(url: string) {
        const resp = await fetchData(url);
        if (!resp.ok)
            return;

        const jsonData = await resp.json();
        const resource: halfred.Resource = halfred.parse(jsonData);

        let pageArr: Page[] = [];
        if (resource.allEmbeddedResources().pageList !== undefined) {
            for (let pageResource of resource.allEmbeddedResources().pageList) {
                let page: Page = pageResource.original() as Page;
                page.actionLinks = extractActionLinks(pageResource);
                pageArr.push(page);
            }
        }

        setPages(pageArr);
        setPageColActionLinks(extractActionLinks(resource));
        if (pageArr.length > 0) {
            setCurrPage(pageArr[0]);
            setSelectedIndex(1);
        } else {
            setCurrPage({} as Page);
            setSelectedIndex(0);
        }
    };

    const deletePage = (pageId: string) => {
        const remainingPages = pages.filter(p => p.id != pageId);
        setPages(remainingPages);
    };

    const handlePageChange = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
        event.preventDefault();

        setSelectedIndex(index + 1);
        setCurrPage(pages[index]);
    }

    const handleCreateNewPage = () => {
        let newPage = {
            title: "New Page",
            journalId: journal.id,
            actionLinks: {
                insert: pageColActionLinks.insert,
                delete: {} as ActionLink,
            } as ActionLinkCollection
        } as Page;
        setPages([newPage, ...pages]);
        setCurrPage(newPage);
    }

    return (
        <Grid container maxWidth="inherit" height="calc(100vh - 64px)">
            <Grid xs={2} minWidth={130}>
                <Stack width="100%">
                    <div>
                        <Button size="small" onClick={ backToJournal }>
                            <ArrowBackIcon />
                        </Button>
                        <Button size="small" variant="outlined" onClick={ handleCreateNewPage }>
                            <AddIcon />
                        </Button>
                    </div>
                    <List>
                        {
                            pages.map( (page, index) => (
                                <div key={ index }>
                                    <ListItemButton selected={ selectedIndex === index + 1 }
                                            onClick={ event => handlePageChange(event, index) }>
                                        <ListItemText primary={ page.title } />
                                    </ListItemButton>
                                    <Divider component="li" />
                                </div>
                            ))
                        }
                    </List>
                </Stack>
            </Grid>
            <Grid xs={10}>
                <PageEditor page={ currPage } deletePage={ deletePage }/>
            </Grid>
        </Grid>
    );
}