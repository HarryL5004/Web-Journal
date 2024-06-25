
import Link from 'next/link';
import halfred from 'halfred';
import JournalViewer from '../ui/journal/JournalViewer';

export default async function Dashboard() {
    let journalList = await getJournalList();

    return (
        <div className='flex min-h-screen flex-col justify-around p-5'>
            <Link key='Root' href='/'
                  className="text-4xl font-extrabold dark:text-white">
                Journal App
            </Link>
            { journalList }
        </div>
    );
}

async function getJournalList(): Promise<JSX.Element> {
    const resp = await fetch('http://localhost:8080/api', { cache: 'force-cache' });
    let data = await resp.json();
            
    let journalData: halfred.Resource = halfred.parse(data);
    if (journalData == undefined)
        return (<div>Failed to connect to server.</div>);
    
    let allJournalLink: halfred.Link = journalData.link("all-journals");
    if (allJournalLink == null)
        return (<div>Error. Unexpected response from API.</div>);

    let allJournalUrl = allJournalLink.href.substring(0, allJournalLink.href.indexOf('{'));
    return (<JournalViewer allJournalUrl={ allJournalUrl } />);
}