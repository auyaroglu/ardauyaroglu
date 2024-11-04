import React from "react"
import { PayloadRedirects } from "@/components/PayloadRedirects"

interface PageContentProps {
    page: any // Replace 'any' with the actual type of your page data
    url: string
    locale: string
}

export function PageContent({ page, url, locale }: PageContentProps) {
    if (!page) {
        return <PayloadRedirects url={url} locale={locale} />
    }

    return (
        <div>
            <PayloadRedirects disableNotFound url={url} locale={locale} />
            <h1>{page.title}</h1>
            {/* Render additional page content here */}
        </div>
    )
}
