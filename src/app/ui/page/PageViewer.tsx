'use client';

import { ActionLinkCollection, Journal, Page } from "@/app/lib/types";
import { Button, Card, CardActions, CardContent, Stack, TextField } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useEffect, useState } from "react";
import NewPageDialog from "./NewPageDialog";
import PageCard from "./PageCard";
import { extractActionLinks, fetchData } from "@/app/lib/utils";
import halfred from "halfred";

type Prop = {
    journal: Journal
    backToJournal: () => void
}

export default function PageViewer({ journal, backToJournal }: Prop) {
    const [pages, setPages] = useState<Page[]>([]);
    const [pageActionLinks, setPageActionLinks] = useState<ActionLinkCollection>(new ActionLinkCollection());

    useEffect(() => {
        loadPages(journal.actionLinks.pages.href)
    }, []);

    // todo useEffect on page Id

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
        setPageActionLinks(extractActionLinks(resource));
    };

    const addPage = (page: Page) => {
        setPages([...pages, page]);
    };

    const deletePage = (pageId: string) => {
        const remainingPages = pages.filter(p => p.id != pageId);
        setPages(remainingPages);
    };

    return (
        <React.Fragment>
            <Button onClick={ backToJournal }>
                <ArrowBackIcon />
            </Button>
            <NewPageDialog journalId={ journal.id } actionLink={ pageActionLinks.insert } addPage={ addPage } />
            <Stack spacing={2}>
                {
                    pages.map( (page) => (
                        <PageCard key={ page.id } page={ page } deletePage={ deletePage }/>
                    ))
                }
            </Stack>
        </React.Fragment>
    );
}