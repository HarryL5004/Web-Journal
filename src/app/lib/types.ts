
export class ActionLinkCollection {
    insert: ActionLink = {} as ActionLink;
    update: ActionLink = {} as ActionLink;
    delete: ActionLink = {} as ActionLink;
    search: ActionLink = {} as ActionLink;
    [key: string]: ActionLink;
}

export interface ActionLink {
    href: string;
    templated: boolean;
}

export interface Journal {
    id: string;
    name: string;
    actionLinks: ActionLinkCollection;
}

export interface Page {
    id: string;
    title: string;
    content: string;
    lastUpdatedTime: string;
    journalId: string;
    links: ActionLinkCollection;
}