
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
    const resp = await fetch('http://localhost:8080/api', { cache: 'force-cache' });
    let data = await resp.json();
            
    let journalData: halfred.Resource = halfred.parse(data);
    if (journalData == undefined)
        return {} as ActionLinkCollection;

    return extractActionLinks(journalData);
}