import halfred from 'halfred';
import { ActionLinkCollection, ActionLink } from './types';

export async function fetchData(url: string): Promise<Response> {
    return await fetch(url, { cache: 'force-cache'} );
}

export async function postData(url: string, data: any): Promise<Response> {
    return await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
    });
}

export async function putData(url: string, data: any): Promise<Response> {
    return await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: data,
    });
}

export async function deleteData(url: string): Promise<Response> {
    return await fetch(url, {
        method: 'DELETE',
    });
}

export function extractActionLinks(resource: halfred.Resource): ActionLinkCollection {
    let actionLinkCol: ActionLinkCollection = new ActionLinkCollection();

    for (let linkKey in resource.allLinks()) {
        linkKey = linkKey.toLowerCase();

        if (linkKey === 'insert' || linkKey === 'add' || linkKey === 'new' || linkKey === 'post')
            actionLinkCol.insert = getLink(resource, linkKey);
        else if (linkKey === 'update' || linkKey === 'replace' || linkKey === 'put')
            actionLinkCol.update = getLink(resource, linkKey);
        else if (linkKey === 'delete' || linkKey === 'remove')
            actionLinkCol.delete = getLink(resource, linkKey);
        else if (linkKey === 'search' || linkKey === 'query')
            actionLinkCol.search = getLink(resource, linkKey);
        else
            actionLinkCol[linkKey] = getLink(resource, linkKey);
    }

    if (actionLinkCol.update.href === undefined)
        actionLinkCol.update = getLink(resource, 'self');
    if (actionLinkCol.delete.href === undefined)
        actionLinkCol.delete = getLink(resource, 'self');

    return actionLinkCol;
}

function getLink(resource: halfred.Resource, linkKey: string): ActionLink {
    const isTemplated = resource.link(linkKey).templated !== undefined ? 
        (resource.link(linkKey).templated as boolean) : false;
    return {href: resource.link(linkKey).href, templated: isTemplated}
}

// function getNonTemplatedLink(resource: halfred.Resource, linkKey: string) {
//     let link = resource.link(linkKey).href;
//     if (resource.link(linkKey).templated)
//         link = link.substring(0, link.indexOf('{'));
//     return link;
// }

export function getLinkFromTemplate(link: ActionLink, value: string): string {
    if (!link.templated)
        return link.href;

    return link.href.replace(link.href.substring(link.href.indexOf('{'), link.href.indexOf('}')), 
        value)
}