
type Links = {
    rel: string,
    href: string,
}

type Page = {
    id: string,
    title: string,
    content: string,
    lastUpdatedTime: number[],
    journalId: string,
    links: Links[],
}

type Prop = {
    page: Page
}

export default function PageReader({ page }: Prop) {
    let datetime: string = parseDateTime(page.lastUpdatedTime);

    return (
        <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h4 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {page.title}
            </h4>
            <p>{datetime}</p>
            <p>{page.content}</p>
        </div>
    );
}

function parseDateTime(datetime: number[]) {
    let s: string = "";
    let year = datetime[0];
    let month = datetime[1];
    let date = datetime[2];
    s += year + "-" + month + "-" + date;

    let hr = datetime[3];
    let min = datetime[4];
    let sec = datetime[5];
    s += " " + hr + ":" + min + ":" + sec;

    return s;
}