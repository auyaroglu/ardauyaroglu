import { CollectionConfig } from "payload"

export const i18n: CollectionConfig = {
    slug: "i18n",
    admin: {
        defaultColumns: ["en", "tr", "select"],
    },
    fields: [
        {
            name: "inputType",
            label: {
                en: "Select Input Type",
                tr: "İçerik Türünü Seçiniz",
            },
            type: "select",
            options: [
                {
                    label: {
                        en: "Plain Text (Short Text)",
                        tr: "Düz Metin (Kısa Metin)",
                    },
                    value: "text",
                },
                {
                    label: {
                        en: "Text Area (Long Text)",
                        tr: "Metin Alanı (Uzun Metin)",
                    },
                    value: "textarea",
                },
                {
                    label: {
                        en: "Rich Text Editor",
                        tr: "Zengin Metin Editörü",
                    },
                    value: "richtext",
                },
            ],
            required: true,
            defaultValue: "text", // Default to Plain Text
        },
        // English Content Fields
        {
            name: "en",
            label: {
                en: "Content (English)",
                tr: "İçerik (İngilizce)",
            },
            type: "text",
            admin: {
                condition: (data) => data.inputType === "text",
            },
        },
        {
            name: "enTextarea",
            label: {
                en: "Content (English - Text Area)",
                tr: "İçerik (İngilizce - Metin Alanı)",
            },
            type: "textarea",
            admin: {
                condition: (data) => data.inputType === "textarea",
            },
        },
        {
            name: "enRichText",
            label: {
                en: "Content (English - Rich Text)",
                tr: "İçerik (İngilizce - Zengin Metin)",
            },
            type: "richText",
            admin: {
                condition: (data) => data.inputType === "richtext",
            },
        },
        // Turkish Content Fields
        {
            name: "tr",
            label: {
                en: "Content (Turkish)",
                tr: "İçerik (Türkçe)",
            },
            type: "text",
            admin: {
                condition: (data) => data.inputType === "text",
            },
        },
        {
            name: "trTextarea",
            label: {
                en: "Content (Turkish - Text Area)",
                tr: "İçerik (Türkçe - Metin Alanı)",
            },
            type: "textarea",
            admin: {
                condition: (data) => data.inputType === "textarea",
            },
        },
        {
            name: "trRichText",
            label: {
                en: "Content (Turkish - Rich Text)",
                tr: "İçerik (Türkçe - Zengin Metin)",
            },
            type: "richText",
            admin: {
                condition: (data) => data.inputType === "richtext",
            },
        },
    ],
}
