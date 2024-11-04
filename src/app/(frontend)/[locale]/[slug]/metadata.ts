import type { Metadata } from "next"
import { generateMeta } from "@/utilities/generateMeta"
import { getHomepage, queryPageBySlug, validateLocale } from "./api"

export async function generateMetadata({
    params: paramsPromise,
}: {
    params: Promise<{
        slug?: string
        locale: string
    }>
}): Promise<Metadata> {
    const { slug = "", locale = process.env.NEXT_PUBLIC_DEFAULT_LANG || "tr" } =
        await paramsPromise

    // Fetch the page using the slug and locale
    const page = slug
        ? await queryPageBySlug({ slug, locale: validateLocale(locale) })
        : await getHomepage(locale)

    return generateMeta({ doc: page })
}
