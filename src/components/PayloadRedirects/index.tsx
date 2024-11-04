import type React from "react"
import type { Page, Post } from "@/payload-types"
import { getCachedRedirects } from "@/utilities/getRedirects"
import { notFound, redirect } from "next/navigation"
import { getPayloadHMR } from "@payloadcms/next/utilities"
import configPromise from "@payload-config"
import { getCachedDocument } from "@/utilities/getDocument"

const payload = await getPayloadHMR({ config: configPromise })

const defaultLannguage = process.env.NEXT_PUBLIC_DEFAULT_LANG || "tr"

let homepagePages
try {
    // Homepage sayfalarını çekiyoruz
    homepagePages = await payload.find({
        collection: "pages",
        where: {
            homepage: { equals: "yes" },
        },
    })
} catch (error) {
    throw new Error("Failed to fetch homepage slugs")
}

interface Props {
    disableNotFound?: boolean
    url: string
    locale: string
}

/* Bu bileşen, SSR tabanlı dinamik yönlendirmeleri yönetir */
export const PayloadRedirects: React.FC<Props> = async ({
    disableNotFound,
    url,
    locale,
}) => {
    const localeSlug = locale !== defaultLannguage ? `/${locale}` : ""
    const slug = `${localeSlug}${url.startsWith("/") ? url : `/${url}`}`

    // Homepage sluglarını dinamik olarak al
    const homepageSlugs = homepagePages.docs.map(
        (page: Page) => page.slug || ""
    )

    // Anasayfa sluglarına göre yönlendirme
    const homepageSlugMatch = homepageSlugs.find(
        (page) => slug === `/${localeSlug}${page}`
    )

    if (homepageSlugMatch) {
        redirect(`/${localeSlug || ""}`)
        return
    }

    const redirects = await getCachedRedirects()()
    const redirectItem = redirects.find((redirect) => redirect.from === slug)

    if (redirectItem) {
        let redirectUrl: string

        if (redirectItem.to?.url) {
            if (redirectItem.to.url !== slug) {
                redirect(redirectItem.to.url)
                return
            }
        }

        if (typeof redirectItem.to?.reference?.value === "string") {
            const collection = redirectItem.to?.reference?.relationTo
            const id = redirectItem.to?.reference?.value

            const document = (await getCachedDocument(collection, id)()) as
                | Page
                | Post
            redirectUrl = `${
                redirectItem.to?.reference?.relationTo !== "pages"
                    ? `/${redirectItem.to?.reference?.relationTo}`
                    : ""
            }/${document?.slug}`
        } else {
            redirectUrl = `${
                redirectItem.to?.reference?.relationTo !== "pages"
                    ? `/${redirectItem.to?.reference?.relationTo}`
                    : ""
            }/${
                typeof redirectItem.to?.reference?.value === "object"
                    ? redirectItem.to?.reference?.value?.slug
                    : ""
            }`
        }

        // Eğer yönlendirme URL'si mevcutsa ve mevcut URL ile aynı değilse, yönlendir
        if (redirectUrl && redirectUrl !== slug) {
            redirect(redirectUrl)
        }
    }

    if (disableNotFound) return null

    notFound()
}
