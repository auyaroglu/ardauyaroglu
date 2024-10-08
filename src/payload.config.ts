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
import { Page } from "src/payload-types"

import { Pages } from "./collections/Pages"
import { Products } from "./collections/Products"
import { Users } from "./collections/Users"
import { Media } from "./collections/Media"
import { i18n } from "./collections/i18n"
import { revalidateRedirects } from "./hooks/revalidateRedirects"

const generateTitle: GenerateTitle<Page> = ({ doc }) => {
    return doc?.title ? `${doc.title} | Arda Uyaroğlu` : "Arda Uyaroğlu"
}

const generateURL: GenerateURL<Page> = ({ doc, locale }) => {
    const currentLang = locale // Belge üzerindeki mevcut dil (örneğin 'en', 'tr', 'de')
    const defaultLang = process.env.NEXT_PUBLIC_DEFAULT_LANG || "tr" // Varsayılan dili .env'den alırız (örn: 'tr')

    // Eğer dil Türkçe ise slug direk gelir, değilse dil kodunu ekleriz
    const urlPrefix =
        currentLang && currentLang !== defaultLang ? `/${currentLang}` : ""

    return doc?.slug
        ? `${process.env.NEXT_PUBLIC_SERVER_URL!}${urlPrefix}/${doc.slug}`
        : process.env.NEXT_PUBLIC_SERVER_URL!
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
        avatar: "gravatar",
    },
    collections: [Pages, Products, Users, Media, i18n],
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
            collections: ["pages"],
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
