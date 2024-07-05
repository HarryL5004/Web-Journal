'use client';

import { Page } from "@/app/lib/types";
import { deleteData, extractActionLinks, getLinkFromTemplate, patchData, putData } from "@/app/lib/utils";
import { Button, Paper, TextField } from "@mui/material";
import { useState } from "react";
import halfred from 'halfred';

type Props = {
    page: Page,
    deletePage: (pageId: string) => void,
}

export default function PageCard({ page, deletePage }: Props) {
    const [pageTitle, setPageTitle] = useState(page.title);
    const [pageContent, setPageContent] = useState(page.content);

    let updateActionLink = page.actionLinks.update;
    let updateUrl = updateActionLink.templated ? 
        getLinkFromTemplate(updateActionLink, page.journalId, page.id) :
        updateActionLink.href;

    const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        page.title = formData.get('title') as string;
        page.content = formData.get('content') as string;
        
        const res = await patchData(updateUrl, JSON.stringify(page));
        if (res.ok) {
            const resource = halfred.parse(await res.json());
            const resPage = resource.original() as Page;
            page.id = resPage.id;
            page.journalId = resPage.journalId;
            page.title = resPage.title;
            page.lastUpdatedTime = resPage.lastUpdatedTime;
            page.content = resPage.content;
            page.actionLinks = extractActionLinks(resource);
        }
    };

    const handleDelete = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
    
        let deleteLink = page.actionLinks.delete !== undefined ?
            page.actionLinks.delete : page.actionLinks.self;
        let url = deleteLink.templated ?
            getLinkFromTemplate(deleteLink, page.journalId, page.id) :
            deleteLink.href;
        const res = await deleteData(url);
        if (res.ok)
            deletePage(page.id);
    };

    return (
        <Paper key={ page.id }
            component='form'
            onSubmit={ handleOnSubmit }>
                <TextField
                    required
                    margin="dense"
                    id="title"
                    name="title"
                    label="Page Title"
                    type="text"
                    fullWidth
                    value={ pageTitle }
                    variant="standard"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setPageTitle(e.target.value);
                    }}
                />
                <p>{page.lastUpdatedTime}</p>
                <TextField 
                    required
                    id="content"
                    name="content"
                    placeholder="Your notes here..."
                    type="text"
                    value={ pageContent }
                    margin="dense"
                    fullWidth
                    multiline
                    rows={8}
                    variant="standard"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setPageContent(e.target.value);
                    }}
                />
            <Button type="submit">Save</Button>
            <Button onClick={ handleDelete }>Delete</Button>
        </Paper>
    );
}