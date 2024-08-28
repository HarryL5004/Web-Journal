
import halfred from 'halfred';
import { extractActionLinks } from '../lib/utils';
import { ActionLinkCollection } from '../lib/types';
import DashboardUI from '../ui/Dashboard';

export default async function Dashboard() {
    let rootLinks = await getRootLinks();

    return (
        <DashboardUI links={ JSON.stringify(rootLinks) }/>
    );
}

async function getRootLinks(): Promise<ActionLinkCollection> {
    const API_URL = process.env.API_URL;
    let actionLinkCol = {} as ActionLinkCollection;

    if (!API_URL)
        return actionLinkCol;

    try {
        const resp = await fetch(API_URL);
        if (!resp.ok)
            throw new Error(`Request failed with status: ${resp.status}`);

        const data = await resp.json();
        const journalData = halfred.parse(data);
        actionLinkCol = extractActionLinks(journalData);
    } catch (error) {
        if (error instanceof Error)
            console.log("Error: ", error);
    }

    return actionLinkCol;
}