import { Button, Typography } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Typography variant="h1">Journal Web App</Typography>
      <Link key='Journal App' href='/dashboard'>
          <Button variant="outlined" size="large">Get Started</Button>
      </Link>
    </main>
  );
}
