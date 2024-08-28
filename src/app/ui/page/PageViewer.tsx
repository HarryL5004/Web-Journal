'use client';

import { ActionLink, ActionLinkCollection, Journal, Page } from "@/app/lib/types";
import { AppBar, Box, Button, Card, CardActions, CardContent, Container, Dialog, Divider, Drawer, IconButton, List, ListItemButton, ListItemText, Slide, SnackbarCloseReason, Stack, SwipeableDrawer, TextField, Toolbar, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from "react";
import PageEditor from "./PageEditor";
import { extractActionLinks, getLinkFromTemplate, postData } from "@/app/lib/utils";
import halfred from "halfred";
import { TransitionProps } from '@mui/material/transitions';
import MySnackbar from "../MySnackbar";

type Prop = {
    journal: Journal
    backToJournal: () => void
}

const drawerWidth = 240;

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function PageViewer({ journal, backToJournal }: Prop) {
    const [currPage, setCurrPage] = useState<Page | null>(null);
    const [pages, setPages] = useState<Page[]>([]);
    const [pageColActionLinks, setPageColActionLinks] = useState<ActionLinkCollection>(new ActionLinkCollection());

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);

    const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");

    useEffect(() => {
        loadPages(journal.actionLinks.pages.href)
    }, []);

    async function loadPages(url: string) {
        const resp = await fetch(url);
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
        setCurrPage(pageArr.length > 0 ? pageArr[0] : null);
        setSelectedIndex(0);
    };

    const updatePage = (page: Page) => {
        let index = pages.findIndex(p => p.id === page.id);
        if (index === -1) {
            setPages([...pages, page]);
            return;
        }

        pages[index] = page;
        setPages([...pages]);
        openSnackbar("Updated page");
    };

    const deletePage = (pageId: string) => {
        const remainingPages = pages.filter(p => p.id != pageId);
        setPages(remainingPages);
        if (remainingPages.length === 0) {
            changePage(0, null);
            return;
        }

        let newPageIndex = selectedIndex >= remainingPages.length ? selectedIndex -  1 : selectedIndex;
        changePage(newPageIndex, remainingPages[newPageIndex]);
        openSnackbar("Deleted page");
    };

    const handlePageChange = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
        event.preventDefault();

        changePage(index, pages[index]);
        if (openDialog)
            setOpenDialog(false);
    }

    const changePage = (index: number, page: Page | null) => {
        if (index < 0) {
            console.log("Invalid index: ", index);
            return;
        }
        setSelectedIndex(index);
        setCurrPage(page);
    }

    const handleCreateNewPage = async () => {
        let newPage = {
            title: "New Page",
            journalId: journal.id,
            actionLinks: {
                insert: pageColActionLinks.insert,
                delete: {} as ActionLink,
            } as ActionLinkCollection
        } as Page;

        let submitUrl = pageColActionLinks.insert.templated ? 
            getLinkFromTemplate(pageColActionLinks.insert, journal.id) : pageColActionLinks.insert.href;
        const res = await postData(submitUrl, JSON.stringify(newPage));
        if (res.ok) {
            const resource = halfred.parse(await res.json());
            const resPage = resource.original() as Page;
            resPage.actionLinks = extractActionLinks(resource);

            const newPages = [...pages, resPage];
            setPages(newPages);
            setCurrPage(resPage);
            setSelectedIndex(newPages.length - 1);
        }

        if (openDialog)
            setOpenDialog(false);

        openSnackbar("Created page");
    };

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
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

    const pageList = (
        <Stack width="100%">
            <List>
                {
                    pages.map( (page, index) => (
                        <div key={ index }>
                            <ListItemButton selected={ selectedIndex === index }
                                    onClick={ event => handlePageChange(event, index) }>
                                <ListItemText primary={ page.title } sx={{ textOverflow: 'ellipsis' }} />
                            </ListItemButton>
                            <Divider component="li" />
                        </div>
                    ))
                }
            </List>
        </Stack>
    );

    const viewerButtons = (
        <Box display="flex" sx={{ height: 'fit-content' }}>
            <IconButton aria-label="go back"
                onClick={ backToJournal }>
                <ArrowBackIcon />
            </IconButton>
            <Button aria-labelledby="New page" variant="outlined" sx={{ display: { xs: 'none', sm: 'inline-flex'}, flex: 1, marginRight: '10px' }}
                    onClick={ handleCreateNewPage } disabled={ journal.locked } startIcon={ <AddIcon /> }>
                New Page
            </Button>
            <Button aria-labelledby="All pages" variant="outlined" sx={{ flex: 1, display: { xs: 'inline', sm: 'none' } }}
                    onClick={ handleDialogOpen }>
                All pages
            </Button>
        </Box>
    );

    const dialog = (
        <Dialog fullScreen open={ openDialog } onClose={ handleDialogClose }
                TransitionComponent={ Transition }>
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton edge="start" onClick={ handleDialogClose }
                                color="inherit" aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" component="div"
                                sx={{ flex: 1 }}>
                        All pages
                    </Typography>
                    <IconButton edge="end" onClick={ handleCreateNewPage }
                                color="inherit" aria-label="add new page">
                        <AddIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            { pageList }
        </Dialog>
    );
// maxHeight: 'calc(100vh - 56px)'
    return (
        <Box height="calc(100vh - 64px - 10px)" sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row'}, flexWrap: 'nowrap', rowGap: '10px' }}>
            <Box flexGrow={0} sx={{ width: { xs: '100%', sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                { viewerButtons }
                <Box sx={{ width: { xs: '100%' }, height: 'fit-content', display: { xs: 'none', sm: 'block' } }}>
                    { pageList }
                </Box>
            </Box>
            {
                currPage !== null &&
                <Box minWidth={250} flexGrow={1}>
                    <PageEditor page={ currPage } editable={ !journal.locked } updatePage={ updatePage } deletePage={ deletePage } />
                </Box>
            }
            { dialog }
            <MySnackbar open={ isOpenSnackbar } autoHideDuration={ 4000 } message={ snackbarMsg } onClose={ handleCloseSnackbar } />
        </Box>
    );
}