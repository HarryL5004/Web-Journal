'use client';

import { Page } from "@/app/lib/types";
import { deleteData, extractActionLinks, getLinkFromTemplate, patchData, postData, putData } from "@/app/lib/utils";
import { Box, Button, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import { MenuButtonAddTable, MenuButtonBold, MenuButtonBulletedList, MenuButtonItalic, MenuButtonOrderedList, MenuButtonUnderline, MenuControlsContainer, MenuDivider, MenuSelectHeading, RichTextEditor, RichTextEditorProvider, RichTextEditorRef, RichTextField } from "mui-tiptap";
import StarterKit from "@tiptap/starter-kit";

import halfred from 'halfred';
import { useEditor } from "@tiptap/react";
import { useEffect } from "react";
import Placeholder from "@tiptap/extension-placeholder";

type Props = {
    page: Page,
    updatePage: (page: Page) => void,
    deletePage: (pageId: string) => void,
}

export default function PageEditor({ page, updatePage, deletePage }: Props) {
    const richTextEditor = useEditor({
        extensions: [StarterKit.configure({
                        bulletList: {
                            HTMLAttributes: {
                                class: 'editor-list',
                            },
                        },
                        orderedList: {
                            HTMLAttributes: {
                                class: 'editor-list',
                            },
                        }
                    }),
                    Placeholder.configure({
                        placeholder: "Your notes here...",
                    })],
        content: page?.content,
        immediatelyRender: true,
    });

    useEffect(() => {
        richTextEditor.commands.setContent(page.content);
    }, [page]);

    const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        page.title = formData.get('title') as string;
        page.content = richTextEditor.getHTML();

        let isInsert = page.actionLinks.insert !== undefined;
        if (isInsert && page.actionLinks.update === undefined) {
            console.log("Changes cannot be submitted."); // todo: notify in popup instead
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
            updatePage(page);
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
                elevation={2}
                sx={{ width: "100%", height: "100%", padding: "10px", display: "flex", flexDirection: 'column' }}
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
            <RichTextEditorProvider editor={ richTextEditor }>
                <RichTextField 
                    controls={
                        <MenuControlsContainer>
                            <MenuSelectHeading />
                            <MenuDivider />
                            <MenuButtonBold />
                            <MenuButtonItalic />
                            <MenuDivider />
                            <MenuButtonBulletedList />
                            <MenuButtonOrderedList />
                        </MenuControlsContainer>
                    }
                    footer={
                        <Stack direction="row" spacing={2} sx={{ }}>
                            <Button type="submit" disabled={ page.actionLinks === undefined || 
                                                    (page.actionLinks.insert === undefined && page.actionLinks.update === undefined) }>
                                Save
                            </Button>
                            <Button disabled={ page.actionLinks === undefined || page.actionLinks.delete === undefined } onClick={ handleDelete }>
                                Delete
                            </Button>
                        </Stack>
                    }
                />
            </RichTextEditorProvider>
        </Paper>
    );
}