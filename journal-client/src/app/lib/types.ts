
export class ActionLinkCollection {
    [key: string]: ActionLink;
}

export interface ActionLink {
    href: string;
    templated: boolean;
}

export interface Journal {
    id: string;
    name: string;
    locked: boolean;
    actionLinks: ActionLinkCollection;
}

export interface Page {
    id: string;
    title: string;
    content: string;
    lastUpdatedTime: string;
    journalId: string;
    actionLinks: ActionLinkCollection;
}