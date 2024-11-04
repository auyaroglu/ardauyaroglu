import type { CollectionConfig } from "payload"

import { slugField } from "@/fields/slug"

export const Categories: CollectionConfig = {
    slug: "categories",
    labels: {
        singular: {
            en: "Category",
            tr: "Kategori",
        },
        plural: {
            en: "Categories",
            tr: "Kategoriler",
        },
    },
    admin: {
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
            localized: true,
            required: true,
        },
        ...slugField(),
    ],
}
