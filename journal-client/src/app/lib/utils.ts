import halfred from 'halfred';
import { ActionLinkCollection, ActionLink } from './types';

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

export async function patchData(url: string, data: any): Promise<Response> {
    return await fetch(url, {
        method: 'PATCH',
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

    return actionLinkCol;
}

function getLink(resource: halfred.Resource, linkKey: string): ActionLink {
    const isTemplated = resource.link(linkKey).templated !== undefined ? 
        (resource.link(linkKey).templated as boolean) : false;
    return {href: resource.link(linkKey).href, templated: isTemplated}
}

export function getLinkFromTemplate(link: ActionLink, ...value: string[]): string {
    if (!link.templated)
        return link.href;

    let url = link.href;
    let beginIndex = 0;
    let endIndex = 0;
    value.forEach((val, i) => {
        beginIndex = url.indexOf('{', beginIndex);
        endIndex = url.indexOf('}', beginIndex + 1);
        if (beginIndex == -1 || endIndex == -1)
            return link.href;

        url = url.replace(url.substring(beginIndex, endIndex + 1), val);

        beginIndex++;
    });

    return url;
}