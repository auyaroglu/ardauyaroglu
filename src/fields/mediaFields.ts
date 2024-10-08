// fields/mediaFields.ts
import { Field } from "payload"

export const mediaFields: Field[] = [
    {
        name: "image",
        type: "upload",
        relationTo: "media",
    },
]
