import React from "react"
import { getHomepage, queryPageBySlug, validateLocale } from "./api"
import { PageContent } from "./PageContent"
import { generateMetadata } from "./metadata"
import { getPayloadHMR } from "@payloadcms/next/utilities"
import configPromise from "@payload-config"

export { generateMetadata }

export async function generateStaticParams() {
    const payload = await getPayloadHMR({ config: configPromise })
    const pages = await payload.find({
        collection: "pages",
        draft: false,
        limit: 1000,
        overrideAccess: false,
    })

    return pages.docs
}

type Args = {
    params: Promise<{
        slug: string
        locale: string
    }>
}

export default async function Page({ params: paramsPromise }: Args) {
    const { slug, locale } = await paramsPromise
    const url = `/${slug || ""}` // Fallback to homepage

    // If slug is empty, fetch homepage, otherwise fetch the page by slug
    const page = slug
        ? await queryPageBySlug({ slug, locale: validateLocale(locale) })
        : await getHomepage(locale)

    return <PageContent page={page} url={url} locale={locale} />
}
