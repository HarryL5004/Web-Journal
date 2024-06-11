import { Button } from "./button";

type JournalLinks = {
    rel: string,
    href: string,
}

type Journal = {
    id: string,
    name: string,
    links: JournalLinks[],
}

type Prop = {
    journal: Journal,
    onClickJournal: (url: string) => void,
}

export default function JournalCard( { journal, onClickJournal }: Prop ) {
    let pageLink: string = "";
    for (let l of journal.links) {
        if (l.rel == 'pages')
            pageLink = l.href;
    }

    return (
        <Button onClick={(e) => {
            e.preventDefault();

            let pagesLink: string = "";
            for (let s of journal.links) {
                if (s.rel === "pages") {
                    pagesLink = s.href;
                    break;
                }
            }
            onClickJournal(pagesLink);
        }}
                className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <h4 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {journal.name}
                </h4>
        </Button>
    );
}