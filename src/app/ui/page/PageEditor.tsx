'use client';

import { Page } from "@/app/lib/types";
import { deleteData, extractActionLinks, getLinkFromTemplate, patchData, postData, putData } from "@/app/lib/utils";
import { Button, Container, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import halfred from 'halfred';

type Props = {
    page: Page,
    deletePage: (pageId: string) => void,
}

export default function PageEditor({ page, deletePage }: Props) {

    const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        page.title = formData.get('title') as string;
        page.content = formData.get('content') as string;

        let isInsert = page.actionLinks.insert !== undefined;
        if (isInsert && page.actionLinks.update !== undefined) {
            console.log("Changes cannot be submitted.");
            return;
        }

        const res = await (isInsert ? submitNewPage() : submitUpdatedPage());
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

    const submitNewPage = () => {
        let actionLink = page.actionLinks.insert;
        let submitUrl = actionLink.templated ? getLinkFromTemplate(actionLink, page.journalId) : actionLink.href;
        return postData(submitUrl, JSON.stringify(page));
    };

    const submitUpdatedPage = () => {
        let actionLink = page.actionLinks.update;
        let submitUrl = page.actionLinks.update.templated ? getLinkFromTemplate(actionLink, page.journalId, page.id) : actionLink.href;
        return patchData(submitUrl, JSON.stringify(page));
    };

    const handleDelete = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
    
        let deleteLink = page.actionLinks.delete;
        if (deleteLink === undefined) {
            deletePage(page.id);
            return;
        }

        let url = deleteLink.templated ?
            getLinkFromTemplate(deleteLink, page.journalId, page.id) :
            deleteLink.href;
        const res = await deleteData(url);
        if (res.ok)
            deletePage(page.id);
    };

    return (
        <Paper component='form'
                sx={{ minWidth: 700 }}
                onSubmit={ handleOnSubmit }>
            <TextField
                required
                margin="dense"
                id="title"
                name="title"
                placeholder="Title"
                type="text"
                fullWidth
                defaultValue={ page.title }
                variant="standard"
            />
            <Typography textAlign="center" variant="subtitle2">
                { page.lastUpdatedTime !== undefined && "Last saved: " + new Date(page.lastUpdatedTime).toLocaleString() }
            </Typography>
            <TextField
                id="content"
                name="content"
                placeholder="Your notes here..."
                type="text"
                defaultValue={ page.content }
                margin="dense"
                fullWidth
                minRows={20}
                maxRows={ Infinity }
                multiline
                variant="standard"
                inputProps={{ maxLength: 1500 }}
            />
            <Button type="submit" disabled={ page.actionLinks === undefined || 
                                    (page.actionLinks.insert === undefined && page.actionLinks.update === undefined) }>
                Save
            </Button>
            <Button disabled={ page.actionLinks === undefined || page.actionLinks.delete === undefined } onClick={ handleDelete }>
                Delete
            </Button>

        </Paper>
    );
}