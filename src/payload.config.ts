// storage-adapter-import-placeholder
import { mongooseAdapter } from "@payloadcms/db-mongodb"
import {
    FixedToolbarFeature,
    lexicalEditor,
} from "@payloadcms/richtext-lexical"
import { redirectsPlugin } from "@payloadcms/plugin-redirects"
import path from "path"
import { buildConfig } from "payload"
import { fileURLToPath } from "url"
import sharp from "sharp"

import { tr } from "@payloadcms/translations/languages/tr"
import { en } from "@payloadcms/translations/languages/en"

import { seoPlugin } from "@payloadcms/plugin-seo"
import { GenerateTitle, GenerateURL } from "@payloadcms/plugin-seo/types"
import { Page, Post } from "src/payload-types"

import { Pages } from "./collections/Pages"
import { Posts } from "./collections/Posts"
import { Categories } from "./collections/Categories"
import { Products } from "./collections/Products"
import Users from "./collections/Users"
import { Media } from "./collections/Media"
import { i18n } from "./collections/i18n"
import { revalidateRedirects } from "./hooks/revalidateRedirects"
import { getPayloadHMR } from "@payloadcms/next/utilities"
import configPromise from "@payload-config"

type DocumentType = Page | Post // Assuming Post is defined somewhere

const generateTitle: GenerateTitle<DocumentType> = ({ doc }) => {
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || ""
    return doc?.title
        ? `${doc.title} | ${siteName}`
        : process.env.NEXT_PUBLIC_SITE_NAME || ""
}

const generateURL: GenerateURL<DocumentType> = async ({
    doc,
    locale,
    collectionConfig,
}: any) => {
    const payload = await getPayloadHMR({ config: configPromise })

    const currentLang = locale
    const defaultLang = process.env.NEXT_PUBLIC_DEFAULT_LANG

    // Anasayfa olarak işaretlenmiş sayfaların slug'larını al
    let homepagePages
    try {
        homepagePages = await payload.find({
            collection: "pages",
            where: {
                homepage: { equals: "yes" },
            },
        })
    } catch (error) {
        throw new Error("Failed to fetch homepage slugs")
    }

    const homepageSlugs = homepagePages.docs.map((page) => page.slug)

    let customSlug = ""
    if (collectionConfig.slug === "posts") {
        switch (locale) {
            case "tr":
                customSlug = "icerik/"
                break
            case "en":
                customSlug = "blog/"
                break
        }
    }

    const urlPrefix =
        currentLang && currentLang !== defaultLang ? `/${currentLang}` : ""

    if (homepageSlugs.includes(doc?.slug)) {
        return `${process.env.NEXT_PUBLIC_SERVER_URL!}${urlPrefix}`
    }

    return doc?.slug
        ? `${process.env.NEXT_PUBLIC_SERVER_URL!}${urlPrefix}/${customSlug}${doc.slug}`
        : `${process.env.NEXT_PUBLIC_SERVER_URL!}${urlPrefix}`
}

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
    admin: {
        user: Users.slug,
        importMap: {
            baseDir: path.resolve(dirname),
        },
        dateFormat: "dd.MM.yyyy",
    },
    collections: [Pages, Posts, Products, Categories, Users, Media, i18n],
    editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
            ...defaultFeatures,
            FixedToolbarFeature(),
        ],
    }),
    secret: process.env.PAYLOAD_SECRET || "",
    typescript: {
        outputFile: path.resolve(dirname, "payload-types.ts"),
    },
    db: mongooseAdapter({
        url: process.env.DATABASE_URI || "",
    }),
    sharp,
    plugins: [
        seoPlugin({
            generateTitle,
            generateURL,
        }),
        redirectsPlugin({
            collections: ["pages", "posts"],
            overrides: {
                // @ts-expect-error
                fields: ({ defaultFields }) => {
                    return defaultFields.map((field) => {
                        if ("name" in field && field.name === "from") {
                            return {
                                ...field,
                                admin: {
                                    description: {
                                        en: "You will need to rebuild the website when changing this field.",
                                        tr: "Bu alanı değiştirdikten sonra uygulamayı yeniden derlemeniz gerekmektedir.",
                                    },
                                },
                            }
                        }
                        return field
                    })
                },
            },
            hooks: {
                afterChange: [revalidateRedirects],
            },
        }),
    ],
    localization: {
        locales: [
            {
                label: "Türkçe",
                code: "tr",
            },
            {
                label: "English",
                code: "en",
            },
        ],
        defaultLocale: "tr",
        fallback: true,
    },
    i18n: {
        supportedLanguages: { tr, en },
        fallbackLanguage: "tr", // default
        translations: {
            tr: {
                "plugin-seo": {
                    almostThere: "Neredeyse bitti",
                    autoGenerate: "Otomatik oluştur",
                    bestPractices: "en iyi uygulamalar",
                    characterCount:
                        "{{current}}/{{minLength}}-{{maxLength}} karakter, ",
                    charactersLeftOver: "{{characters}} karakter fazla",
                    charactersToGo: "{{characters}} karakter kaldı",
                    charactersTooMany: "{{characters}} karakter çok fazla",
                    checksPassing: "{{current}}/{{max}} kontrol başarılı",
                    good: "İyi",
                    imageAutoGenerationTip:
                        "Otomatik oluşturma, seçilen başlık görselini alacaktır.",
                    lengthTipDescription:
                        "Bu, {{minLength}} ile {{maxLength}} karakter arasında olmalıdır. Kaliteli meta açıklamaları yazmak için yardıma ihtiyacınız varsa, bkz. ",
                    lengthTipTitle:
                        "Bu, {{minLength}} ile {{maxLength}} karakter arasında olmalıdır. Kaliteli meta başlıkları yazmak için yardıma ihtiyacınız varsa, bkz. ",
                    missing: "Eksik",
                    noImage: "Görsel yok",
                    preview: "Önizleme",
                    previewDescription:
                        "Tam sonuçlar içeriğe ve arama ilgisine bağlı olarak değişiklik gösterebilir.",
                    tooLong: "Çok uzun",
                    tooShort: "Çok kısa",
                },
            },
        },
    },
})
