import configPromise from "@payload-config"
import { getPayloadHMR } from "@payloadcms/next/utilities"
import { draftMode } from "next/headers"
import { cache } from "react"

const supportedLanguages =
    (process.env.NEXT_PUBLIC_SUPPORTED_LANGUAGES?.split(",") as (
        | "en"
        | "tr"
        | "all"
    )[]) || []
const defaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LANG as
    | "en"
    | "tr"
    | "all"

// Locale validation function
export function validateLocale(locale: string): "en" | "tr" | "all" {
    return supportedLanguages.includes(locale as "en" | "tr" | "all")
        ? (locale as "en" | "tr" | "all")
        : defaultLocale
}

// Fetch homepage data
export async function getHomepage(locale: string) {
    const payload = await getPayloadHMR({ config: configPromise })
    const homepage = await payload.find({
        collection: "pages",
        where: {
            homepage: { equals: "yes" },
        },
        limit: 1,
        locale: validateLocale(locale),
    })
    return homepage.docs[0] || null
}

// Fetch page data by slug
export const queryPageBySlug = cache(
    async ({ slug, locale }: { slug: string; locale: "en" | "tr" | "all" }) => {
        const { isEnabled: draft } = await draftMode()
        const payload = await getPayloadHMR({ config: configPromise })

        const result = await payload.find({
            collection: "pages",
            draft,
            limit: 1,
            depth: 1,
            locale,
            where: {
                [`slug.${locale}`]: {
                    equals: slug,
                },
            },
        })
        return result.docs?.[0] || null
    }
)
