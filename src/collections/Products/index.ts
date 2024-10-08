import type { CollectionConfig } from "payload"
import { mediaFields } from "../../fields/mediaFields"
import { seoFields } from "../../fields/seoFields"
import { slugField } from "@/fields/slug"

export const Products: CollectionConfig = {
    slug: "products",
    labels: {
        singular: {
            en: "Product",
            tr: "Ürün",
        },
        plural: {
            en: "Products",
            tr: "Ürünler",
        },
    },
    admin: {
        defaultColumns: ["title", "slug", "updatedAt"],
        useAsTitle: "title",
    },
    fields: [
        {
            name: "title",
            type: "text",
            required: true,
        },
        {
            name: "description",
            type: "richText",
        },
        {
            name: "price",
            type: "number",
            required: true,
        },
        ...slugField(),
        ...mediaFields, // Media alanları
        // SEO alanları
        {
            name: "seo",
            type: "group",
            label: "SEO", // Grubun başlığı
            fields: seoFields, // SEO alanlarını burada ekliyoruz
            admin: {
                position: "sidebar",
            },
        },
    ],
    timestamps: true,
}
