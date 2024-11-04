import { CollectionConfig } from "payload"
import { slugField } from "@/fields/slug"
import {
    MetaDescriptionField,
    MetaImageField,
    MetaTitleField,
    OverviewField,
    PreviewField,
} from "@payloadcms/plugin-seo/fields"
import { mediaFields } from "@/fields/mediaFields"

import { revalidatePost } from "./hooks/revalidatePost"
import { populateAuthors } from "./hooks/populateAuthors"
import { authenticated } from "@/access/authenticated"
import { authenticatedOrPublished } from "@/access/authenticatedOrPublished"

export const Posts: CollectionConfig = {
    slug: "posts",
    access: {
        create: authenticated,
        delete: authenticated,
        read: authenticatedOrPublished,
        update: authenticated,
    },
    labels: {
        singular: "Blog",
        plural: {
            en: "Blogs",
            tr: "Bloglar",
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
        {
            name: "authors",
            label: {
                tr: "Yazar",
                en: "Author",
            },
            type: "relationship",
            admin: {
                position: "sidebar",
            },
            hasMany: true,
            relationTo: "users",
        },
        {
            name: "populatedAuthors",
            label: {
                tr: "Yazarlar",
                en: "Authors",
            },
            type: "array",
            access: {
                update: () => false,
            },
            admin: {
                disabled: true,
                readOnly: true,
            },
            fields: [
                {
                    name: "id",
                    type: "text",
                },
                {
                    name: "name",
                    type: "text",
                },
            ],
        },
    ],
    hooks: {
        afterChange: [revalidatePost],
        afterRead: [populateAuthors],
    },
    versions: {
        drafts: {
            autosave: {
                interval: 100, // We set this interval for optimal live preview
            },
        },
        maxPerDoc: 50,
    },
    timestamps: true,
}
