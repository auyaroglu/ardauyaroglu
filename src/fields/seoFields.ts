// fields/seoFields.ts
import { Field } from "payload"

export const seoFields: Field[] = [
    {
        name: "metaTitle",
        type: "text",
        label: "Meta Title",
        required: true,
    },
    {
        name: "metaDescription",
        type: "text",
        label: "Meta Description",
        required: true,
    },
    {
        name: "metaImage",
        type: "upload",
        relationTo: "media",
        label: "Meta Image",
    },
]
