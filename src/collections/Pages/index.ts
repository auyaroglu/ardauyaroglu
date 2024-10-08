import type { CollectionConfig } from "payload"
import { revalidateHook } from "../../hooks/revalidate"
import { mediaFields } from "../../fields/mediaFields"
import { slugField } from "@/fields/slug"
import { populatePublishedAt } from "../../hooks/populatePublishedAt"

import {
    MetaDescriptionField,
    MetaImageField,
    MetaTitleField,
    OverviewField,
    PreviewField,
} from "@payloadcms/plugin-seo/fields"

export const Pages: CollectionConfig = {
    slug: "pages",
    labels: {
        singular: {
            en: "Page",
            tr: "Sayfa",
        },
        plural: {
            en: "Pages",
            tr: "Sayfalar",
        },
    },
    admin: {
        defaultColumns: ["title", "slug", "updatedAt"],
        useAsTitle: "title",
    },
    fields: [
        {
            name: "title",
            label: {
                en: "Title",
                tr: "Başlık",
            },
            type: "text",
            required: true,
            localized: true,
        },
        {
            name: "subtitle",
            label: {
                en: "Sub Title",
                tr: "Alt Başlık",
            },
            type: "text",
            localized: true,
        },
        {
            name: "subContent",
            label: {
                en: "Short Description",
                tr: "Kısa Açıklama",
            },
            type: "richText",
            localized: true,
        },
        {
            name: "content",
            label: {
                en: "Page Content",
                tr: "Sayfa İçeriği",
            },
            type: "richText",
            localized: true,
        },
        {
            name: "publishedAt",
            label: {
                en: "Published At",
                tr: "Yayınlanma Tarihi",
            },
            type: "date",
            admin: {
                position: "sidebar",
                date: {
                    displayFormat: "dd.MM.YYYY",
                },
            },
        },
        ...slugField(),
        ...mediaFields, // Media fields
        {
            name: "showInMenu",
            label: {
                en: "Show in Menu",
                tr: "Menüde Göster",
            },
            type: "select",
            defaultValue: "yes",
            options: [
                {
                    label: {
                        en: "Yes",
                        tr: "Evet",
                    },
                    value: "yes",
                },
                {
                    label: {
                        en: "No",
                        tr: "Hayır",
                    },
                    value: "no",
                },
            ],
            admin: {
                position: "sidebar",
            },
        },
        {
            name: "published",
            label: {
                en: "Published",
                tr: "Yayınlanma",
            },
            type: "select",
            defaultValue: "published",
            options: [
                {
                    label: {
                        en: "Published",
                        tr: "Yayınla",
                    },
                    value: "published",
                },
                {
                    label: {
                        en: "Draft",
                        tr: "Taslak",
                    },
                    value: "draft",
                },
            ],
            admin: {
                position: "sidebar",
            },
        },
        // SEO fields
        {
            name: "meta",
            label: "SEO",
            type: "group", // Use a group type for better organization
            fields: [
                OverviewField({
                    titlePath: "meta.title",
                    descriptionPath: "meta.description",
                    imagePath: "meta.image",
                }),
                MetaTitleField({
                    hasGenerateFn: true, // Enable auto-generate function
                }),
                MetaImageField({
                    relationTo: "media",
                }),
                MetaDescriptionField({}),
                PreviewField({
                    hasGenerateFn: true,
                    titlePath: "meta.title",
                    descriptionPath: "meta.description",
                }),
            ],
        },
    ],
    hooks: {
        afterChange: [revalidateHook], // Revalidate after changes
        beforeChange: [populatePublishedAt],
    },
    timestamps: true,
}
