import { ActionLinkCollection, Page } from "@/app/lib/types";
import { Card, CardContent } from "@mui/material";

type Prop = {
    page: Page
    pageActionLinks: ActionLinkCollection
}

export default function PageViewer({ page, pageActionLinks }: Prop) {
    return (
        <Card>
            <CardContent>
                <h4 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                    {page.title}
                </h4>
                <p>{page.lastUpdatedTime}</p>
                <p>{page.content}</p>
            </CardContent>
        </Card>
    );
}