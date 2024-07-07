import { AppBar, Box, Toolbar } from "@mui/material";
import Link from "next/link";
import React from "react";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }> ) {
    return (
        <Box>
            <AppBar position="fixed" color="primary">
                <Toolbar variant="dense">
                    <Link key='Root' href='/'
                        className="text-2xl font-extrabold dark:text-white">
                        Journal Web App
                    </Link>
                </Toolbar>
            </AppBar>
            <Toolbar />
            { children }
        </Box>
    );
}