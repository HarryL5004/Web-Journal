import { AppBar, Box, Toolbar } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";
import Link from "next/link";
import React from "react";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }> ) {
    return (
        <Box sx={{ minWidth: 350 }}>
            <AppBar position="fixed" color="primary" sx={{ textWrap:"nowrap", zIndex: zIndex.drawer + 1 }}>
                <Toolbar variant="dense" sx={{ minWidth: "inherit" }}>
                    <Link key='Root' href='/' className="text-2xl font-extrabold dark:text-white">
                        Journal Web App
                    </Link>
                </Toolbar>
            </AppBar>
            <Toolbar />
            { children }
        </Box>
    );
}