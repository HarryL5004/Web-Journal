import { ActionLink } from "./types";


export default class UrlTemplate {
    TEMPLATE_REGEX = /{\??([\w]+)(,[\w]+)*}/g;
    
    actionLink: ActionLink;
    values: Map<string, string>;
    templates: RegExpMatchArray | [];

    constructor(actionLink: ActionLink) {
        this.actionLink = actionLink;
        this.values = new Map();
        this.templates = this.actionLink.href.match(this.TEMPLATE_REGEX) ?? [];
    }

    buildUrl(): string {
        let link = this.actionLink.href;
        
        this.templates.forEach(template => {
            let replaceStr = '';
            let params = this.getParamsFromTemplate(template);

            params.forEach(param => {
                if (this.values.has(param))
                    replaceStr += `&${param}=${this.values.get(param)}`;
            });

            if (replaceStr.length !== 0)
                replaceStr = '?' + replaceStr.substring(1);
    
            link = link.replace(template, replaceStr);
        });
    
        return link;
    }

    getUrlParameters(): Set<string> {
        const set = new Set<string>();
    
        if (!this.actionLink.templated)
            return set;
    
        for (let template in this.templates) {
            let params = this.getParamsFromTemplate(template);
            params.forEach(p => set.add(p));
        }
    
        return set;
    }

    getParamsFromTemplate(template: string): Set<string> {
        const set = new Set<string>();
        let params = template.match(/\w+/g);
        if (params !== null)
            params.forEach(p => set.add(p));

        return set;
    }

    setValues(key: string, value: string) {
        this.values.set(key, value);
    }
}